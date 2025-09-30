"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Heart, Share2, Flag, Activity, Layers } from "lucide-react"
import { NFT } from "thirdweb"
import { Collection, MarketplaceInfo, Profile } from "../../../lib/types"
import { getProfileByAddress } from "../../../lib/profileUtils"
import { NFTBuyActions } from "./NFTBuyActions"
import { marketplaceContractAddress } from "../../../lib/marketplacev3"

interface NFTInfoProps {
  nft: NFT
  marketplaceInfo: MarketplaceInfo
  isOwner: boolean
  buttonsRef: React.RefObject<HTMLDivElement | null>
  collection: Collection
  owners: string[]
}

export default function NFTInfo({ nft, marketplaceInfo, isOwner, buttonsRef, collection, owners }: NFTInfoProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [ntOwnerProfiles, setNtOwnerProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  // Memoize the owners array and nft.owner to prevent unnecessary re-renders
  const memoizedOwners = useMemo(() => owners, [owners])
  const memoizedNftOwner = useMemo(() => nft.owner, [nft.owner])

  const nftSocialInfo = {
    likes: 47,
    categories: ["Digital Art", "Surrealism", "3D", "Animation"],
  }

  const auctionInfo = {
    highestBid: {
      amount: "1.45 ETH",
      bidder: {
        name: "NFTEnthusiast",
        avatar: "/placeholder.svg?height=40&width=40",
        link: "/user/nftenthusiast",
      },
    }
  }

  useEffect(() => {
    const fetchOwnerProfiles = async () => {
      try {
        let profiles: Profile | Profile[] | null = null
        
        if (memoizedOwners && memoizedOwners.length > 0) {
          profiles = await getProfileByAddress(memoizedOwners)
        } else if (memoizedNftOwner) {
          profiles = await getProfileByAddress(memoizedNftOwner)
        }
        
        if (profiles) {
          if (Array.isArray(profiles)) {
            setNtOwnerProfiles(profiles)
          } else {
            setNtOwnerProfiles([profiles])
          }
        } else {
          setNtOwnerProfiles([])
        }
      } catch (error) {
        console.error("Failed to fetch owner profiles:", error)
        setNtOwnerProfiles([])
      } finally {
        setLoading(false)
      }
    }
    fetchOwnerProfiles()
  }, [memoizedOwners, memoizedNftOwner])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-300 rounded animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Collection name */}
      <Link
        href={`/items/${collection.address}`}
        className="inline-block bg-gradient-to-r from-[#D7D3F5] to-[#CFC9F2] px-4 py-2 rounded-md border-2 border-black font-bold hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
      >
        {collection.name}
      </Link>

      {/* Title */}
      <h1 className="text-4xl font-black mb-2">{nft.metadata.name!}</h1>

      {/* Multi-Edition indicator for ERC1155 */}
      {nft.type === "ERC1155" && nft.supply && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Layers className="h-4 w-4" />
          <span className="font-bold">Multi-Edition • {Number(nft.supply)} Total Editions</span>
        </div>
      )}

      {/* Owner info */}
      {ntOwnerProfiles.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center -space-x-2">
            {ntOwnerProfiles.slice(0, 3).map((profile, index) => (
              <div 
                key={index}
                className="h-10 w-10 rounded-full overflow-hidden relative border-2 border-black bg-white"
                style={{ zIndex: 3 - index }}
              >
                <img 
                  src={profile?.image || "/placeholder.png"} 
                  alt={profile?.name || ""} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {ntOwnerProfiles.length > 3 && (
              <div className="h-10 w-10 rounded-full border-2 border-black bg-gray-200 flex items-center justify-center text-xs font-bold">
                +{ntOwnerProfiles.length - 3}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-bold">Owned by</p>
            <div className="flex flex-wrap gap-1">
              {ntOwnerProfiles.slice(0, 3).map((profile, index) => (
                <span key={index}>
                  <Link href={profile?.url || "#"} className="font-bold hover:underline">
                    {profile?.name || "Unknown"}
                  </Link>
                  {index < Math.min(ntOwnerProfiles.length, 3) - 1 && ", "}
                </span>
              ))}
              {ntOwnerProfiles.length > 3 && (
                <span className="text-gray-600">
                  and {ntOwnerProfiles.length - 3} others
                </span>
              )}
            </div>
          </div>
        </div>
      )}
     

      {/* Likes info */}
      <div className="flex items-center font-bold mb-4">
        <Heart className="h-5 w-5 mr-1" />
        {nftSocialInfo.likes} likes
      </div>

      {/* Description */}
      <div className="bg-gradient-to-br from-white to-[#F7F6FC] rounded-lg border-4 border-black p-6 mb-6">
        <p className="text-lg mb-6">{nft.metadata.description}</p>

        {/* Category tags */}
        <div className="flex flex-wrap gap-2">
          {nftSocialInfo.categories.map((category, index) => (
            <Link
              key={index}
              href={`/category/${category.toLowerCase().replace(" ", "-")}`}
              className="bg-[#F7F6FC] px-3 py-1 rounded-md border-2 border-black font-bold text-sm hover:bg-white"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

        {/* Auction info */}
        {marketplaceInfo?.auction && (
         <div className="bg-gradient-to-br from-[#FFF4E6] to-[#FFE4B5] rounded-lg border-4 border-black p-4 mb-4">
           <h3 className="text-lg font-black mb-3 flex items-center">
             <Activity className="mr-2 h-5 w-5" />
             Auction Details
           </h3>
           <div className="grid grid-cols-2 gap-4 mb-4">
             <div className="p-3 border-2 border-black rounded-md bg-white">
               <p className="text-sm text-gray-600 font-bold">Minimum Bid</p>
               <p className="font-black text-lg">
                 {marketplaceInfo.auction.minimumBidCurrencyValue?.displayValue || "0"} {marketplaceInfo.auction.minimumBidCurrencyValue?.symbol || "ETH"}
               </p>
             </div>
             <div className="p-3 border-2 border-black rounded-md bg-white">
               <p className="text-sm text-gray-600 font-bold">Buyout Price</p>
               <p className="font-black text-lg">
                 {marketplaceInfo.auction.buyoutCurrencyValue?.displayValue || "0"} {marketplaceInfo.auction.buyoutCurrencyValue?.symbol || "ETH"}
               </p>
             </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div className="p-3 border-2 border-black rounded-md bg-white">
               <p className="text-sm text-gray-600 font-bold">Status</p>
               <p className={`font-black text-lg ${
                 marketplaceInfo.auction.status === 'ACTIVE' ? 'text-green-600' :
                 marketplaceInfo.auction.status === 'COMPLETED' ? 'text-blue-600' :
                 marketplaceInfo.auction.status === 'CANCELLED' ? 'text-red-600' :
                 'text-gray-600'
               }`}>
                 {marketplaceInfo.auction.status}
               </p>
             </div>
             <div className="p-3 border-2 border-black rounded-md bg-white">
               <p className="text-sm text-gray-600 font-bold">Expires</p>
               <p className="font-black text-lg">
                 {new Date(Number(marketplaceInfo.auction.endTimeInSeconds) * 1000).toLocaleDateString()}
               </p>
               <p className="text-xs text-gray-500">
                 {new Date(Number(marketplaceInfo.auction.endTimeInSeconds) * 1000).toLocaleTimeString()}
               </p>
             </div>
           </div>
         </div>
       )}

      {/* Current price/bid */}
      {marketplaceInfo.auction && marketplaceInfo.auction.status !== "CANCELLED" && (
        <div className="bg-gradient-to-br from-[#D7D3F5] to-[#CFC9F2] p-5 rounded-lg border-4 border-black">
          <p className="text-sm font-bold text-gray-600">Current highest bid</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-black">{auctionInfo.highestBid.amount}</p>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full overflow-hidden relative border-2 border-black">
                <img
                  src={auctionInfo.highestBid.bidder.avatar || "/placeholder.svg"}
                  alt={auctionInfo.highestBid.bidder.name}
                  className="object-cover"
                />
              </div>
              <Link href={auctionInfo.highestBid.bidder.link} className="font-bold text-sm hover:underline">
                {auctionInfo.highestBid.bidder.name}
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {marketplaceInfo.listing && marketplaceInfo.listing.status !== "CANCELLED" && (
        <div className="bg-gradient-to-br from-[#D7D3F5] to-[#CFC9F2] p-5 rounded-lg border-4 border-black flex items-center justify-between">
          <p className="text-3xl font-black">{Number(marketplaceInfo.listing.pricePerToken) / 10 ** 18} GHO</p>
        </div>
      )}

      {/* Action buttons */}
      <div ref={buttonsRef}>
        <NFTBuyActions
          isOwner={isOwner} 
          marketplaceInfo={marketplaceInfo}
          contractAddress={marketplaceContractAddress}
          assetContract={collection.address}
          tokenId={nft.id.toString()}
        />
      </div>
    </div>
  )
}
