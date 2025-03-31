import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Flame } from "lucide-react";
import { ListingWithProfile } from "../../lib/types";
import { getNFTMediaURL } from "../../lib/nfts";

type NFTListingCardProps = {
  nft: ListingWithProfile;
};

export default function NFTListingCard({ nft }: NFTListingCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const isAuction = nft.type === "english-auction";
  const isLiveAuction =
    isAuction &&
    Number(nft.startTimeInSeconds) * 1000 < Date.now() &&
    Number(nft.endTimeInSeconds) * 1000 > Date.now();

  // Determine NFT type for styling
  const getBgColor = () => {
    if (isAuction) return "bg-cyan-200";
    if (nft.status === "ACTIVE") return "bg-pink-200";
    return "bg-violet-200"; // Default to "listed"
  };

  // Artist & Owner Info
  const artist = {
    name: nft.creatorProfile || "Unknown Artist",
    avatar: "/logo1.png",
  };

  const owner = {
    name: nft.creatorProfile || "Unknown Owner",
    avatar: "/logo1.png",
  };

  const highestBid = isAuction
    ? {
        amount: nft.minimumBidCurrencyValue.displayValue,
        bidder: {
          name: "Highest Bidder",
          avatar: "/logo1.png",
        },
      }
    : undefined;

  return (
    <div className="relative">
      <div
        ref={cardRef}
        className={`relative z-10 w-full max-w-sm overflow-hidden rounded-lg border-4 border-black ${getBgColor()} cursor-pointer`}
        onClick={() => router.push(`/items/${nft.assetContractAddress}/${nft.tokenId}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          boxShadow: isHovered ? "4px 4px 0 0 #000" : "1px 1px 0 0 #000",
        }}
      >
        {/* Image Section */}
        <div className="relative aspect-square border-b-4 border-black">
          <img
            src={getNFTMediaURL(nft.asset) || "/logo1.png"}
            alt={nft.asset.metadata.name || "NFT"}
            className="object-cover w-full h-full"
          />
          {isLiveAuction && (
            <div className="absolute top-4 right-4 bg-red-500 text-white font-bold py-1 px-3 rounded-md border-2 border-black flex items-center gap-1">
              <Flame className="h-4 w-4" />
              LIVE AUCTION
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-5">
          <div className="mb-4">
            <h3 className="text-xl font-black mb-2 tracking-tight">
              {nft.asset.metadata.name || "Unnamed NFT"}
            </h3>
            <div className="flex items-center gap-2 bg-white p-2 rounded-md border-2 border-black inline-block">
              <div className="h-8 w-8 rounded-full overflow-hidden relative border-2 border-black">
                <img src={artist.avatar} alt={artist.name}  className="object-cover" />
              </div>
              <span className="font-bold text-sm">Artist: {artist.name}</span>
            </div>
          </div>

          {/* Pricing & Ownership Info */}
          <div className="space-y-4">
            {/* Listed NFT */}
            {!isAuction && (
              <div className="flex justify-between items-center bg-white p-3 rounded-md border-2 border-black">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-600">Price</span>
                  <span className="font-black text-lg">
                    {(Number(nft.pricePerToken) / 10 ** 18).toFixed(2)} GRASS
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden relative border-2 border-black">
                    <img src={owner.avatar} alt={owner.name}  className="object-cover" />
                  </div>
                  <span className="font-bold text-sm">Owner: {owner.name}</span>
                </div>
              </div>
            )}

            {/* Auction NFT */}
            {isAuction && (
              <div className="flex justify-between items-center bg-white p-3 rounded-md border-2 border-black">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-600">Highest Bid</span>
                  <span className="font-black text-lg">{highestBid?.amount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden relative border-2 border-black">
                    <img src={highestBid?.bidder.avatar || ""} alt={highestBid?.bidder.name || ""}  className="object-cover" />
                  </div>
                  <span className="font-bold text-sm">Bidder: {highestBid?.bidder.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="p-5 pt-0">
          {isAuction ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/items/${nft.assetContractAddress}/${nft.tokenId}`);
              }}
              className={`w-full ${
                isAuction ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"
              } text-white font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none`}
            >
              {isAuction ? "Bid Now" : "Buy Now"}
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/items/${nft.assetContractAddress}/${nft.tokenId}`);
              }}
              className="w-full bg-white text-black font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
