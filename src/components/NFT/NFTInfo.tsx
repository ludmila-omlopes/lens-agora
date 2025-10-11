"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Heart, Share2, Flag, Layers } from "lucide-react"
import { NFT } from "thirdweb"
import { Collection, Profile } from "../../../lib/types"
import { getProfileByAddress } from "../../../lib/profileUtils"
import { NFTDescription, NFTName } from "thirdweb/react"
import { getLikesForNFT, getLikesForNFTWithUserStatus } from "../../../lib/lensProtocolUtils"
import { useLensSession } from "@/contexts/LensSessionContext"

interface NFTInfoProps {
  nft: NFT
  collection?: Collection
  owners: string[]
  onLikeStatusChange?: (hasLiked: boolean) => void
}

export default function NFTInfo({ nft, collection, owners, onLikeStatusChange }: NFTInfoProps) {
  const { sessionClient } = useLensSession()
  const [ntOwnerProfiles, setNtOwnerProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [nftLikes, setNftLikes] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  // Create stable references for owners and nft.owner
  const ownersString = useMemo(() => owners?.join(',') || '', [owners])
  const nftOwnerString = useMemo(() => nft.owner || '', [nft.owner])
  const nftAttributes = useMemo(() => (nft.metadata.attributes as Array<{value: string}>) || [], [nft.metadata.attributes])

  // Fetch owner profiles
  useEffect(() => {
    const fetchOwnerProfiles = async () => {
      try {
        setLoading(true)
        let profiles: Profile | Profile[] | null = null
        
        if (owners && owners.length > 0) {
          profiles = await getProfileByAddress(owners)
        } else if (nft.owner) {
          profiles = await getProfileByAddress(nft.owner)
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
  }, [ownersString, nftOwnerString])

  // Fetch NFT likes
  useEffect(() => {
    const fetchLikes = async () => {
      if (!collection?.address) return

    
        try {
          // Use authenticated function if user is logged in, otherwise use public function
          if (sessionClient) {
            const { likes, hasLiked } = await getLikesForNFTWithUserStatus(nft.id.toString(), collection.address, sessionClient)
            setNftLikes(likes)
            setHasLiked(hasLiked)
            onLikeStatusChange?.(hasLiked)
          } else {
            const likes = await getLikesForNFT(nft.id.toString(), collection.address)
            setNftLikes(likes)
            setHasLiked(false)
            onLikeStatusChange?.(false)
          }
        } catch (error) {
          console.error("Failed to fetch NFT likes:", error)
          setNftLikes(0)
          setHasLiked(false)
          onLikeStatusChange?.(false)
        }
    }
    
    fetchLikes()
  }, [nft.id.toString(), collection?.address, sessionClient])

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
      {collection && (
        <Link
          href={`/items/${collection.address}`}
          className="inline-block bg-gradient-to-r from-[#D7D3F5] to-[#CFC9F2] px-4 py-2 rounded-md border-2 border-black font-bold hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          {collection.name}
        </Link>
      )}

      {/* Title */}
      {/* <h1 className="text-4xl font-black mb-2">{nft.metadata.name!}</h1> */}
      <h1 className="text-4xl font-black mb-2"><NFTName /></h1>

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
                  <Link href={profile.url } className="font-bold hover:underline">
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
     
      {hasLiked && (
      <div className="flex items-center font-bold mb-4">
        <Heart className={`h-5 w-5 mr-1 ${hasLiked ? 'fill-red-500' : ''}`} />
        {nftLikes} likes
      </div>  )}

      {/* Description */}
      <div className="bg-gradient-to-br from-white to-[#F7F6FC] rounded-lg border-4 border-black p-6 mb-6">
        {/* <p className="text-lg mb-6">{nft.metadata.description}</p> */}
        <NFTDescription className="text-lg" />
        

        {/* Category tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          {nftAttributes.map((attribute: {value: string}, index: number) => (
            <Link
              key={index}
              href={`/items/${collection?.address}`}
              className="bg-[#F7F6FC] px-3 py-1 rounded-md border-2 border-black font-bold text-sm hover:bg-white"
            >
              {attribute.value}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
