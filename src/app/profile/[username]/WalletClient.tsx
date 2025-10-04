"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { 
  Wallet, 
  Check, 
  Copy, 
  ExternalLink, 
  User, 
  Filter, 
  Grid, 
  Activity 
} from "lucide-react"
import { formatAddress, ProfileData } from "../../../../lib/profileUtils"
import { NFTCollection, NFTWithMarketplaceInfo } from "../../../../lib/types"
import { USE_TESTNET } from "../../../../lib/lensNetwork"
import NFTCard from "../../../components/NFTCard"

type FilterOption = "all" | "art" | "collectibles" | "multi-edition"

interface WalletClientProps {
  walletData: ProfileData
}

export default function WalletClient({ walletData }: WalletClientProps) {
  const [copied, setCopied] = useState(false)
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const [showFilters, setShowFilters] = useState(false)

  // Use server-side fetched NFTs or empty array as fallback
  const ownedNFTs = walletData.ownedNFTs || [];

  // Copy address to clipboard
  const copyAddress = () => {
    navigator.clipboard.writeText(walletData.walletAddress || "")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }
  
  // Convert NFTCollection to NFTWithMarketplaceInfo
  const convertToNFTWithMarketplaceInfo = (nftCollection: NFTCollection): NFTWithMarketplaceInfo => {
    return {
      nft: nftCollection.nft,
      directListing: undefined, // NFTs in wallet are not listed by default
      auction: undefined, // NFTs in wallet are not in auction by default
      creatorProfile: nftCollection.creatorLensAccount?.username?.localName || formatAddress(nftCollection.collection?.owner || ""),
    };
  };

  // Filter NFTs
  const filteredNFTs = ownedNFTs.filter((nft) => {
    if (filterBy === "all") return true
    // Add more sophisticated filtering logic here
    return true
  })

  return (
    <div className="bg-gradient-to-b from-[#F7F6FC] to-[#F0EFFA] min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Wallet Header */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border-4 border-black p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Wallet className="h-8 w-8" />
                  <h1 className="text-3xl font-black">{formatWalletAddress(walletData.walletAddress || "")}</h1>
                </div>
                {walletData.lensAccounts?.[0]?.username?.localName && (
                  <p className="text-gray-600 font-mono text-sm">{formatWalletAddress(walletData.walletAddress || "")}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copyAddress}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border-2 border-black font-bold transition-all ${
                    copied ? "bg-[#8EF5F5]" : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Address
                    </>
                  )}
                </button>
                 <a
                   href={`${USE_TESTNET ? 'https://explorer.testnet.lens.xyz' : 'https://explorer.lens.xyz'}/address/${walletData.walletAddress || ""}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex items-center gap-2 px-4 py-2 rounded-md border-2 border-black bg-white hover:bg-gray-100 font-bold"
                 >
                   <ExternalLink className="h-4 w-4" />
                   Lens Explorer
                 </a>
              </div>
            </div>

            {/* Wallet Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 border-2 border-black rounded-md bg-gradient-to-br from-[#F7B5DE] to-[#F29BD4] text-center">
                <p className="text-2xl font-black">{ownedNFTs.length}</p>
                <p className="text-sm font-bold text-gray-700">NFTs Owned</p>
              </div>
              <div className="p-4 border-2 border-black rounded-md bg-gradient-to-br from-[#D7D3F5] to-[#CFC9F2] text-center">
                <p className="text-2xl font-black">soon</p>
                <p className="text-sm font-bold text-gray-700">Total Value</p>
              </div>
              <div className="p-4 border-2 border-black rounded-md bg-gradient-to-br from-[#8EF5F5] to-[#7EF2F2] text-center">
                <p className="text-2xl font-black">soon</p>
                <p className="text-sm font-bold text-gray-700">Collections</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lens Profiles Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border-4 border-black p-6">
            <h2 className="text-2xl font-black mb-6 flex items-center">
              <div className="bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] h-8 w-8 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              Lens Protocol Profiles ({walletData.lensAccounts?.length || 0})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {walletData.lensAccounts?.map((profile, index) => (
                <Link
                  key={index}
                  href={`/profile/${profile.address}`}
                  className="block border-4 border-black rounded-lg overflow-hidden bg-gradient-to-br from-[#F7F6FC] to-[#F0EFFA] hover:-translate-y-1 transition-transform duration-200"
                >
                  <div className="p-6">
                    {/* Primary badge
                    {profile.isPrimary && (
                      <div className="inline-block bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white px-3 py-1 rounded-md border-2 border-black font-bold text-xs mb-3">
                        PRIMARY PROFILE
                      </div>
                    )} */}

                    {/* Profile info */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <div className="absolute -bottom-2 -right-2 w-full h-full bg-black rounded-full"></div>
                        <div className="relative z-10 h-16 w-16 rounded-full overflow-hidden border-4 border-black">
                          <img
                            src={profile.metadata?.picture || "/placeholder.png"}
                            alt={profile.username?.localName || formatAddress(profile.address)}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-lg">{profile.username?.localName || formatAddress(profile.address)}</h3>
                        <p className="text-sm text-gray-600 font-bold">@{profile.username?.localName || formatAddress(profile.address)}</p>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm mb-4 line-clamp-2">{profile.metadata?.bio || ""}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 border-2 border-black rounded-md bg-white text-center">
                        <p className="font-black">soon</p>
                        <p className="text-xs text-gray-600">Followers</p>
                      </div>
                      <div className="p-2 border-2 border-black rounded-md bg-white text-center">
                        <p className="font-black">soon</p>
                        <p className="text-xs text-gray-600">Following</p>
                      </div>
                    </div>

                    {/* Lens Protocol link */}
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                      <div className="bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] h-4 w-4 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-[8px]">L</span>
                      </div>
                      <span className="font-bold">View on Lens Protocol</span>
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Add new Lens profile suggestion */}
            <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
              <p className="text-sm text-gray-600 mb-2">Want to create another Lens profile with this wallet?</p>
              <a
                href="https://claim.lens.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white font-bold py-2 px-4 rounded-md border-2 border-black hover:-translate-y-1 transition-transform duration-200"
              >
                <User className="h-4 w-4" />
                Create New Lens Profile
              </a>
            </div>
          </div>
        </div>

        {/* NFTs Section */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-3xl font-black">Owned NFTs ({filteredNFTs.length})</h2>

            <div className="flex flex-wrap gap-3">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center bg-white text-black font-bold py-2 px-4 rounded-md border-2 border-black hover:-translate-y-1 transition-transform duration-200"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>

              {/* View options */}
              <div className="flex gap-2">
                <button className="p-2 rounded-md border-2 border-black bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white">
                  <Grid className="h-4 w-4" />
                </button>
                <button className="p-2 rounded-md border-2 border-black bg-white hover:bg-gray-100">
                  <Activity className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="bg-white rounded-lg border-4 border-black p-6 mb-6">
              <h3 className="font-black text-lg mb-4">Filter NFTs</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: "all", label: "All NFTs" },
                  { value: "art", label: "Art" },
                  { value: "collectibles", label: "Collectibles" },
                  { value: "multi-edition", label: "Multi-Edition" },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setFilterBy(filter.value as FilterOption)}
                    className={`py-2 px-4 rounded-md border-2 border-black font-bold ${
                      filterBy === filter.value
                        ? "bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* NFTs Grid */}
          {filteredNFTs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredNFTs.map((nft) => (
                <NFTCard 
                  key={nft.collection?.address + nft.nft.id.toString()} 
                  nft={convertToNFTWithMarketplaceInfo(nft)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border-4 border-black">
              <Grid className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">No NFTs Found</h3>
              <p className="text-gray-500 mb-6">This wallet doesn't own any NFTs yet.</p>
              <Link
                href="/explore"
                className="bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white font-bold py-2 px-6 rounded-md border-2 border-black inline-block"
              >
                Explore Marketplace
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
