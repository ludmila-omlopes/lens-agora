"use client"

import { useState } from "react"
import { image, MediaImageMimeType } from "@lens-protocol/metadata"
import { uploadMetadataToGrove } from "../../../../../lib/lensNetwork"
import { post } from "@lens-protocol/client/actions"
import { useLensSession } from "@/contexts/LensSessionContext"
import { uri } from "@lens-protocol/client"
import { resolveScheme } from "thirdweb/storage"
import { thirdwebClient } from "../../../../../lib/client/thirdwebClient"
import { NFT } from "thirdweb"
import { ActivityItem, Collection, erc1155NFT, MarketplaceInfo } from "../../../../../lib/types"
import { useNFTDetails } from "@/hooks/useNFTDetails"
import NFTImage from "@/components/NFT/NFTImage"
import NFTInfo from "@/components/NFT/NFTInfo"
import ActivityFeed from "@/components/NFT/ActivityFeed"
import CollectionInfo from "@/components/NFT/CollectionInfo"
import SocialActions from "@/components/NFT/SocialActions"
import NFTOffersSection from "@/components/NFT/NFTOffersSection"

export default function NFTDetails( {nft, collection, marketplaceInfo, activityItems } : {nft: NFT | erc1155NFT, collection: Collection, marketplaceInfo: MarketplaceInfo, activityItems: ActivityItem[]} ) {
  const { sessionClient } = useLensSession()

  let owners = [] as string[];
  if ('legacyNFT' in nft) {
    owners = nft.owners
    nft = nft.legacyNFT as NFT
  }

  let resolvedImageurl = ""
  try { 
    resolvedImageurl = resolveScheme({ uri: nft.metadata.image!, client: thirdwebClient })
  } catch (error) {
    console.error("Error resolving NFT image URI:", error)
    resolvedImageurl = "/logo1.png"
  }
  
  
  // Use the custom hook for state management
  const {
    isLiked,
    setIsLiked,
    isImageSticky,
    setIsImageSticky,
    isMobile,
    isOwner,
    buttonsRef,
    imageContainerRef
  } = useNFTDetails({ nft, marketplaceInfo, activityItems, collection, owners })

  const handleShare = async (shareMessage: string) => {
    const tag = (collection.address + nft.id.toString()).toLowerCase()
    const metadata = image({
      tags: [tag],
      title: nft.metadata.name,
      image: {
        item: resolvedImageurl,
        type: MediaImageMimeType.JPEG,
      },
      content: shareMessage,
      nft: {
        name: nft.metadata.name,
        description: nft.metadata.description,
        external_url: `https://localhost:3000/items/${collection.address}/${nft.id}`,
        image: resolvedImageurl,
      },
    })

    try {
      const metadataURI = uploadMetadataToGrove(metadata)
      const result = await post(sessionClient!, { contentUri: uri((await metadataURI).uri) })
      if (result.isErr()) {
        console.error("Error posting to Lens:", result.error)
        return
      }
      alert("Post published successfully!")
    } catch (error) {
      console.error("Error sharing NFT:", error)
    }
  }

  return (
    <div className="container mx-auto py-12 px-4 bg-gradient-to-b from-[#F7F6FC] to-[#F0EFFA]">
      <div className="relative grid md:grid-cols-2 gap-10">
        {/* Social actions */}
        <SocialActions 
          isLiked={isLiked}
          onLikeToggle={setIsLiked}
          onShare={handleShare}
        />

        {/* Left column - NFT Image */}
        <NFTImage
          nft={nft}
          isMobile={isMobile}
          isImageSticky={isImageSticky}
          onStickyChange={setIsImageSticky}
          buttonsRef={buttonsRef}
        />

        {/* Right column - NFT Details */}
        <NFTInfo
          nft={nft}
          marketplaceInfo={marketplaceInfo}
          isOwner={isOwner}
          buttonsRef={buttonsRef}
          collection={collection}
          owners={owners}
        />
      </div>

      {/* Content sections */}
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        {/* Left/Center content (2 columns) */}
        <div className="md:col-span-2 space-y-8">
          {/* Offers section */}
          <NFTOffersSection 
            collectionAddress={collection.address} 
            tokenId={nft.id} 
            isOwner={isOwner} 
          />
          
          {/* Activity feed */}
          <ActivityFeed activityItems={activityItems} />
        </div>

        {/* Right sidebar - Collection info */}
        <CollectionInfo 
          nftId={nft.id.toString()}
          collection={collection}
        />
      </div>
    </div>
  )
}

