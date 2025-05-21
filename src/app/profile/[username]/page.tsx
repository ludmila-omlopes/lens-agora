"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { User, Users, Grid, ImageIcon, Palette, Heart, Globe, Wallet } from "lucide-react"
import { getAccountStats, getLensAccount, getIsFollowingStatus, getLastLoggedAccountByWalletAddress } from "../../../../lib/lensProtocolUtils"
import { set } from "zod"
import { Account, Role, AccountGraphsFollowStats } from "@lens-protocol/client"
import { useLensSession } from "@/contexts/LensSessionContext"
import { useThirdwebWallet } from "@/hooks/useThirdwebWallet"
import { useActiveAccount } from "thirdweb/react"
import CollectionsTab from "@/components/profileTabs/CollectionsTab"
import { ProductsTab } from "@/components/profileTabs/ProductsTab"
import OwnedNFTsTab from "@/components/profileTabs/OwnedNFTsTab"
import CollectorsTab from "@/components/profileTabs/CollectorsTab"
import FollowingTab from "@/components/profileTabs/FollowingTab"
import FollowersTab from "@/components/profileTabs/FollowersTab"
import { formatAddress, isWalletAddress } from "../../../../lib/profileUtils"

// Tab type
type TabType = "collections" | "owned" | "products" | "collectors" | "following" | "followers"

