import { thirdwebClient } from "./client/thirdwebClient";
import { getContract } from "thirdweb/contract";
import { getAddress, NFT, prepareEvent, readContract } from "thirdweb";
import { lensTestnetChain } from "./lensNetwork";
import { createListing, getAllValidListings, getListing, isBuyFromListingSupported, isCreateAuctionSupported, isCreateListingSupported, updateListing } from "thirdweb/extensions/marketplace";
import { sendTransaction } from "thirdweb";
import { approve } from "thirdweb/extensions/erc20";
import { approveNFT, getCurrentNFT } from "./nfts";
import { getContractEvents } from "thirdweb";
import { newListingEvent } from "thirdweb/extensions/marketplace";
import { MarketplaceInfo } from "./types";

export const marketplaceContractAddress = "0x06A4d039c7450628d52F2D81f59DBD948E07DbdA";

const contract = getContract({
    client: thirdwebClient,
    chain: lensTestnetChain,
    address: marketplaceContractAddress, //contrato do marketplace
  });


export async function getAllListings(_startId: bigint, _endId: bigint) {
    const data = await readContract({
        contract,
        method:
          "function getAllListings(uint256 _startId, uint256 _endId) view returns ((uint256 listingId, uint256 tokenId, uint256 quantity, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, address listingCreator, address assetContract, address currency, uint8 tokenType, uint8 status, bool reserved)[] _allListings)",
        params: [_startId, _endId],
      });

    return data;
}

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


export async function getNFTMarketplaceInfo(nft: NFT, nftAddress: string) {
  //preciso saber se o NFT está listado, e se sim todas as informações do listing e dar opção de alguem comprar.
  //senão, saber se ele é listável, se é da pessoa logada.
  //todo: pegar auction status
  const marketplaceInfo = {} as MarketplaceInfo;

  const listings = await getAllValidListings({contract}); //se tiver muitas listagens esse método vai ficar pesado
  const currentListing = listings.find((listing) => listing.tokenId === nft.id && listing.assetContractAddress === nftAddress);

  marketplaceInfo.status = currentListing ? "ACTIVE" : "INACTIVE"; //todo: verificar se é auction
  marketplaceInfo.price = currentListing ? currentListing.pricePerToken : 0n; //todo: verificar se é auction
  marketplaceInfo.seller = currentListing?.creatorAddress!;
  
  
  return currentListing;
}

export async function getAllListingsByAddress(address: string) {
  const listings = await getAllValidListings({contract});
  return listings.filter((listing) => getAddress(listing.creatorAddress) === getAddress(address));
}

export async function getFeaturedListings() {
  const featuredListingIds = process.env.NEXT_PUBLIC_FEATURED_LISTINGS_IDS?.split(",").map(id => BigInt(id.trim())) || [1n, 2n, 3n];
  console.log("featuredListingIds: ", featuredListingIds);
  //todo: precisa testar se todos os ids realmente existem listagem
  const featuredListings = await Promise.all(featuredListingIds.map((listingId) => getListingById(listingId)));
  return featuredListings;
}

async function getListingById(listingId: bigint) {
  return await getListing({ contract, listingId: listingId });
}