import { Account } from "@lens-protocol/client";
import { NFT } from "thirdweb";
import { DirectListing, EnglishAuction } from "thirdweb/extensions/marketplace";

export type Collection = {
    //trazer mais informações como royalties, totalSupply, minted, etc
    name: string;
    description: string;
    imageUrl: string;
    address: string;
    type: string;
    owner: string;
    symbol: string;
    is1155: boolean;
    items?: NFT[];
    totalItems?: number;
    marketplaceInfo?: CollectionMarketplaceInfo;
};
//stats: { items: 1000, owners: 750, floorPrice: '0.5 ETH', volumeTraded: '1250 ETH' }

export type MarketplaceInfo = {
    listingType: string;
    nft: NFT;
    collection: Collection;
    listing: DirectListing;
    auction: EnglishAuction;
};

export type CollectionMarketplaceInfo = {
    collectionAddress: string;
    floorPrice: number;
    volumeTraded: number;
    totalListedItems: number;
    minBid: number;
};

export enum ContractTypes {
    EditionDrop = "EditionDrop",
    Edition = "Edition",
    NFTDrop = "NFTDrop",
    OE721 = "OE721",
    NFTCollection = "NFTCollection"
}

export const ContractTypeDetails: { [key in ContractTypes]: [string, string] } = {
    [ContractTypes.EditionDrop]: ["EditionDrop", "1155"],
    [ContractTypes.Edition]: ["Edition", "1155"],
    [ContractTypes.NFTDrop]: ["NFTDrop", "721"],
    [ContractTypes.OE721]: ["OE721", "721"],
    [ContractTypes.NFTCollection]: ["NFTCollection", "721"]
};

export type DeployedContract = {
    id: number;
    address: string;
    contractAddress: string;
    contractType: string;
    createdAt: string;
}

export type NFTCollection = {
    nft: NFT;
    collection?: Collection;
    collectionAddress: string;
    imageURL?: string;
    creatorLensAccount?: Account;
};

export type ListingWithProfile = (DirectListing | EnglishAuction) & {
    creatorProfile: string;
  };