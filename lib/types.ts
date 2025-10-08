import { Account } from "@lens-protocol/client";
import { Address, NFT } from "thirdweb";
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
    nftAddress: string;
    nftId: bigint;
    listing: DirectListing;
    auction: EnglishAuction;
    winningBid:  any;
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

export type NFTWithMarketplaceInfo = {
    nft: NFT;
    directListing?: DirectListing;
    auction?: EnglishAuction;
    creatorProfile?: string;
  };


  export enum ActivityType {
    NewListing = "NEW_LISTING",
    UpdatedListing = "UPDATED_LISTING",
    CancelledListing = "CANCELLED_LISTING",
    BuyerApprovedForListing = "BUYER_APPROVED_FOR_LISTING",
    CurrencyApprovedForListing = "CURRENCY_APPROVED_FOR_LISTING",
    NewOffer = "NEW_OFFER",
    CancelledOffer = "CANCELLED_OFFER",
    AcceptedOffer = "ACCEPTED_OFFER",
    NewAuction = "NEW_AUCTION",
    NewBid = "NEW_BID",
    CancelledAuction = "CANCELLED_AUCTION",
    AuctionClosed = "AUCTION_CLOSED",
    NewSale = "NEW_SALE",
  }

  export type ActivityItem = {
    id: string; // `${txHash}:${logIndex}`
    type: ActivityType;
    assetContract: Address;
    tokenId: bigint;
    actor?: Address;
    counterparty?: Address;
    price?: Number;
    currency?: Address;
    quantity?: Number;
    listingId?: bigint;
    offerId?: bigint;
    auctionId?: bigint;
    txHash: `0x${string}`;
    blockNumber: bigint;
    blockTimestamp?: string; // thirdweb includes block info on the tx object when available
    actorProfile?: any; // Social profile for actor
    counterpartyProfile?: any; // Social profile for counterparty
  };

  export type NFTScope = {
    assetContract: Address;
    tokenId: bigint;
  };
  
  export type Range = {
    fromBlock?: bigint | number;
    toBlock?: bigint | number;
  };

  export type Profile = {
    image: string;
    name: string;
    bio: string;
    url: string;
  };

  export type erc1155NFT = {
    legacyNFT: NFT;
    owners: string[];
  }

  export type NFTGeneral = NFT & {
    ownersList?: string[]; // For ERC1155 tokens, contains list of owners
  }