// Main Profile Page Component
export default function ProfilePage({ params }: { params: { username: string } }) {

  const [activeTab, setActiveTab] = useState<TabType>("collections")
  const [userData, setUserData] = useState<Account | null>(null)
  const [ accountStats, setAccountStats ] = useState<AccountGraphsFollowStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [loggedAccount, setLoggedAccount] = useState<Account | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isWallet, setIsWallet] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  const { getLoggedAccount } = useLensSession();

    useThirdwebWallet();
    const account = useActiveAccount();

    useEffect(() => {
      const fetchUserData = async () => {
        setLoading(true);
        const identifier = params.username
        const isWalletAddress2 = isWalletAddress(identifier)
        setIsWallet(isWalletAddress2);
  
        if (!isWalletAddress2) {
          const loggedAccount = await getLoggedAccount();
          if (loggedAccount) setLoggedAccount(loggedAccount);
          //todo: a logged account deve ser usada só pelo owner. talvez essa página não seja a mais adequada.
          const lensAccount = await getLensAccount(params.username);
          if (lensAccount) {
            setWalletAddress(lensAccount.owner);
            setUserData(lensAccount);
            const isFollowingStatus = await getIsFollowingStatus(params.username, lensAccount.address);
            setIsFollowing(isFollowingStatus || false);
            const accStats = await getAccountStats(params.username);
            if (accStats) {
              setAccountStats(accStats);
            }
          }
          
        }
        else {
          //todo: alterar essa página pra mostrar todas as accounts que o endereço tem.
          const lastloggedAccount = await getLastLoggedAccountByWalletAddress(identifier);
          if (!lastloggedAccount || !lastloggedAccount.username?.localName) {
            setWalletAddress(identifier);
          }
          else {
            setWalletAddress(lastloggedAccount.owner);
            setUserData(lastloggedAccount);
            setIsWallet(false);
            if(lastloggedAccount.username?.localName) {
              const isFollowingStatus = await getIsFollowingStatus(lastloggedAccount.username?.localName, lastloggedAccount.address);
              setIsFollowing(isFollowingStatus || false);
            }
            const accStats = await getAccountStats(lastloggedAccount.username?.localName);
            if (accStats) {
              console.log("accStats", accStats);
              setAccountStats(accStats);
            }
          }
        }
        setLoading(false);
      };
  
      fetchUserData();
    }, [params.username]);

  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    } else {
      return num.toString()
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 bg-gradient-to-b from-[#F7F6FC] to-[#F0EFPA] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-black border-t-[#7F71D9] rounded-full animate-spin mb-4"></div>
          <p className="font-bold">Loading profile...</p>
        </div>
      </div>
    )
  }

  // User not found
  if (!isWallet && !userData) {
    return (
      <div className="container mx-auto py-12 px-4 bg-gradient-to-b from-[#F7F6FC] to-[#F0EFPA] min-h-screen">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg border-4 border-black text-center">
          <h1 className="text-2xl font-black mb-4">User Not Found</h1>
          <p className="mb-6">The user you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/"
            className="bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white font-bold py-2 px-4 rounded-md border-2 border-black inline-block"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-[#F7F6FC] to-[#F0EFPA] min-h-screen">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 w-full">
        <img src={userData?.metadata?.coverPicture || "/placeholder.png"} alt="Cover" className="object-cover h-64 w-full md:h-80" />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="relative -mt-20 mb-8">
          <div className="relative z-10 bg-white rounded-lg border-4 border-black p-6 pt-24">
            {/* Avatar - positioned to overlap the cover image */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 md:left-8 md:transform-none">
              <div className="relative">
                <div className="absolute -bottom-1 -right-1 w-full h-full bg-black rounded-full"></div>
                <div className="relative z-10 h-32 w-32 rounded-full overflow-hidden border-4 border-black bg-white">
                  <img
                    src={userData?.metadata?.picture || "/placeholder.png"}
                    alt={userData?.username?.localName || "User Avatar"}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Profile info */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h1 className="text-3xl font-black">{(isWallet && walletAddress) ? formatAddress(walletAddress) : userData?.metadata?.name}</h1>
                <p className="text-gray-600">{(!isWallet ? ("@" + userData?.username?.localName) : "")}</p>
              </div>

              {/* Follow button and social links */}
              {isWallet && (
                <div>
                  <p className="text-gray-600">This address is not associated with any Lens profile.</p>
                  <Link href="/newAccount" className="bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white font-bold py-2 px-6 rounded-md border-2 border-black inline-block mt-4">
                    Create a Lens Protocol Account
                  </Link>
                  </div>
              )}
              { (!isWallet && userData) &&
              <div className="flex flex-col items-center md:items-end gap-3">
                <button className="bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white font-bold py-2 px-6 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0 active:shadow-none">
                  {isFollowing ? "Following" : "Follow"}
                </button>

                <div className="flex gap-2">
                  {/* userData.website && (
                    <a
                      href={userData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-md border-2 border-black bg-white hover:bg-gray-100"
                      aria-label="Website"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  )*/}
                  <button
                    onClick={() => {
                      // In a real app, you would copy the address to clipboard
                      alert(`Wallet address: ${walletAddress || "0x1234...5678"}`)
                    }}
                    className="p-2 rounded-md border-2 border-black bg-white hover:bg-gray-100"
                    aria-label="Wallet Address"
                  >
                    <Wallet className="h-5 w-5" />
                  </button>
                  <a
                    href={`https://hey.xyz/u/${userData?.username?.localName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-md border-2 border-black bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] hover:opacity-90"
                    aria-label="Lens Profile"
                  >
                    <div className="text-white font-bold text-xs flex items-center justify-center">Hey</div>
                  </a>
                </div>
              </div>
              }
            </div>

            {/* Bio */}
            <div className="mt-6 mb-8">
              <p className="text-gray-700">{userData?.metadata?.bio}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto md:mx-0">
              <div className="p-3 border-2 border-black rounded-md bg-gradient-to-br from-[#F7B5DE] to-[#F29BD4] text-center">
                <p className="text-2xl font-black">{formatNumber(accountStats?.followers || 0)}</p>
                <p className="text-sm font-bold">Followers</p>
              </div>
              <div className="p-3 border-2 border-black rounded-md bg-gradient-to-br from-[#D7D3F5] to-[#CFC9F2] text-center">
                <p className="text-2xl font-black">{formatNumber(accountStats?.following || 0)}</p>
                <p className="text-sm font-bold">Following</p>
              </div>
              <div className="p-3 border-2 border-black rounded-md bg-gradient-to-br from-[#8EF5F5] to-[#7EF2F2] text-center">
                <p className="text-2xl font-black">{formatNumber(0)}</p> {/* todo: definir os collectors */}
                <p className="text-sm font-bold">Collectors</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex min-w-max border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab("collections")}
              className={`px-4 py-3 font-bold ${
                activeTab === "collections"
                  ? "border-b-4 border-[#7F71D9] text-[#7F71D9]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center">
                <Grid className="mr-2 h-5 w-5" /> Collections
              </span>
            </button>
            {/*<button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-3 font-bold ${
                activeTab === "products"
                  ? "border-b-4 border-[#7F71D9] text-[#7F71D9]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center">
                <Palette className="mr-2 h-5 w-5" /> Products
              </span>
            </button>*/}
            <button
              onClick={() => setActiveTab("owned")}
              className={`px-4 py-3 font-bold ${
                activeTab === "owned"
                  ? "border-b-4 border-[#7F71D9] text-[#7F71D9]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center">
                <ImageIcon className="mr-2 h-5 w-5" /> Owned
              </span>
            </button>
            <button
              onClick={() => setActiveTab("collectors")}
              className={`px-4 py-3 font-bold ${
                activeTab === "collectors"
                  ? "border-b-4 border-[#7F71D9] text-[#7F71D9]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center">
                <Users className="mr-2 h-5 w-5" /> Collectors
              </span>
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`px-4 py-3 font-bold ${
                activeTab === "following"
                  ? "border-b-4 border-[#7F71D9] text-[#7F71D9]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center">
                <User className="mr-2 h-5 w-5" /> Following
              </span>
            </button>
            <button
              onClick={() => setActiveTab("followers")}
              className={`px-4 py-3 font-bold ${
                activeTab === "followers"
                  ? "border-b-4 border-[#7F71D9] text-[#7F71D9]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center">
                <Heart className="mr-2 h-5 w-5" /> Followers
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-16">
          {/* Collections Tab (formerly Galleries) */}
          {activeTab === "collections" && <CollectionsTab address={walletAddress || ""} />}

          {/* Products Tab (formerly Created NFTs) */}
          {activeTab === "products" && <span>Soon...</span> /*<ProductsTab account={userData} />*/}
          
          {/* Owned NFTs Tab */}
          {activeTab === "owned" && <OwnedNFTsTab address={walletAddress || ""} />}

          {/* Collectors Tab */}
          {activeTab === "collectors" && <span>Soon...</span> /*<CollectorsTab account={userData} />*/}

          {/* Following Tab */}
          {activeTab === "following" && <span>Soon...</span> /*<FollowingTab account={userData} />*/}

          {/* Followers Tab */}
          {activeTab === "followers" && <span>Soon...</span> /*<FollowersTab account={userData} />*/}

          </div>

        {/* Lens Protocol Integration Note */}
        <div className="mb-16 p-4 bg-white rounded-lg border-2 border-black">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] h-6 w-6 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">L</span>
            </div>
            <span>Social features powered by Lens Protocol</span>
          </div>
        </div>
        </div>
    </div>
  )
}
