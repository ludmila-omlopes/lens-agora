import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Flame } from "lucide-react";
import { NFTWithMarketplaceInfo } from "../../lib/types";
import { getNFTMediaURL } from "../../lib/nfts";

type NFTCardProps = {
  nft: NFTWithMarketplaceInfo;
};

export default function NFTCard({ nft }: NFTCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const isListed = nft.directListing || nft.auction;
  const isAuction = nft.auction && !nft.directListing;
  const isLiveAuction =
    isAuction &&
    nft.auction &&
    Number(nft.auction.startTimeInSeconds) * 1000 < Date.now() &&
    Number(nft.auction.endTimeInSeconds) * 1000 > Date.now();

  // Determine NFT type for styling
  const getBgColor = () => {
    if (!isListed) return "bg-gray-200"; // Not listed
    if (isAuction) return "bg-cyan-200";
    if (nft.directListing?.status === "ACTIVE") return "bg-pink-200";
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

  const highestBid = isAuction && nft.auction
    ? {
        amount: nft.auction.minimumBidCurrencyValue.displayValue,
        bidder: {
          name: "Highest Bidder",
          avatar: "/logo1.png",
        },
      }
    : undefined;

  const handleCardClick = () => {
    router.push(`/items/${nft.nft.tokenAddress}/${nft.nft.id}`);
  };

  return (
    <div className="relative">
      <div
        ref={cardRef}
        className={`relative z-10 w-full max-w-sm overflow-hidden rounded-lg border-4 border-black ${getBgColor()} cursor-pointer`}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          boxShadow: isHovered ? "4px 4px 0 0 #000" : "1px 1px 0 0 #000",
        }}
      >
        {/* Image Section */}
        <div className="relative aspect-square border-b-4 border-black">
          <img
            src={getNFTMediaURL(nft.nft) || "/logo1.png"}
            alt={nft.nft.metadata.name || "NFT"}
            className="object-cover w-full h-full"
          />
          {isLiveAuction && (
            <div className="absolute top-4 right-4 bg-red-500 text-white font-bold py-1 px-3 rounded-md border-2 border-black flex items-center gap-1">
              <Flame className="h-4 w-4" />
              LIVE AUCTION
            </div>
          )}
          {!isListed && (
            <div className="absolute top-4 right-4 bg-gray-500 text-white font-bold py-1 px-3 rounded-md border-2 border-black">
              NOT LISTED
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-5">
          <div className="mb-4">
            <h3 className="text-xl font-black mb-2 tracking-tight">
              {nft.nft.metadata.name || "Unnamed NFT"}
            </h3>
            <div className="flex items-center gap-2 bg-white p-2 rounded-md border-2 border-black inline-block">
              <div className="h-8 w-8 rounded-full overflow-hidden relative border-2 border-black">
                <img src={artist.avatar} alt={artist.name} className="object-cover" />
              </div>
              <span className="font-bold text-sm">Artist: {artist.name}</span>
            </div>
          </div>

          {/* Pricing & Ownership Info */}
          <div className="space-y-4">
            {/* Not Listed NFT */}
            {!isListed && (
              <div className="flex justify-between items-center bg-white p-3 rounded-md border-2 border-black">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-600">Status</span>
                  <span className="font-black text-lg text-gray-500">Not Listed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden relative border-2 border-black">
                    <img src={owner.avatar} alt={owner.name} className="object-cover" />
                  </div>
                  <span className="font-bold text-sm">Owner: {owner.name}</span>
                </div>
              </div>
            )}

            {/* Listed NFT */}
            {isListed && !isAuction && nft.directListing && (
              <div className="flex justify-between items-center bg-white p-3 rounded-md border-2 border-black">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-600">Price</span>
                  <span className="font-black text-lg">
                    {(Number(nft.directListing.pricePerToken) / 10 ** 18).toFixed(2)} GRASS
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden relative border-2 border-black">
                    <img src={owner.avatar} alt={owner.name} className="object-cover" />
                  </div>
                  <span className="font-bold text-sm">Owner: {owner.name}</span>
                </div>
              </div>
            )}

            {/* Auction NFT */}
            {isAuction && nft.auction && (
              <div className="flex justify-between items-center bg-white p-3 rounded-md border-2 border-black">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-600">Highest Bid</span>
                  <span className="font-black text-lg">{highestBid?.amount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden relative border-2 border-black">
                    <img src={highestBid?.bidder.avatar || ""} alt={highestBid?.bidder.name || ""} className="object-cover" />
                  </div>
                  <span className="font-bold text-sm">Bidder: {highestBid?.bidder.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="p-5 pt-0">
          {!isListed ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
            >
              View NFT
            </button>
          ) : isAuction ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
            >
              Bid Now
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
            >
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
