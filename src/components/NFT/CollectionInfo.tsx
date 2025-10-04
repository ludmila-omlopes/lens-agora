"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { SocialProfile, useSocialProfiles } from "thirdweb/react"
import { thirdwebClient } from "../../../lib/client/thirdwebClient"
import { Collection } from "../../../lib/types"
import { formatAddress, getProfileByAddress } from "../../../lib/profileUtils"
import { NFTCommentsSection } from "./NFTCommentsSection"

interface CollectionInfoProps {
  nftId: string
  collection: Collection
}

export default function CollectionInfo({ nftId, collection }: CollectionInfoProps) {
  const [artistProfile, setArtistProfile] = useState<{ name: string; image: string } | null>(null)
  const [loading, setLoading] = useState(true)

  // Memoize the collection owner to prevent unnecessary re-renders
  const memoizedCollectionOwner = useMemo(() => collection.owner, [collection.owner])


  useEffect(() => {
    const fetchArtistProfile = async () => {
      try {
        const profile = await getProfileByAddress(memoizedCollectionOwner)
        if (Array.isArray(profile)) {
          setArtistProfile(profile[0] || null)
        } else {
          setArtistProfile(profile)
        }
      } catch (error) {
        console.error("Failed to fetch artist profile:", error)
      } finally {
        setLoading(false)
      }
    }
      

    fetchArtistProfile()
  }, [memoizedCollectionOwner])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-white to-[#E0FAFA] rounded-lg border-4 border-black p-6">
          <div className="h-6 bg-gray-300 rounded animate-pulse mb-4"></div>
          <div className="flex items-center gap-3 p-4 border-2 border-black rounded-md bg-white mb-4">
            <div className="h-12 w-12 rounded-full bg-gray-300 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
          <div className="h-20 bg-gray-300 rounded animate-pulse mb-4"></div>
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-3 border-2 border-black rounded-md bg-white">
                <div className="h-3 bg-gray-300 rounded w-1/2 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="sticky top-6 space-y-8">
        <div className="bg-gradient-to-br from-white to-[#E0FAFA] rounded-lg border-4 border-black p-6">
          <h2 className="text-xl font-black mb-4">About Collection</h2>

          {/* Artist info */}
          <div className="flex items-center gap-3 p-4 border-2 border-black rounded-md bg-white mb-4">
            <div className="h-12 w-12 rounded-full overflow-hidden relative border-2 border-black">
              <img
                src={artistProfile?.image || "/placeholder.png"}
                alt={artistProfile?.name || ""}
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-bold">Artist</p>
              <Link href={"/profile/" + collection.owner} className="font-bold hover:underline">
                {artistProfile?.name || formatAddress(collection.owner)}
              </Link>
            </div>
          </div>

          <p className="mb-4">{collection.description}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border-2 border-black rounded-md bg-white">
              <p className="text-sm text-gray-600">Items</p>
              <p className="font-black">{collection.items?.length || 0}</p>
            </div>
            <div className="p-3 border-2 border-black rounded-md bg-white">
              <p className="text-sm text-gray-600">Owners</p>
              <p className="font-black">soon</p>
            </div>
            <div className="p-3 border-2 border-black rounded-md bg-white">
              <p className="text-sm text-gray-600">Floor Price</p>
              <p className="font-black">{collection.marketplaceInfo?.floorPrice || 0}</p>
            </div>
            <div className="p-3 border-2 border-black rounded-md bg-white">
              <p className="text-sm text-gray-600">Volume Traded</p>
              <p className="font-black">{collection.marketplaceInfo?.volumeTraded || 0}</p>
            </div>
          </div>
          <Link
            href={`/items/${collection.address}`}
            className="flex items-center justify-center w-full mt-4 bg-gradient-to-r from-[#D7D3F5] to-[#CFC9F2] font-bold py-2 px-4 rounded-md border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            View Collection <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {/* Comments section */}
        <NFTCommentsSection 
          nftId={nftId} 
          collectionAddress={collection.address} 
        />
      </div>
    </div>
  )
}
