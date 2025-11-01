import { thirdwebClient } from "./client/thirdwebClient";
import { getContract } from "thirdweb/contract";
import { Address, defineChain, getAddress, NATIVE_TOKEN_ADDRESS, NFT, prepareEvent, readContract, sendAndConfirmTransaction } from "thirdweb";
import { activeChain, USE_TESTNET } from "./lensNetwork";
import { bidInAuction as callBidInAuction, cancelListing as callCancelListing, 
  createListing, getAllListings, getAllValidOffers as callGetAllValidOffers, getAllOffers as callGetAllOffers,
  getAllValidAuctions, getAllValidListings, getListing, 
  isBuyFromListingSupported, isCreateAuctionSupported, isCreateListingSupported, 
  updateListing, makeOffer as callMakeOffer, acceptOffer as callAcceptOffer, 
  totalListings,
  getOffer,
  getAuction,
  getWinningBid} from "thirdweb/extensions/marketplace";
import { sendTransaction } from "thirdweb";
import { allowance, approve, getApprovalForTransaction } from "thirdweb/extensions/erc20";
import { approveNFT, getCurrentCollection, getCurrentNFT } from "./nfts";
import { getContractEvents, watchContractEvents } from "thirdweb";
import { getSocialProfiles } from "thirdweb/social";
import { cancelAuction as callCancelAuction } from "thirdweb/extensions/marketplace";
import { ActivityItem, ActivityType, Collection, CollectionMarketplaceInfo, ListingWithProfile, MarketplaceInfo, NFTScope, Range } from "./types";
import { getProfileByAddress } from "./profileUtils";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import {
  // Events
  newListingEvent,
  updatedListingEvent,
  cancelledListingEvent,
  buyerApprovedForListingEvent,
  currencyApprovedForListingEvent,
  newOfferEvent,
  cancelledOfferEvent,
  acceptedOfferEvent,
  newAuctionEvent,
  newBidEvent,
  cancelledAuctionEvent,
  auctionClosedEvent,
  newSaleEvent,
} from "thirdweb/extensions/marketplace";
import { Transaction } from "ethers";

const testnetMarketplaceContractAddress = "0x06A4d039c7450628d52F2D81f59DBD948E07DbdA";
const mainnetMarketplaceContractAddress = "0xF2c26bf3b27AfEd3a60cE8cB555fE2cE3197cE99";

export const marketplaceContractAddress = USE_TESTNET ? testnetMarketplaceContractAddress : mainnetMarketplaceContractAddress;

export const contract = getContract({
    client: thirdwebClient,
    chain: activeChain,
    address: marketplaceContractAddress, //contrato do marketplace
  });


//ainda não vou usar essa função pois o botão de listagem direta já faz isso, com approve
export async function createNewListing(account: any, nftAddress: string,  _tokenId: bigint, _quantity: bigint, _pricePerToken: bigint, _startTimestamp: Date, _endTimestamp: Date, _currency?: string) {
   
  //const isListingSupported = isCreateListingSupported([marketplaceContractAddress]);
  //if (!isListingSupported) {
   // throw new Error("createListing is not supported");
 // }

 const nftcontract = getContract({
  client: thirdwebClient,
  chain: activeChain ,
  address: nftAddress, //contrato do marketplace
});

 /*const approve = await approveNFT(nft);

  console.log("approveTransaction1: ", approveTransaction);
  console.log("account: ", account);

  const resl = await sendTransaction({ transaction: approveTransaction, account });
  console.log("approveTransaction: ", resl);*/

  const transaction = createListing({
    contract,
    assetContractAddress: nftAddress,
    tokenId: _tokenId,
    quantity: _quantity,
    pricePerToken: _pricePerToken.toString(),
  //  startTimestamp: _startTimestamp,
   // endTimestamp: _endTimestamp,
  });

  //isReservedListing: false, //Whether the listing is reserved to be bought from a specific set of buyers
  //currencyContractAddress: "0x..." //The contract address of the currency to accept for the listing
   
  await sendTransaction({ transaction, account });
}

export async function editListing(account: any, _listingId: bigint, _pricePerToken: bigint, _startTimestamp: Date, _endTimestamp: Date) {
  
  const transaction = updateListing({
    contract,
    listingId: _listingId,
    pricePerToken: _pricePerToken.toString(),
    startTimestamp: _startTimestamp,
    endTimestamp: _endTimestamp,
  });

  await sendTransaction({ transaction, account });
}

