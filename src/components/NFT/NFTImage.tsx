"use client"

import { useState, useRef, useEffect } from "react"
import { resolveScheme } from "thirdweb/storage"
import { thirdwebClient } from "../../../lib/client/thirdwebClient"
import { NFT } from "thirdweb"
import { NFTMedia } from "thirdweb/react"

export default function NFTImage({ isMobile, isImageSticky, onStickyChange, buttonsRef }: { isMobile: boolean, isImageSticky: boolean, onStickyChange: (sticky: boolean) => void, buttonsRef: React.RefObject<HTMLDivElement | null> }) {
  const imageContainerRef = useRef<HTMLDivElement | null>(null)

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

  return (
    <div
      ref={imageContainerRef}
      className={`relative ${!isMobile && isImageSticky ? "md:sticky md:top-6" : ""}`}
      style={{ height: "fit-content" }}
    >
      <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-lg hidden md:block"></div>
      <div className="relative z-10 border-4 border-black rounded-lg overflow-hidden bg-white">
        {/*{imageLoading && (
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
                <NFTMedia className="w-full object-cover"  style={{ display: 'block' }} loadingComponent={ <div className="w-full h-[600px] bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-500">Loading image...</div>
          </div> } />
              )
            }

          })()
        )}*/}
       <NFTMedia className="w-full object-cover"  style={{ display: 'block' }} loadingComponent={ <div className="w-full h-[600px] bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading image...</div></div> } />
      </div>
    </div>
  )
}