import NFTListingCard from "./NFTListingCard";
import { ListingWithProfile } from "../../lib/types";

export default function ListedNFTs({ nfts }: { nfts: ListingWithProfile[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 place-content-center">
      {nfts.map((nft) => (
        <NFTListingCard key={nft.id.toString()} nft={nft} />
      ))}
    </div>
  );
}
