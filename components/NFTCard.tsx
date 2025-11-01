"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Profile } from "../lib/types"
import { getContractEvents } from "thirdweb"
import { contract } from "../lib/marketplacev3"
import { newSaleEvent } from "thirdweb/extensions/marketplace"
import { getAddress } from "thirdweb"

// NFT types: "listed", "auction", "owned"
type NFTCardProps = {
  id: string
  contractAddress: string
  type: "listed" | "auction" | "owned"
  image: string
  title: string
  artistAddress: string
  price?: string
  owner: string
  artistProfile?: Profile | null
  ownerProfile?: Profile | null
  profilesLoading?: boolean
  highestBid?: {
    amount: string
    bidder: {
      name: string
      avatar: string
    }
  }
  lastSale?: any
}

export default function NFTCard({
  id,
  contractAddress,
  type,
  image,
  title,
  artistAddress,
  price,
  owner,
  artistProfile,
  ownerProfile,
  profilesLoading = false,
  highestBid,
  lastSale: _lastSaleProp,
}: NFTCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [lastSaleFromEvents, setLastSaleFromEvents] = useState<any>(null)
  const [loadingLastSale, setLoadingLastSale] = useState(false)

  // Fetch last sale events for this NFT using getContractEvents
  useEffect(() => {
    if (type !== "owned" || !contractAddress || !id) return

    const fetchLastSale = async () => {
      try {
        setLoadingLastSale(true)
        const preparedEvent = newSaleEvent({
          assetContract: getAddress(contractAddress)
        })

        const events = await getContractEvents({
          contract,
          events: [preparedEvent],
        })

        // Find the last sale event for this specific token ID
        const lastSaleEvent = events.find((event: any) => 
          event.args.tokenId?.toString() === id && 
          getAddress(event.args.assetContract) === getAddress(contractAddress)
        )

        setLastSaleFromEvents(lastSaleEvent || null)
      } catch (error) {
        console.error("Error fetching last sale:", error)
        setLastSaleFromEvents(null)
      } finally {
        setLoadingLastSale(false)
      }
    }

    fetchLastSale()
  }, [contractAddress, id, type])

  // Use event-fetched last sale if available, otherwise fall back to prop
  const lastSale = lastSaleFromEvents ?? _lastSaleProp

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
                {profilesLoading ? (
                  <div className="w-full h-full bg-gray-300 animate-pulse"></div>
                ) : (
                  <img 
                    src={artistProfile?.image || "/placeholder.svg"} 
                    alt={artistProfile?.name || artistAddress} 
                    className="w-full h-full object-cover" 
                  />
                )}
              </div>
              <span className="font-bold text-sm">
                Artist: {profilesLoading ? (
                  <span className="animate-pulse bg-gray-300 h-4 w-16 rounded"></span>
                ) : (
                  truncateText(artistProfile?.name || artistAddress)
                )}
              </span>
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
                    {profilesLoading ? (
                      <div className="w-full h-full bg-gray-300 animate-pulse"></div>
                    ) : (
                      <img 
                        src={ownerProfile?.image || "/placeholder.svg"} 
                        alt={ownerProfile?.name || owner} 
                        className="w-full h-full object-cover" 
                      />
                    )}
                  </div>
                  <span className="font-bold text-sm">
                    {profilesLoading ? (
                      <span className="animate-pulse bg-gray-300 h-4 w-16 rounded"></span>
                    ) : (
                      truncateText(ownerProfile?.name || owner)
                    )}
                  </span>
                </div>
              </div>
            )}

            {type === "auction" && highestBid && (
              <div
                className={`flex justify-between items-center ${styles.sectionBg} p-3 rounded-md border-2 border-black`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-600">Highest Bid</span>
                  <span className="font-black text-lg">{highestBid.amount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden relative border-2 border-black">
                    <img
                      src={highestBid.bidder.avatar || ""}
                      alt={highestBid.bidder.name || ""}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-bold text-sm">Bidder: {truncateText(highestBid.bidder.name || "")}</span>
                </div>
              </div>
            )}

            {type === "owned" && (
              <div
                className={`flex justify-between items-center ${styles.sectionBg} p-3 rounded-md border-2 border-black`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-600">Last Sold For</span>
                  {loadingLastSale ? (
                    <span className="font-black text-lg">
                      <span className="animate-pulse bg-gray-300 h-6 w-24 rounded inline-block"></span>
                    </span>
                  ) : (
                    <span className="font-black text-lg">
                      {(() => {
                        const salePrice = lastSale?.args?.totalPricePaid 
                          ? Number(lastSale.args.totalPricePaid) / (10 ** 18) 
                          : null;
                        return (!lastSale || isNaN(salePrice as number)) 
                          ? "Not sold" 
                          : `${salePrice} GRASS`;
                      })()}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden relative border-2 border-black">
                    {profilesLoading ? (
                      <div className="w-full h-full bg-gray-300 animate-pulse"></div>
                    ) : (
                      <img 
                        src={ownerProfile?.image || "/placeholder.svg"} 
                        alt={ownerProfile?.name || owner} 
                        className="w-full h-full object-cover" 
                      />
                    )}
                  </div>
                  <span className="font-bold text-sm">
                    {profilesLoading ? (
                      <span className="animate-pulse bg-gray-300 h-4 w-16 rounded"></span>
                    ) : (
                      truncateText(ownerProfile?.name || owner)
                    )}
                  </span>
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

