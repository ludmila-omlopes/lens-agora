import { thirdwebClient } from "./client/thirdwebClient";
import { getContract } from "thirdweb/contract";
import { getAddress, NFT, prepareEvent, readContract } from "thirdweb";
import { lensTestnetChain } from "./lensNetwork";
import { cancelListing as callCancelListing, createListing, getAllListings, getAllValidAuctions, getAllValidListings, getListing, isBuyFromListingSupported, isCreateAuctionSupported, isCreateListingSupported, updateListing } from "thirdweb/extensions/marketplace";
import { sendTransaction } from "thirdweb";
import { approve } from "thirdweb/extensions/erc20";
import { approveNFT, getCurrentCollection, getCurrentNFT } from "./nfts";
import { getContractEvents } from "thirdweb";
import { newListingEvent, cancelAuction as callCancelAuction } from "thirdweb/extensions/marketplace";
import { Collection, CollectionMarketplaceInfo, ListingWithProfile, MarketplaceInfo } from "./types";
import { getProfileByAddress } from "./profileUtils";

export const marketplaceContractAddress = "0x06A4d039c7450628d52F2D81f59DBD948E07DbdA";

export const contract = getContract({
    client: thirdwebClient,
    chain: lensTestnetChain,
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
  chain: lensTestnetChain,
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


export async function getNFTMarketplaceInfo(nft: NFT, nftAddress: string) {
  //todo: talvez é melhor pegar todas as listings e auctions
  //pensar no listingtype 
  const marketplaceInfo = {} as MarketplaceInfo;
  const collection = await getCurrentCollection({ contractAdd: nftAddress });
  if (!collection) {
    return null;
  }

  const listings = await getAllValidListings({contract}); //só pega de 100 em 100, tem que indexar
  
  const currentListing = listings.find((listing) => listing.tokenId === nft.id && getAddress(listing.assetContractAddress) === getAddress(nftAddress));

  const validAuctions = await getAllValidAuctions({
    contract,
    start: 0,
    count: BigInt(10),
  });

  const currentAuction = validAuctions.find((auction) => auction.tokenId === nft.id && getAddress(auction.assetContractAddress) === getAddress(nftAddress));

  marketplaceInfo.listing = currentListing!;
  marketplaceInfo.nft = nft;
  marketplaceInfo.listingType = 'DIRECT'
  marketplaceInfo.collection = collection;
  marketplaceInfo.auction = currentAuction!;
  
  return marketplaceInfo;
}

export async function getCollectionMarketplaceInfo(collectionAddress: string) {
  if (!collectionAddress) {
    return null;
  }

  const listings = await getAllValidListings({contract}); //só pega de 100 em 100, tem que indexar
  const validListings = listings.filter((listing) => getAddress(listing.assetContractAddress) === getAddress(collectionAddress));

  const collectionMarketplaceInfo = {} as CollectionMarketplaceInfo;
  collectionMarketplaceInfo.collectionAddress = collectionAddress;
  collectionMarketplaceInfo.totalListedItems = validListings.length;
  collectionMarketplaceInfo.floorPrice = validListings && validListings.length > 0 ? (validListings.reduce((minPrice, listing) => Math.min(minPrice, Number(listing.pricePerToken)), Infinity))/(10**18) : 0;
  collectionMarketplaceInfo.minBid = 0; //todo: calcular menor lance
  collectionMarketplaceInfo.volumeTraded = 0; //todo: calcular volume de transações
  return collectionMarketplaceInfo;
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

  const listingsWithProfiles: Array<ListingWithProfile> = await Promise.all(
    allListingsAndAuctions.map(async (listing) => {
      try {
        const profile = await getProfileByAddress(listing.creatorAddress);
        return {
          ...listing,
          creatorProfile: profile?.name || 'Unknown Creator', // Add profile name or fallback
        } as ListingWithProfile;
      } catch (error) {
        console.error(`Failed to fetch profile for address ${listing.creatorAddress}:`, error);
        return {
          ...listing,
          creatorProfile: 'Unknown Creator', // Fallback if profile fetch fails
        } as ListingWithProfile;
      }
    })
  );

  return listingsWithProfiles;
}

export async function cancelAuction(account: any, auctionId: bigint) {
  const transaction = callCancelAuction({
    contract,
    auctionId: auctionId,
  });
   
  await sendTransaction({ transaction, account });
}