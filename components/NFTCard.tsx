"use client"

import { useState } from "react"
import Link from "next/link"

// NFT types: "listed", "auction", "owned"
type NFTCardProps = {
  id: string
  contractAddress: string
  type: "listed" | "auction" | "owned"
  image: string
  title: string
  artist: {
    name: string
    avatar: string
  }
  price?: string
  owner: {
    name: string
    avatar: string
  }
  highestBid?: {
    amount: string
    bidder: {
      name: string
      avatar: string
    }
  }
}

export default function NFTCard({
  id = "1",
  contractAddress = "",
  type = "listed",
  image = "/placeholder.svg?height=400&width=400",
  title = "Abstract Dimensions #08",
  artist = {
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  price = "0.85 ETH",
  owner = {
    name: "Current Owner",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  highestBid = {
    amount: "0.91 ETH",
    bidder: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
}: NFTCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Function to truncate text to fit within card
  const truncateText = (text: string, maxLength: number = 12) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  // Brand colors with soft gradients
  const getStyles = () => {
    switch (type) {
      case "listed":
        return {
          // Pink gradient for listed NFTs
          cardBg: "bg-gradient-to-br from-[#F7B5DE] to-[#F29BD4]",
          primaryButtonBg: "bg-gradient-to-r from-[#8F83E0] to-[#7F71D9]",
          secondaryButtonBg: "bg-white",
          sectionBg: "bg-gradient-to-r from-[#F7E5F2] to-white",
          primaryButtonText: "text-white",
          secondaryButtonText: "text-black",
        }
      case "auction":
        return {
          // Purple gradient for auction NFTs
          cardBg: "bg-gradient-to-br from-[#D7D3F5] to-[#CFC9F2]",
          primaryButtonBg: "bg-gradient-to-r from-[#8F83E0] to-[#7F71D9]",
          secondaryButtonBg: "bg-white",
          sectionBg: "bg-gradient-to-r from-[#E5E2F9] to-white",
          primaryButtonText: "text-white",
          secondaryButtonText: "text-black",
        }
      case "owned":
        return {
          // Cyan gradient for owned NFTs
          cardBg: "bg-gradient-to-br from-[#C9F7F7] to-[#B6F2F2]",
          primaryButtonBg: "bg-gradient-to-r from-[#8EF5F5] to-[#7EF2F2]",
          secondaryButtonBg: "bg-white",
          sectionBg: "bg-gradient-to-r from-[#E0FAFA] to-white",
          primaryButtonText: "text-black", // Dark text for better contrast on light cyan
          secondaryButtonText: "text-black",
        }
      default:
        return {
          cardBg: "bg-gradient-to-br from-[#F7B5DE] to-[#F29BD4]",
          primaryButtonBg: "bg-gradient-to-r from-[#8F83E0] to-[#7F71D9]",
          secondaryButtonBg: "bg-white",
          sectionBg: "bg-gradient-to-r from-[#F7E5F2] to-white",
          primaryButtonText: "text-white",
          secondaryButtonText: "text-black",
        }
    }
  }

  const styles = getStyles()

  return (
    <Link href={`/items/${contractAddress}/${id}`} className="block">
      <div
        className={`w-full max-w-sm overflow-hidden rounded-lg border-4 border-black transition-all duration-300 ${styles.cardBg} hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square border-b-4 border-black">
          {image && (
            (() => {
              // Check if the URL is a video by file extension or MIME type
              const isVideo = image.match(/\.(mp4|webm|ogg|mov|avi|mkv|wmv|flv|m4v|3gp|ts|mts|m2ts)$/i) || 
                             image.includes('video') ||
                             image.includes('blob:');
              
              if (isVideo) {
                return (
                  <video
                    src={image}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />
                );
              } else {
                return (
                  <img src={image || "/placeholder.png"} alt={title} className="w-full h-full object-cover" />
                );
              }
            })()
          )}
        </div>

        <div className="p-5">
          <div className="mb-4">
            <h3 className="text-xl font-black mb-2 tracking-tight">{title}</h3>
            <div
              className={`flex items-center gap-2 ${styles.sectionBg} p-2 rounded-md border-2 border-black inline-block`}
            >
              <div className="h-8 w-8 rounded-full overflow-hidden relative border-2 border-black">
                <img src={artist.avatar || "/placeholder.svg"} alt={artist.name} className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-sm">Artist: {truncateText(artist.name)}</span>
            </div>
          </div>

          <div className="space-y-4">
            {type === "listed" && (
              <div
                className={`flex justify-between items-center ${styles.sectionBg} p-3 rounded-md border-2 border-black`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-600">Price</span>
                  <span className="font-black text-lg">{price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden relative border-2 border-black">
                    <img src={owner.avatar || "/placeholder.svg"} alt={owner.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-bold text-sm">Owner: {truncateText(owner.name)}</span>
                </div>
              </div>
            )}

            {type === "auction" && (
              <div
                className={`flex justify-between items-center ${styles.sectionBg} p-3 rounded-md border-2 border-black`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-600">Highest Bid</span>
                  <span className="font-black text-lg">{highestBid?.amount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden relative border-2 border-black">
                    <img
                      src={highestBid?.bidder.avatar || ""}
                      alt={highestBid?.bidder.name || ""}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-bold text-sm">Bidder: {truncateText(highestBid?.bidder.name || "")}</span>
                </div>
              </div>
            )}

            {type === "owned" && (
              <div
                className={`flex justify-between items-center ${styles.sectionBg} p-3 rounded-md border-2 border-black`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-600">Last Sold For</span>
                  <span className="font-black text-lg">{price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden relative border-2 border-black">
                    <img src={owner.avatar || "/placeholder.svg"} alt={owner.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-bold text-sm">Owner: {truncateText(owner.name)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 pt-0">
          {type === "listed" && (
            <button
              className={`w-full ${styles.primaryButtonBg} ${styles.primaryButtonText} font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none`}
              onClick={(e) => {
                e.preventDefault() // Prevent card navigation
                // Buy now logic here
              }}
            >
              BUY NOW FOR {price}
            </button>
          )}

          {type === "auction" && (
            <div className="grid grid-cols-2 gap-3">
              <button
                className={`${styles.secondaryButtonBg} ${styles.secondaryButtonText} font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none`}
                onClick={(e) => {
                  e.preventDefault() // Prevent card navigation
                  // Bid now logic here
                }}
              >
                BID NOW
              </button>
              <button
                className={`${styles.primaryButtonBg} ${styles.primaryButtonText} font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none`}
                onClick={(e) => {
                  e.preventDefault() // Prevent card navigation
                  // Buy now logic here
                }}
              >
                BUY NOW
              </button>
            </div>
          )}

          {type === "owned" && (
            <button
              className={`w-full ${styles.primaryButtonBg} ${styles.primaryButtonText} font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none`}
              onClick={(e) => {
                e.preventDefault() // Prevent card navigation
                // View details logic here
              }}
            >
              VIEW DETAILS
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}

