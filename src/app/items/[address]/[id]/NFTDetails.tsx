"use client"

import { useState, useEffect } from "react"
import { image, MediaImageMimeType } from "@lens-protocol/metadata"
import { uploadMetadataToGrove } from "../../../../../lib/lensNetwork"
import { post } from "@lens-protocol/client/actions"
import { useLensSession } from "@/contexts/LensSessionContext"
import { uri } from "@lens-protocol/client"
import { resolveScheme } from "thirdweb/storage"
import { thirdwebClient } from "../../../../../lib/client/thirdwebClient"
import { NFT } from "thirdweb"
import { ActivityItem, Collection, NFTGeneral } from "../../../../../lib/types"
import { getCurrentCollection } from "../../../../../lib/nfts"
import { Address } from "thirdweb"
import { useNFTDetails } from "@/hooks/useNFTDetails"
import NFTImage from "@/components/NFT/NFTImage"
import NFTInfo from "@/components/NFT/NFTInfo"
import NFTMarketplaceInfo from "@/components/NFT/NFTMarketplaceInfo"
import ActivityFeed from "@/components/NFT/ActivityFeed"
import CollectionInfo from "@/components/NFT/CollectionInfo"
import SocialActions from "@/components/NFT/SocialActions"
import NFTOffersSection from "@/components/NFT/NFTOffersSection"

export default function NFTDetails( {nft, collectionAddress, activityItems } : {nft: NFTGeneral, collectionAddress: string, activityItems: ActivityItem[]} ) {
  const { sessionClient } = useLensSession()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [collectionLoading, setCollectionLoading] = useState(true)

  // Get owners list for ERC1155 tokens
  const owners = nft.ownersList || [];

  // Fetch collection data client-side
  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setCollectionLoading(true);
        const collectionData = await getCurrentCollection({ contractAdd: collectionAddress });
        setCollection(collectionData);
      } catch (error) {
        console.error('Error fetching collection:', error);
        setCollection(null);
      } finally {
        setCollectionLoading(false);
      }
    };

    fetchCollection();
  }, [collectionAddress]);


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
  } = useNFTDetails({ nft, activityItems, collection: collection || undefined, owners })

  const handleShare = async (shareMessage: string) => {
    if (!collection) return;
    
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
          isMobile={isMobile}
          isImageSticky={isImageSticky}
          onStickyChange={setIsImageSticky}
          buttonsRef={buttonsRef}
        />

        {/* Right column - NFT Details */}
        <div className="space-y-6">
          <NFTInfo
            nft={nft}
            collection={collection || undefined}
            owners={owners}
          />
          
          {/* Marketplace Information */}
          <NFTMarketplaceInfo
            nft={nft}
            isOwner={isOwner}
            buttonsRef={buttonsRef}
            collection={collection || undefined}
          />
        </div>
      </div>

      {/* Content sections */}
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        {/* Left/Center content (2 columns) */}
        <div className="md:col-span-2 space-y-8">
          {/* Offers section */}
          {collection && (
            <NFTOffersSection 
              collectionAddress={collection.address} 
              tokenId={nft.id} 
              isOwner={isOwner} 
            />
          )}
          
          {/* Activity feed */}
          <ActivityFeed 
            activityItems={activityItems} 
            assetContract={nft.tokenAddress as Address}
            tokenId={nft.id}
          />
        </div>

        {/* Right sidebar - Collection info */}
        {collectionLoading ? (
          <div className="bg-gradient-to-br from-white to-[#E5E2F9] rounded-lg border-4 border-black p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        ) : collection ? (
          <CollectionInfo 
            nftId={nft.id.toString()}
            collection={collection}
          />
        ) : (
          <div className="bg-gradient-to-br from-white to-[#E5E2F9] rounded-lg border-4 border-black p-6">
            <h3 className="text-lg font-bold mb-4">Collection Info</h3>
            <p className="text-gray-600">Failed to load collection data</p>
          </div>
        )}
      </div>
    </div>
  )
}

