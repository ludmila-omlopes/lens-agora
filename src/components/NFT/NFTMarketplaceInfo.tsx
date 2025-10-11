"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Activity } from "lucide-react"
import { NFT } from "thirdweb"
import { Collection, MarketplaceInfo, Profile } from "../../../lib/types"
import { NFTBuyActions } from "./NFTBuyActions"
import { marketplaceContractAddress, getNFTMarketplaceInfo } from "../../../lib/marketplacev3"
import { getProfileByAddress } from "../../../lib/profileUtils"

interface NFTMarketplaceInfoProps {
  nft: NFT
  isOwner: boolean
  buttonsRef: React.RefObject<HTMLDivElement | null>
  collection?: Collection
}

export default function NFTMarketplaceInfo({ nft, isOwner, buttonsRef, collection }: NFTMarketplaceInfoProps) {
  const [marketplaceInfo, setMarketplaceInfo] = useState<MarketplaceInfo | null>(null)
  const [marketplaceLoading, setMarketplaceLoading] = useState(true)
  const [bidderProfile, setBidderProfile] = useState<Profile | null>(null)
  const [bidderLoading, setBidderLoading] = useState(false)

  // Fetch marketplace info
  useEffect(() => {
    const fetchMarketplaceInfo = async () => {
      if (!collection) return
    
      
      try {
        setMarketplaceLoading(true)
        const marketplaceData = await getNFTMarketplaceInfo(collection.address, nft.id)
        setMarketplaceInfo(marketplaceData)
      } catch (error) {
        console.error('Error fetching marketplace info:', error)
        setMarketplaceInfo(null)
      } finally {
        setMarketplaceLoading(false)
      }
    }

    fetchMarketplaceInfo()
  }, [collection?.address, nft.id.toString()])

  // Fetch bidder profile when there's a winning bid
  useEffect(() => {
    const fetchBidderProfile = async () => {
      if (!marketplaceInfo?.winningBid?.bidderAddress) {
        setBidderProfile(null)
        return
      }

      try {
        setBidderLoading(true)
        const profile = await getProfileByAddress(marketplaceInfo.winningBid.bidderAddress)
        // getProfileByAddress returns a single profile when given a single address
        setBidderProfile(profile as Profile)
      } catch (error) {
        console.error('Error fetching bidder profile:', error)
        setBidderProfile(null)
      } finally {
        setBidderLoading(false)
      }
    }

    fetchBidderProfile()
  }, [marketplaceInfo?.winningBid?.bidderAddress])

  if (marketplaceLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-full mt-6"></div>
        </div>
      </div>
    )
  }

  if (!marketplaceInfo) {
    return null
  }

  return (
    <div className="space-y-4">
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
      {marketplaceInfo.auction && marketplaceInfo.auction.status !== "CANCELLED" && marketplaceInfo.winningBid && (
        <div className="bg-gradient-to-br from-[#D7D3F5] to-[#CFC9F2] p-5 rounded-lg border-4 border-black">
          <p className="text-sm font-bold text-gray-600">Current highest bid</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-black">{marketplaceInfo.winningBid.currencyValue.displayValue} {marketplaceInfo.winningBid.currencyValue.symbol}</p>
            <div className="flex items-center gap-2">
              {bidderLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-300 animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ) : bidderProfile ? (
                <>
                  <div className="h-8 w-8 rounded-full overflow-hidden relative border-2 border-black">
                    <img
                      src={bidderProfile.image || "/placeholder.svg"}
                      alt={bidderProfile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Link href={bidderProfile.url} className="font-bold text-sm hover:underline">
                    {bidderProfile.name}
                  </Link>
                </>
              ) : (
                <div className="text-sm text-gray-500">
                  {marketplaceInfo.winningBid.bidderAddress ? 
                    `${marketplaceInfo.winningBid.bidderAddress.slice(0, 6)}...${marketplaceInfo.winningBid.bidderAddress.slice(-4)}` : 
                    'Unknown bidder'
                  }
                </div>
              )}
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
        {collection && (
          <NFTBuyActions
            isOwner={isOwner} 
            marketplaceInfo={marketplaceInfo}
            marketplaceContractAddress={marketplaceContractAddress}
            assetContract={collection.address}
            tokenId={nft.id.toString()}
          />
        )}
      </div>
    </div>
  )
}
