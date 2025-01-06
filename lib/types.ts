import { NFT } from "thirdweb";

export type Collection = {
    //trazer mais informações como royalties, totalSupply, minted, etc
    name: string;
    description: string;
    imageUrl: string;
    address: string;
    type: string;
    owner: string;
    symbol: string;
};

export type MarketplaceInfo = {
    status: string;
    price: bigint;
    seller: string;
    listingType: string;
    nft: NFT;
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
};