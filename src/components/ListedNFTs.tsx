import NFTCard from "./NFTCard";
import { ListingWithProfile, NFTWithMarketplaceInfo } from "../../lib/types";

export default function ListedNFTs({ nfts }: { nfts: ListingWithProfile[] }) {
  // Convert ListingWithProfile to NFTWithMarketplaceInfo
  const convertToListingWithProfile = (listing: ListingWithProfile): NFTWithMarketplaceInfo => {
    return {
      nft: listing.asset,
      directListing: listing.type === "direct-listing" ? listing : undefined,
      auction: listing.type === "english-auction" ? listing : undefined,
      creatorProfile: listing.creatorProfile,
    };
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 place-content-center">
      {nfts.map((nft) => (
        <NFTCard key={nft.id.toString()} nft={convertToListingWithProfile(nft)} />
      ))}
    </div>
  );
}