export async function cancelListing(account: any, listingId: bigint) {
  const transaction = callCancelListing({
    contract,
    listingId: listingId,
  });
   
  await sendTransaction({ transaction, account });
}


async function getCurrentListingForNFT(tokenAddress: string, tokenId: bigint) {

    const listings = await getAllValidListings({
      contract
    });

    const currentListing = listings.find((listing) => 
      listing.asset.id === tokenId && 
      getAddress(listing.assetContractAddress) === getAddress(tokenAddress)
    );

  return currentListing;
}

async function getCurrentAuctionForNFT(tokenAddress: string, tokenId: bigint) {
  const validAuctions = await getAllValidAuctions({contract});
  
  const currentAuction = validAuctions.find((auction) => 
    auction.tokenId === tokenId && 
    getAddress(auction.assetContractAddress) === getAddress(tokenAddress)
  );

  return currentAuction;
}

export async function getNFTMarketplaceInfo(tokenAddress: string, tokenId: bigint) {
  //todo: talvez é melhor pegar todas as listings e auctions
  //pensar no listingtype 
  const marketplaceInfo = {} as MarketplaceInfo;

  // Parallelize the calls since they are independent
  const [currentListing, currentAuction, lastSale] = await Promise.all([
    getCurrentListingForNFT(tokenAddress, tokenId),
    getCurrentAuctionForNFT(tokenAddress, tokenId),
    getLastSaleForNFT(tokenAddress, tokenId)
  ]);

  if (currentAuction) {
    const winningBid = await getWinningBid({
      contract,
      auctionId: currentAuction.id,
    });
    marketplaceInfo.winningBid = winningBid;
  }

  console.log("lastSale: ", lastSale);
  
  marketplaceInfo.listing = currentListing!;
  marketplaceInfo.nftAddress = tokenAddress;
  marketplaceInfo.nftId = tokenId;
  marketplaceInfo.auction = currentAuction!;
  marketplaceInfo.lastSale = lastSale!;
  
  return marketplaceInfo;
}

export async function getCollectionMarketplaceInfo(collectionAddress: string) {
  try {
    if (!collectionAddress) {
      throw new Error("Collection address is required");
    }

    let listings;
    try {
      listings = await getAllValidListings({contract}); //só pega de 100 em 100, tem que indexar
    } catch (error) {
      throw new Error(`Failed to fetch listings: ${error instanceof Error ? error.message : String(error)}`);
    }

    let validListings;
    try {
      validListings = listings.filter((listing) => getAddress(listing.assetContractAddress) === getAddress(collectionAddress));
    } catch (error) {
      throw new Error(`Failed to filter listings: ${error instanceof Error ? error.message : String(error)}`);
    }

    const collectionMarketplaceInfo = {} as CollectionMarketplaceInfo;
    
    try {
      collectionMarketplaceInfo.collectionAddress = collectionAddress;
      collectionMarketplaceInfo.totalListedItems = validListings.length;
      collectionMarketplaceInfo.floorPrice = validListings && validListings.length > 0 ? 
        (validListings.reduce((minPrice, listing) => Math.min(minPrice, Number(listing.pricePerToken)), Infinity))/(10**18) : 0;
      collectionMarketplaceInfo.minBid = 0; //todo: calcular menor lance
      collectionMarketplaceInfo.volumeTraded = 0; //todo: calcular volume de transações
    } catch (error) {
      throw new Error(`Failed to process marketplace info: ${error instanceof Error ? error.message : String(error)}`);
    }

    return collectionMarketplaceInfo;

  } catch (error) {
    console.error("Error in getCollectionMarketplaceInfo:", error);
    throw error;
  }
}

export async function getAllListingsByAddress(address: string) {
  const listings = await getAllValidListings({contract});
  return listings.filter((listing) => getAddress(listing.creatorAddress) === getAddress(address));
}

export async function getFeaturedListings() {
  const featuredListingIds = process.env.NEXT_PUBLIC_FEATURED_LISTINGS_IDS?.split(",").map(id => BigInt(id.trim())) || [1n, 2n, 3n];

  //todo: precisa testar se todos os ids realmente existem listagem
  const featuredListings = await Promise.all(featuredListingIds.map((listingId) => getListingById(listingId)));
  return featuredListings;
}


async function getListingById(listingId: bigint) {
  return await getListing({ contract, listingId: listingId });
}

