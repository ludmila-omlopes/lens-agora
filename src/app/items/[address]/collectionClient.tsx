'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from '@/app/contexts/ThemeContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collection } from '../../../../lib/types'
import { NFT } from 'thirdweb'
import { getNFTMediaURL, listNFTs } from '../../../../lib/nfts'
import { getNFTMarketplaceInfo } from '../../../../lib/marketplacev3'
import NFTCard from '../../../../components/NFTCard'
import { MarketplaceInfo } from '../../../../lib/types'
import { Palette, Plus } from 'lucide-react'
import { useAccount } from 'wagmi'
import { useLensProfile, useLensProfiles } from '../../../hooks/useLensProfile'

export default function CollectionDetails({collectionContract, firstNFTs}: {collectionContract: Collection, firstNFTs: NFT[]}) {
  const { theme } = useTheme()
  const { address } = useAccount()
  const [nftMarketplaceInfo, setNftMarketplaceInfo] = useState<Record<string, MarketplaceInfo>>({})
  
  // Pagination state
  const [allNFTs, setAllNFTs] = useState<NFT[]>(firstNFTs)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(firstNFTs.length === 12) // If we got exactly 12, there might be more
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 12
  
  // Collect all unique addresses from NFTs
  const allAddresses = [
    collectionContract.owner,
    ...allNFTs.map(nft => nft.owner).filter(Boolean)
  ].filter((addr, index, arr) => arr.indexOf(addr) === index) // Remove duplicates

  // Fetch all profiles at once
  const { profiles: allProfiles, loading: profilesLoading } = useLensProfiles(allAddresses)
  
  // Get creator profile
  const creatorProfile = allProfiles[collectionContract.owner] || null
  const creatorLoading = profilesLoading
  
  // Check if current user is the collection owner
  const isOwner = address === collectionContract.owner

  // Function to fetch more NFTs
  const fetchMoreNFTs = async () => {
    if (loadingMore || !hasMore) return
    
    setLoadingMore(true)
    try {
      const nextPage = currentPage + 1
      const start = nextPage * itemsPerPage
      
      const newNFTs = await listNFTs({ 
        contractAdd: collectionContract.address, 
        start, 
        count: itemsPerPage 
      })
      
      if (newNFTs && newNFTs.length > 0) {
        setAllNFTs(prev => [...prev, ...newNFTs])
        setCurrentPage(nextPage)
        setHasMore(newNFTs.length === itemsPerPage) // If we got exactly the count, there might be more
        
        // Fetch marketplace info for new NFTs
        const newMarketplaceInfo: Record<string, MarketplaceInfo> = {}
        for (const nft of newNFTs) {
          const marketplaceInfo = await getNFTMarketplaceInfo(collectionContract.address, nft.id)
          if (marketplaceInfo) {
            newMarketplaceInfo[nft.id.toString()] = marketplaceInfo
          }
        }
        setNftMarketplaceInfo(prev => ({ ...prev, ...newMarketplaceInfo }))
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error fetching more NFTs:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    const fetchMarketplaceInfo = async () => {
      const info: Record<string, MarketplaceInfo> = {}
      for (const nft of allNFTs) {
        const marketplaceInfo = await getNFTMarketplaceInfo(collectionContract.address, nft.id)
        if (marketplaceInfo) {
          info[nft.id.toString()] = marketplaceInfo
        }
      }
      setNftMarketplaceInfo(info)
    }
    fetchMarketplaceInfo()
  }, [allNFTs, collectionContract.address])

  return (
    <div className="min-h-screen">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 w-full">
        <img
          src={collectionContract.imageUrl || "/fallback2.svg"}
          alt={`${collectionContract.name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 mb-10">
        {/* Collection Header */}
        <div className="relative -mt-20 mb-8">
          <div className="relative z-10 bg-white rounded-lg border-4 border-black p-6 pt-24">
            {/* Collection Profile Image */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 md:left-8 md:transform-none">
              <div className="relative">
                <div className="absolute -bottom-3 -right-3 w-full h-full bg-black rounded-lg"></div>
                <div className="relative z-10 h-32 w-32 rounded-lg overflow-hidden border-4 border-black bg-white">
                  <img
                    src={collectionContract.imageUrl || "/fallback1.svg"}
                    alt={collectionContract.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Collection Info */}
            <div className="text-center md:text-left">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-6">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <h1 className="text-3xl font-black">{collectionContract.name}</h1>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    <span className="text-gray-600">Created by</span>
                    <div className="flex items-center gap-2">
                      {creatorLoading ? (
                        <>
                          <div className="h-6 w-6 rounded-full bg-gray-300 animate-pulse"></div>
                          <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                        </>
                      ) : creatorProfile ? (
                        <>
                          <div className="h-6 w-6 rounded-full overflow-hidden relative border-2 border-black">
                            <img
                              src={creatorProfile.image || "/placeholder.svg"}
                              alt={creatorProfile.name || collectionContract.owner}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Link 
                            href={creatorProfile.url} 
                            className="font-bold hover:underline"
                          >
                            {creatorProfile.name || collectionContract.owner}
                          </Link>
                        </>
                      ) : (
                        <>
                          <div className="h-6 w-6 rounded-full overflow-hidden relative border-2 border-black">
                            <img
                              src="/placeholder.svg"
                              alt={collectionContract.owner}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-bold">{collectionContract.owner}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6 max-w-3xl">{collectionContract.description}</p>

              {/* Collection Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-3 border-2 border-black rounded-md bg-gradient-to-br from-[#F7B5DE] to-[#F29BD4] text-center">
                  <p className="text-sm text-gray-700 font-bold">Category</p>
                  <p className="font-black">Art</p>
                </div>
                <div className="p-3 border-2 border-black rounded-md bg-gradient-to-br from-[#8EF5F5] to-[#7EF2F2] text-center">
                  <p className="text-sm text-gray-700 font-bold">Royalties</p>
                  <p className="font-black">2.5%</p>
                </div>
                <div className="p-3 border-2 border-black rounded-md bg-gradient-to-br from-[#F7E5F2] to-white text-center">
                  <p className="text-sm text-gray-700 font-bold">Created</p>
                  <p className="font-black">2024</p>
                </div>
              </div>

              {/* Mint New NFT Component - Only show if user is the collection owner */}
              {isOwner && (
                <div className="mb-6 p-6 border-4 border-black rounded-lg bg-gradient-to-br from-[#8EF5F5] to-[#7EF2F2]">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                      <h3 className="text-xl font-black mb-2 flex items-center justify-center md:justify-start">
                        <Palette className="mr-2 h-6 w-6" />
                        Add New NFT to your Collection
                      </h3>
                      <p className="text-gray-700">
                        Create and mint a new NFT directly to this collection.
                      </p>
                    </div>
                    <Link
                      href={`/items/${collectionContract.address}/addNew`}
                      className="bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white font-black py-3 px-6 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none flex items-center whitespace-nowrap"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      MINT NEW NFT
                    </Link>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 border-2 border-black rounded-md bg-white text-center">
                  <p className="text-2xl font-black">{collectionContract.totalItems}</p>
                  <p className="text-sm font-bold text-gray-600">Items</p>
                </div>
                <div className="p-4 border-2 border-black rounded-md bg-white text-center">
                  <p className="text-2xl font-black">-</p>
                  <p className="text-sm font-bold text-gray-600">Owners</p>
                </div>
                <div className="p-4 border-2 border-black rounded-md bg-white text-center">
                  <p className="text-2xl font-black">{collectionContract.marketplaceInfo?.totalListedItems && collectionContract.marketplaceInfo?.totalListedItems > 0 ? collectionContract.marketplaceInfo?.floorPrice : "-"} GRASS</p>
                  <p className="text-sm font-bold text-gray-600">Floor Price</p>
                </div>
                <div className="p-4 border-2 border-black rounded-md bg-white text-center">
                  <p className="text-2xl font-black">{collectionContract.marketplaceInfo?.volumeTraded || "-"}</p>
                  <p className="text-sm font-bold text-gray-600">Volume Traded</p>
                </div>
                <div className="p-4 border-2 border-black rounded-md bg-white text-center">
                  <p className="text-2xl font-black">-</p>
                  <p className="text-sm font-bold text-gray-600">Total Sales</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-black">Items ({allNFTs.length})</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allNFTs.map((nft) => {
              const marketplaceInfo = nftMarketplaceInfo[nft.id.toString()]
              const price = marketplaceInfo?.listing?.pricePerToken 
                ? `${Number(marketplaceInfo.listing.pricePerToken) / 10 ** 18} GRASS`
                : "Not listed"
              
              return (
                <NFTCard 
                  key={nft.id}
                  id={nft.id.toString()}
                  contractAddress={collectionContract.address}
                  type={marketplaceInfo?.listing ? "listed" : "owned"}
                  image={getNFTMediaURL(nft)}
                  title={nft.metadata.name!}
                  artistAddress={collectionContract.owner}
                  price={price}
                  lastSale={marketplaceInfo?.lastSale}
                  owner={nft.owner || "Unknown"}
                  artistProfile={allProfiles[collectionContract.owner]}
                  ownerProfile={allProfiles[nft.owner || ""]}
                  profilesLoading={profilesLoading}
                />
              )
            })}
          </div>

          {/* Load More Button or End Message */}
          <div className="flex justify-center py-8">
            {hasMore ? (
              <Button
                onClick={fetchMoreNFTs}
                disabled={loadingMore}
                className="bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white font-black py-3 px-8 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Loading...
                  </>
                ) : (
                  'Load More NFTs'
                )}
              </Button>
            ) : allNFTs.length > 0 ? (
              <div className="text-gray-600 font-bold text-lg">
                🎉 All NFTs loaded! ({allNFTs.length} total)
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

