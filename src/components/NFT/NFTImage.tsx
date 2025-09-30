"use client"

import { useState, useRef, useEffect } from "react"
import { resolveScheme } from "thirdweb/storage"
import { thirdwebClient } from "../../../lib/client/thirdwebClient"
import { NFT } from "thirdweb"

interface NFTImageProps {
  nft: NFT
  isMobile: boolean
  isImageSticky: boolean
  onStickyChange: (sticky: boolean) => void
  buttonsRef: React.RefObject<HTMLDivElement | null>
}

export default function NFTImage({ 
  nft, 
  isMobile, 
  isImageSticky, 
  onStickyChange, 
  buttonsRef 
}: NFTImageProps) {
  const imageContainerRef = useRef<HTMLDivElement | null>(null)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  let resolvedImageurl = ""
  try {
    resolvedImageurl = resolveScheme({ uri: nft.metadata.image!, client: thirdwebClient })
  } catch (error) {
    console.error("Error resolving NFT image URI:", error)
    resolvedImageurl = "/logo1.png"
  }

  // Handle scroll behavior for the image - only on desktop
  useEffect(() => {
    const handleScroll = () => {
      if (isMobile) {
        onStickyChange(false)
        return
      }

      if (buttonsRef.current && imageContainerRef.current) {
        const buttonsRect = buttonsRef.current.getBoundingClientRect()
        const imageRect = imageContainerRef.current.getBoundingClientRect()

        // If the buttons are about to come into view, stop the image from being sticky
        if (buttonsRect.top <= imageRect.bottom) {
          onStickyChange(false)
        } else {
          onStickyChange(true)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isMobile, onStickyChange, buttonsRef])

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  const isVideo = resolvedImageurl.match(/\.(mp4|webm|ogg|mov|avi|mkv|wmv|flv|m4v|3gp|ts|mts|m2ts)$/i) || 
                 resolvedImageurl.includes('video') ||
                 resolvedImageurl.includes('blob:') && nft.metadata.animation_url

  return (
    <div
      ref={imageContainerRef}
      className={`relative ${!isMobile && isImageSticky ? "md:sticky md:top-6" : ""}`}
      style={{ height: "fit-content" }}
    >
      <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-lg hidden md:block"></div>
      <div className="relative z-10 border-4 border-black rounded-lg overflow-hidden bg-white">
        {imageLoading && (
          <div className="w-full h-[600px] bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-500">Loading image...</div>
          </div>
        )}
        
        {imageError ? (
          <div className="w-full h-[600px] bg-gray-200 flex items-center justify-center">
            <div className="text-gray-500">Failed to load image</div>
          </div>
        ) : resolvedImageurl && (
          (() => {
            if (isVideo) {
              return (
                <video
                  src={resolvedImageurl}
                  controls
                  className="w-full object-cover"
                  onLoadStart={handleImageLoad}
                  onError={handleImageError}
                />
              )
            } else {
              return (
                <img
                  src={resolvedImageurl || "/placeholder.png"}
                  alt={nft.metadata.name!}
                  width={600}
                  height={600}
                  className="w-full object-cover"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: imageLoading ? 'none' : 'block' }}
                />
              )
            }
          })()
        )}
      </div>
    </div>
  )
}