export async function getAllValidListingsWithProfile() {

  const listings = await getAllValidListings({ contract });
  const auctions = await getAllValidAuctions({ contract });
  const allListingsAndAuctions = [...listings, ...auctions];

  // Get unique creator addresses
  const uniqueAddresses = [...new Set(allListingsAndAuctions.map(listing => listing.creatorAddress))];
  
  // Fetch all profiles in a single call
  let profiles: any[] = [];
  try {
    const profilesResult = await getProfileByAddress(uniqueAddresses);
    profiles = Array.isArray(profilesResult) ? profilesResult : [profilesResult];
  } catch (error) {
    console.error('Failed to fetch profiles:', error);
  }

  // Create a map for quick profile lookup
  const profileMap = new Map();
  profiles.forEach((profile, index) => {
    if (profile && uniqueAddresses[index]) {
      profileMap.set(uniqueAddresses[index], profile);
    }
  });

  // Map listings with their corresponding profiles
  const listingsWithProfiles: Array<ListingWithProfile> = allListingsAndAuctions.map((listing) => {
    const profile = profileMap.get(listing.creatorAddress);
    return {
      ...listing,
      creatorProfile: profile?.name || 'Unknown Creator',
    } as ListingWithProfile;
  });

  return listingsWithProfiles;
}

export async function cancelAuction(account: any, auctionId: bigint) {
  const transaction = callCancelAuction({
    contract,
    auctionId: auctionId,
  });
   
  await sendTransaction({ transaction, account });
}

export async function bidInAuction(account: any, auctionId: bigint, bidAmount: string) {
  const transaction = callBidInAuction({
    contract,
    auctionId: auctionId,
    bidAmount: bidAmount,
  });
   
  await sendTransaction({ transaction, account });
}

export async function getAllValidOffers(collectionAddress: string, tokenId: bigint) {
  const offers = await callGetAllOffers({contract});

  const validOffers = offers.filter((offer) => getAddress(offer.assetContractAddress) === getAddress(collectionAddress) && offer.tokenId === tokenId);
  return validOffers; 
}

export async function makeOffer(account: any, collectionAddress: string, tokenId: bigint, offerAmount: string, offerExpiresAt: Date) {
    
  const tx = callMakeOffer({
    contract,
    assetContractAddress: getAddress(collectionAddress),
    tokenId: BigInt(tokenId),
    totalOffer: offerAmount,
    offerExpiresAt: offerExpiresAt,
    currencyContractAddress: "0xeee5a340Cdc9c179Db25dea45AcfD5FE8d4d3eB8" //wgrass todo: get from user
  });
  
  const contractWgrass = getContract({
    address: "0xeee5a340Cdc9c179Db25dea45AcfD5FE8d4d3eB8",
    chain: activeChain,
    client: thirdwebClient,
  });
  
  const approvedValue = await allowance({
    contract: contractWgrass,
    owner: account.address,
    spender: contract.address,
  });

  console.log("approvedValue: ", approvedValue);

  const appTx =  approve({
    contract: contractWgrass,
    amount: offerAmount,
    spender: contract.address,
  });

  console.log("approveTransaction: ", appTx);
  await sendTransaction({ transaction: appTx, account });

  const offerTx2 = callMakeOffer({
    contract,
    assetContractAddress: "0x1234567890123456789012345678901234567890",
    tokenId: 1n,
    offerExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    totalOffer: "1.0",
    currencyContractAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
   });

   return tx;
   
  //await sendTransaction({ transaction: tx, account });
}

export async function acceptOffer(account: any, offerId: bigint) {
  const transaction = callAcceptOffer({
    contract,
    offerId: offerId,
  });
   
  await sendTransaction({ transaction, account });
}


// Build event queries filtered only by assetContract
function buildEventQueries(assetContract: Address) {
  return [
    newListingEvent({ assetContract }),
    updatedListingEvent({ assetContract }),
    //cancelledListingEvent({ assetContract }),
    //buyerApprovedForListingEvent({ assetContract, approved: true }),
    //currencyApprovedForListingEvent({ assetContract, approved: true }),

    newOfferEvent({ assetContract }),
    //cancelledOfferEvent({ assetContract }),
    acceptedOfferEvent({ assetContract }),

    newAuctionEvent({ assetContract }),
    newBidEvent({ assetContract }),
    // cancelledAuctionEvent({ assetContract }),
    auctionClosedEvent({ assetContract }),

    newSaleEvent({ assetContract }),
  ];
}


function uid(txHash: string, logIndex: number) {
  return txHash ? `${txHash}:${logIndex}` : "";
}

// Normalize one decoded log into ActivityItem
function normalizeLog(log: any): ActivityItem | null {
  const { args, eventName, transactionHash, logIndex, blockNumber, blockTimestamp } = log;
  const base = {
    id: uid(transactionHash, logIndex),
    txHash: transactionHash,
    blockNumber: BigInt(blockNumber ?? 0),
    // thirdweb can expose timestamp on transaction.blockTimestamp in some clients
    blockTimestamp: blockTimestamp ? new Date(blockTimestamp * 1000).toLocaleString() : undefined,
  } as const;

  switch (eventName) {
    case "NewListing":
      return {
        ...base,
        type: ActivityType.NewListing,
        assetContract: args.assetContract,
        tokenId: args.listing.tokenId,
        actor: args.listingCreator,
        price: Number(args.listing.pricePerToken) / 10**18,
        currency: args.currency,
        quantity: args.quantity,
        listingId: args.listingId,
      };
    case "UpdatedListing":
      return {
        ...base,
        type: ActivityType.UpdatedListing,
        assetContract: args.assetContract,
        tokenId: args.listing.tokenId,
        price: Number(args.pricePerToken) / 10**18,
        currency: args.currency,
        quantity: args.quantity,
        listingId: args.listingId,
      };
    case "CancelledListing":
      return {
        ...base,
        type: ActivityType.CancelledListing,
        assetContract: args.assetContract,
        tokenId: args.listing.tokenId,
        actor: args.lister,
        listingId: args.listingId,
      };
    case "BuyerApprovedForListing":
      if (!args.approved) return null;
      return {
        ...base,
        type: ActivityType.BuyerApprovedForListing,
        assetContract: args.assetContract,
        tokenId: args.listing.tokenId,
        actor: args.buyer,
        listingId: args.listingId,
      };
    case "CurrencyApprovedForListing":
      if (!args.approved) return null;
      return {
        ...base,
        type: ActivityType.CurrencyApprovedForListing,
        assetContract: args.assetContract,
        tokenId: args.listing.tokenId,
        currency: args.currency,
        listingId: args.listingId,
      };
    case "NewOffer":
      return {
        ...base,
        type: ActivityType.NewOffer,
        assetContract: args.assetContract,
        tokenId: args.tokenId,
        actor: args.offeror,
        price: Number(args.totalPrice) / 10**18,
        currency: args.currency,
        quantity: args.quantity,
        offerId: args.offerId,
      };
    case "CancelledOffer":
      return {
        ...base,
        type: ActivityType.CancelledOffer,
        assetContract: args.assetContract,
        tokenId: args.tokenId,
        actor: args.offeror,
        offerId: args.offerId,
      };
    case "AcceptedOffer":
      return {
        ...base,
        type: ActivityType.AcceptedOffer,
        assetContract: args.assetContract,
        tokenId: args.tokenId,
        actor: args.seller,
        counterparty: args.offeror,
        price: Number(args.totalPrice) / 10**18,
        currency: args.currency,
        quantity: args.quantity,
        offerId: args.offerId,
      };
    case "NewAuction":
      return {
        ...base,
        type: ActivityType.NewAuction,
        assetContract: args.assetContract,
        tokenId: args.auction.tokenId,
        actor: args.auctionCreator,
        price: Number(args.auction.minimumBidAmount) / 10**18,
        currency: args.auctioncurrency,
        auctionId: args.auctionauctionId,
      };
    case "NewBid":
      return {
        ...base,
        type: ActivityType.NewBid,
        assetContract: args.assetContract,
        tokenId: args.tokenId,
        actor: args.bidder,
        price: Number(args.bidAmount) / 10**18,
        currency: args.currency,
        auctionId: args.auctionId,
      };
    case "CancelledAuction":
      return {
        ...base,
        type: ActivityType.CancelledAuction,
        assetContract: args.assetContract,
        tokenId: args.auction.tokenId,
        actor: args.seller,
        auctionId: args.auctionId,
      };
    case "AuctionClosed":
      return {
        ...base,
        type: ActivityType.AuctionClosed,
        assetContract: args.assetContract,
        tokenId: args.auction.tokenId,
        actor: args.closer,
        counterparty: args.winner,
        price: Number(args.winningBid) / 10**18,
        currency: args.currency,
        auctionId: args.auctionId,
      };
    case "NewSale":
      return {
        ...base,
        type: ActivityType.NewSale,
        assetContract: args.assetContract,
        tokenId: args.tokenId,
        actor: args.listingCreator,
        counterparty: args.buyer,
        price: Number(args.totalPricePaid) / 10**18,
        currency: args.currency,
        quantity: args.quantity,
        listingId: args.listingId,
        offerId: args.offerId,
        auctionId: args.auctionId,
      };
    default:
      return null;
  }
}

function sortAndDedupe(items: ActivityItem[]) {
  const byKey = new Map<string, ActivityItem>();
  for (const i of items) {
    const key = `${i.type}:${i.txHash}:${i.listingId ?? ""}:${i.offerId ?? ""}:${i.auctionId ?? ""}`;
    if (!byKey.has(key)) byKey.set(key, i);
  }
  return [...byKey.values()].sort((a, b) => {
    const at = a.blockTimestamp ?? '';
    const bt = b.blockTimestamp ?? '';
    if (at !== bt) return bt.localeCompare(at);
    if (a.blockNumber !== b.blockNumber) return Number(b.blockNumber - a.blockNumber);
    return a.id > b.id ? -1 : 1;
  });
}

// Enrich items that only have listingId/offerId/auctionId but missing tokenId or assetContract
export async function enrichMissingTokenInfo(
  contract: any,
  items: ActivityItem[]
): Promise<ActivityItem[]> {
  const needListing = new Set<string>();
  const needOffer = new Set<string>();
  const needAuction = new Set<string>();

  for (const i of items) {
    const missing = !i.tokenId || !i.assetContract;
    if (!missing) continue;
    if (i.listingId) needListing.add(i.listingId.toString());
    if (i.offerId) needOffer.add(i.offerId.toString());
    if (i.auctionId) needAuction.add(i.auctionId.toString());
  }

  const listingMap = new Map<string, { assetContract: Address; tokenId: bigint }>();
  const offerMap = new Map<string, { assetContract: Address; tokenId: bigint }>();
  const auctionMap = new Map<string, { assetContract: Address; tokenId: bigint }>();

  await Promise.all([
    ...Array.from(needListing).map(async (id) => {
      const l = await getListing({ contract, listingId: BigInt(id) });
      listingMap.set(id, { assetContract: l.assetContractAddress as Address, tokenId: BigInt(l.tokenId) });
    }),
    ...Array.from(needOffer).map(async (id) => {
      const o = await getOffer({ contract, offerId: BigInt(id) });
      offerMap.set(id, { assetContract: o.assetContractAddress as Address, tokenId: BigInt(o.tokenId) });
    }),
    ...Array.from(needAuction).map(async (id) => {
      const a = await getAuction({ contract, auctionId: BigInt(id) });
      auctionMap.set(id, { assetContract: a.assetContractAddress as Address, tokenId: BigInt(a.tokenId) });
    }),
  ]);

  return items.map((i) => {
    if (i.tokenId && i.assetContract) return i;
    if (i.listingId && listingMap.has(i.listingId.toString())) {
      const d = listingMap.get(i.listingId.toString())!;
      return { ...i, assetContract: d.assetContract, tokenId: d.tokenId };
    }
    if (i.offerId && offerMap.has(i.offerId.toString())) {
      const d = offerMap.get(i.offerId.toString())!;
      return { ...i, assetContract: d.assetContract, tokenId: d.tokenId };
    }
    if (i.auctionId && auctionMap.has(i.auctionId.toString())) {
      const d = auctionMap.get(i.auctionId.toString())!;
      return { ...i, assetContract: d.assetContract, tokenId: d.tokenId };
    }
    return i;
  });
}

/**
 * Fetch activity for one assetContract, then client side filter by tokenId.
 */
export async function fetchNftActivity(
  scope: NFTScope,
  range?: Range
) {
  const events = buildEventQueries(scope.assetContract);

  const logs = await getContractEvents({
    contract,
    events,
    fromBlock: range?.fromBlock ? BigInt(range.fromBlock) : undefined,
  });

  let items = logs.map((l: any) => normalizeLog(l)).filter((x: any) => !!x) as ActivityItem[];

  // Client-side token filter
  if (scope.tokenId !== undefined) {
    items = items.filter(
      (i) => i.tokenId === scope.tokenId && i.assetContract?.toLowerCase() === scope.assetContract.toLowerCase()
    );
  }


  return sortAndDedupe(items);
}

async function getLastSaleForNFT(tokenAddress: string, tokenId: bigint) {
  const preparedEvent =  newSaleEvent({
    assetContract: getAddress(tokenAddress)
  });

  const events = await getContractEvents({
    contract,
    events: [preparedEvent],

  });

  const lastSale = events.find((event) => 
    event.args.tokenId === tokenId && 
  getAddress(event.args.assetContract) === getAddress(tokenAddress)
  );
  return lastSale;
}
