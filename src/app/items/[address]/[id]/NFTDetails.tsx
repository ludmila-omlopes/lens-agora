"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Share2, Flag, ExternalLink, Tag, MessageCircle, Activity } from "lucide-react"
import { NFT } from "thirdweb"
import { MarketplaceInfo } from "../../../../../lib/types"
import { resolveScheme } from "thirdweb/storage"
import { thirdwebClient } from "../../../../../lib/client/thirdwebClient"
import { off } from "process"
import { useActiveAccount, useSocialProfiles } from "thirdweb/react"
import { comment } from "postcss"
import { useThirdwebWallet } from "@/hooks/useThirdwebWallet"
import { isNFTOwnedByAddress } from "../../../../../lib/nfts"
import { NFTBuyActions } from "@/components/NFT/NFTBuyActions"
import { marketplaceContractAddress } from "../../../../../lib/marketplacev3"
import NFTOffersSection from "@/components/NFT/NFTOffersSection"

export default function NFTDetails( {nft, marketplaceInfo } : {nft: NFT, marketplaceInfo: MarketplaceInfo} ) {
  const [isLiked, setIsLiked] = useState(false)
  const [isImageSticky, setIsImageSticky] = useState(true)
  const buttonsRef = useRef<HTMLDivElement | null>(null)
  const imageContainerRef = useRef<HTMLDivElement | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is Tailwind's md breakpoint
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Handle scroll behavior for the image - only on desktop
  useEffect(() => {
    const handleScroll = () => {
      if (isMobile) {
        // Don't apply sticky behavior on mobile
        setIsImageSticky(false)
        return
      }

      if (buttonsRef.current && imageContainerRef.current) {
        const buttonsRect = buttonsRef.current.getBoundingClientRect()
        const imageRect = imageContainerRef.current.getBoundingClientRect()

        // If the buttons are about to come into view, stop the image from being sticky
        if (buttonsRect.top <= imageRect.bottom) {
          setIsImageSticky(false)
        } else {
          setIsImageSticky(true)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isMobile])

    const nftSocialInfo = {
    likes: 47,
    categories: ["Digital Art", "Surrealism", "3D", "Animation"],
    comments: [
      {
        user: {
          name: "ArtLover",
          avatar: "/placeholder.svg?height=40&width=40",
          link: "/user/artlover",
        },
        text: "This piece speaks to me on so many levels. The colors are incredible!",
        time: "1 day ago",
      },
      {
        user: {
          name: "CryptoCollector",
          avatar: "/placeholder.svg?height=40&width=40",
          link: "/user/cryptocollector",
        },
        text: "One of the best pieces in this collection. The detail is amazing.",
        time: "3 days ago",
      },
      {
        user: {
          name: "DigitalArtFan",
          avatar: "/placeholder.svg?height=40&width=40",
          link: "/user/digitalartfan",
        },
        text: "I love how this piece blends abstract elements with recognizable forms. It's like looking into another dimension.",
        time: "5 days ago",
      },
      {
        user: {
          name: "NFTNewbie",
          avatar: "/placeholder.svg?height=40&width=40",
          link: "/user/nftnewbie",
        },
        text: "Just discovered this artist and I'm blown away. The technique used here is masterful.",
        time: "1 week ago",
      },
    ],
    }

    const auctionInfo = {
    highestBid: {
      amount: "1.45 ETH",
      bidder: {
        name: "NFTEnthusiast",
        avatar: "/placeholder.svg?height=40&width=40",
        link: "/user/nftenthusiast",
      },
    }
  }

  const activityInfo = {
    activity: [
      {
        type: "bid",
        user: {
          name: "NFTEnthusiast",
          avatar: "/placeholder.svg?height=40&width=40",
          link: "/user/nftenthusiast",
        },
        amount: "1.45 ETH",
        time: "2 hours ago",
      },
      {
        type: "bid",
        user: {
          name: "CryptoArtFan",
          avatar: "/placeholder.svg?height=40&width=40",
          link: "/user/cryptoartfan",
        },
        amount: "1.3 ETH",
        time: "5 hours ago",
      },
      {
        type: "transfer",
        from: {
          name: "OriginalOwner",
          avatar: "/placeholder.svg?height=40&width=40",
          link: "/user/originalowner",
        },
        to: {
          name: "ArtCollector",
          avatar: "/placeholder.svg?height=40&width=40",
          link: "/user/artcollector",
        },
        time: "2 days ago",
      },
      {
        type: "mint",
        user: {
          name: "Marcus Kim",
          avatar: "/placeholder.svg?height=40&width=40",
          link: "/artist/marcus-kim",
        },
        time: "1 month ago",
      },
    ],
  }

 const resolvedImageurl = resolveScheme({ uri: nft.metadata.image!, client: thirdwebClient });

 const { data: artistProfiles,  } = useSocialProfiles({
       client: thirdwebClient,
       address: marketplaceInfo.collection.owner, 
     });
 
 const ensProfile = artistProfiles && artistProfiles.find(profile => profile.type === 'ens');

 const [isOwner, setIsOwner] = useState(false);
   
   useThirdwebWallet();
   const account = useActiveAccount();
 
   useEffect(() => {
           const checkOwnership = async () => {
             if (account && account.address) {
               const userIsOwner = await isNFTOwnedByAddress(account.address, nft, marketplaceInfo.collection.address);
               console.log("User is owner:", userIsOwner);
               setIsOwner(userIsOwner);
             }
           };
           checkOwnership();
         }, [account, nft]);
 
 return (
    <div className="container mx-auto py-12 px-4 bg-gradient-to-b from-[#F7F6FC] to-[#F0EFFA]">
      <div className="relative grid md:grid-cols-2 gap-10">
        {/* Social actions - Moved to top right */}
        <div className="absolute top-0 right-0 flex gap-2 z-10">
          <button
            className={`p-3 rounded-md border-2 border-black ${isLiked ? "bg-[#F29BD4] text-white" : "bg-white"} transition-colors`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-white" : ""}`} />
            <span className="sr-only">Like</span>
          </button>
          <button className="p-3 rounded-md border-2 border-black bg-white">
            <Share2 className="h-5 w-5" />
            <span className="sr-only">Share</span>
          </button>
          <button className="p-3 rounded-md border-2 border-black bg-white">
            <Flag className="h-5 w-5" />
            <span className="sr-only">Report</span>
          </button>
        </div>

        {/* Left column - NFT Image with sticky behavior only on desktop */}
        <div
          ref={imageContainerRef}
          className={`relative ${!isMobile && isImageSticky ? "md:sticky md:top-6" : ""}`}
          style={{ height: "fit-content" }}
        >
          <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-lg hidden md:block"></div>
          <div className="relative z-10 border-4 border-black rounded-lg overflow-hidden bg-white">
            <img
              src={resolvedImageurl || "/placeholder.png"}
              alt={nft.metadata.name!}
              width={600}
              height={600}
              className="w-full object-cover"
            />
          </div>
        </div>

        {/* Right column - NFT Details */}
        <div className="space-y-6">
          {/* Collection name */}
          <Link
            href={`/items/${marketplaceInfo.collection.address}`}
            className="inline-block bg-gradient-to-r from-[#D7D3F5] to-[#CFC9F2] px-4 py-2 rounded-md border-2 border-black font-bold hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            {marketplaceInfo.collection.name}
          </Link>

          {/* Title */}
          <h1 className="text-4xl font-black mb-2">{nft.metadata.name!}</h1>

          {/* Likes info */}
          <div className="flex items-center font-bold mb-4">
            <Heart className="h-5 w-5 mr-1" />
            {nftSocialInfo.likes} likes
          </div>

          {/* Description - Moved above buttons */}
          <div className="bg-gradient-to-br from-white to-[#F7F6FC] rounded-lg border-4 border-black p-6 mb-6">
            <p className="text-lg mb-6">{nft.metadata.description}</p>

            {/* Category tags */}
            <div className="flex flex-wrap gap-2">
              {nftSocialInfo.categories.map((category, index) => (
                <Link
                  key={index}
                  href={`/category/${category.toLowerCase().replace(" ", "-")}`}
                  className="bg-[#F7F6FC] px-3 py-1 rounded-md border-2 border-black font-bold text-sm hover:bg-white"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          {/* Current price/bid */}
          {marketplaceInfo.auction && marketplaceInfo.auction.status !== "CANCELLED" && (
          <div className="bg-gradient-to-br from-[#D7D3F5] to-[#CFC9F2] p-5 rounded-lg border-4 border-black">
            <p className="text-sm font-bold text-gray-600">Current highest bid</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-black">{auctionInfo.highestBid.amount}</p>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full overflow-hidden relative border-2 border-black">
                  <img
                    src={auctionInfo.highestBid.bidder.avatar || "/placeholder.svg"}
                    alt={auctionInfo.highestBid.bidder.name}
                    className="object-cover"
                  />
                </div>
                <Link href={auctionInfo.highestBid.bidder.link} className="font-bold text-sm hover:underline">
                  {auctionInfo.highestBid.bidder.name}
                </Link>
              </div>
            </div>
          </div>)}
          {marketplaceInfo.listing && marketplaceInfo.listing.status !== "CANCELLED" && (
            <div className="bg-gradient-to-br from-[#D7D3F5] to-[#CFC9F2] p-5 rounded-lg border-4 border-black flex items-center justify-between">
              <p className="text-3xl font-black">{Number(marketplaceInfo.listing.pricePerToken) / 10 ** 18} GHO</p>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full overflow-hidden relative border-2 border-black">
                  <Image
                    src={"/placeholder.svg"}
                    alt={nft.owner!}
                    fill
                    className="object-cover"
                  />
                </div>
                <Link href={"#"} className="font-bold text-sm hover:underline">
                  Owned by {nft.owner}
                </Link>
              </div>
            </div>)}

          {/* Action buttons */}
           <div ref={buttonsRef}>
            <NFTBuyActions
                        isOwner={isOwner} 
                        marketplaceInfo={marketplaceInfo}
                        contractAddress={marketplaceContractAddress}
                        assetContract={marketplaceInfo.collection.address}
                        tokenId={nft.id.toString()}
                      />
          </div>
          
        </div>
      </div>

      {/* Content sections - No tabs, vertical layout */}
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        {/* Left/Center content (2 columns) */}
        <div className="md:col-span-2 space-y-8">
          {/* Offers section */}
          <NFTOffersSection collectionAddress={marketplaceInfo.collection.address} tokenId={marketplaceInfo.nft.id} isOwner={isOwner} />
          {/* Activity feed */}
          <div className="bg-gradient-to-br from-white to-[#E5E2F9] rounded-lg border-4 border-black p-6">
            <h2 className="text-2xl font-black mb-4 flex items-center">
              <Activity className="mr-2 h-6 w-6" /> Activity
            </h2>
            <div className="space-y-4">
              {activityInfo.activity.map((item, index) => (
                <div key={index} className="flex items-center p-4 border-2 border-black rounded-md bg-white">
                  <div className="h-10 w-10 rounded-full overflow-hidden relative border-2 border-black mr-3">
                    <img
                      src={item.user?.avatar || item.from?.avatar}
                      alt={item.user?.name || item.from?.name}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    {item.type === "bid" && (
                      <p className="font-bold">
                        <Link href={item.user?.link!} className="hover:underline">
                          {item.user?.name}
                        </Link>{" "}
                        placed a bid of <span className="text-[#7F71D9]">{item.amount}</span>
                      </p>
                    )}
                    {item.type === "transfer" && (
                      <p className="font-bold">
                        Transferred from{" "}
                        <Link href={item.from?.link!} className="hover:underline">
                          {item.from?.name}
                        </Link>{" "}
                        to{" "}
                        <Link href={item.to?.link!} className="hover:underline">
                          {item.to?.name!}
                        </Link>
                      </p>
                    )}
                    {item.type === "mint" && (
                      <p className="font-bold">
                        Minted by{" "}
                        <Link href={item.user?.link!} className="hover:underline">
                          {item.user?.name!}
                        </Link>
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 font-bold">{item.time}</div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 border-2 border-black rounded-md font-bold bg-white hover:bg-[#F7F6FC]">
              View All Activity
            </button>
          </div>
        </div>

        {/* Right sidebar - Collection info */}
        <div className="space-y-8">
          <div className="sticky top-6 space-y-8">
            {/* Collection info with artist moved here */}
            <div className="bg-gradient-to-br from-white to-[#E0FAFA] rounded-lg border-4 border-black p-6">
              <h2 className="text-xl font-black mb-4">About Collection</h2>

              {/* Artist info - Moved from main section to here */}
              <div className="flex items-center gap-3 p-4 border-2 border-black rounded-md bg-white mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden relative border-2 border-black">
                  <img
                    src={ensProfile?.avatar || "/placeholder.png"}
                    alt={ensProfile?.name!}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-bold">Artist</p>
                  <Link href={""} className="font-bold hover:underline">
                    {ensProfile?.name!}
                  </Link>
                </div>
              </div>

              <p className="mb-4">{marketplaceInfo.collection.description}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border-2 border-black rounded-md bg-white">
                  <p className="text-sm text-gray-600">Items</p>
                  <p className="font-black">{marketplaceInfo.collection.items?.length}</p>
                </div>
                <div className="p-3 border-2 border-black rounded-md bg-white">
                  <p className="text-sm text-gray-600">Owners</p>
                  <p className="font-black">soon</p>
                </div>
                <div className="p-3 border-2 border-black rounded-md bg-white">
                  <p className="text-sm text-gray-600">Floor Price</p>
                  <p className="font-black">{marketplaceInfo.collection.marketplaceInfo?.floorPrice}</p>
                </div>
                <div className="p-3 border-2 border-black rounded-md bg-white">
                  <p className="text-sm text-gray-600">Volume Traded</p>
                  <p className="font-black">{marketplaceInfo.collection.marketplaceInfo?.volumeTraded}</p>
                </div>
              </div>
              <Link
                href={`/items/${marketplaceInfo.collection.address}`}
                className="flex items-center justify-center w-full mt-4 bg-gradient-to-r from-[#D7D3F5] to-[#CFC9F2] font-bold py-2 px-4 rounded-md border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                View Collection <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* Comments section */}
            <div className="bg-gradient-to-br from-white to-[#F7E5F2] rounded-lg border-4 border-black p-6">
              <h2 className="text-xl font-black mb-4 flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" /> Comments
              </h2>
              <div className="space-y-4">
                {/* Show only first 2 comments */}
                {nftSocialInfo.comments.slice(0, 2).map((comment, index) => (
                  <div key={index} className="p-3 border-2 border-black rounded-md bg-white">
                    <div className="flex items-center mb-2">
                      <div className="h-6 w-6 rounded-full overflow-hidden relative border-2 border-black mr-2">
                        <img
                          src={comment.user.avatar || "/placeholder.svg"}
                          alt={comment.user.name}
                          className="object-cover"
                        />
                      </div>
                      <Link href={comment.user.link} className="font-bold text-sm hover:underline">
                        {comment.user.name}
                      </Link>
                      <div className="text-xs text-gray-600 ml-auto">{comment.time}</div>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                ))}

                {/* See more comments link */}
                {nftSocialInfo.comments.length > 2 && (
                  <Link
                    href="#"
                    className="block text-center py-2 border-2 border-black rounded-md font-bold text-sm bg-white hover:bg-[#F7F6FC]"
                  >
                    See {nftSocialInfo.comments.length - 2} More Comments
                  </Link>
                )}

                {/* Comment input */}
                <div className="flex gap-2 mt-4">
                  <div className="h-8 w-8 rounded-full overflow-hidden relative border-2 border-black flex-shrink-0">
                    <img src="/placeholder.svg?height=40&width=40" alt="Your avatar" className="object-cover" />
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="w-full p-2 text-sm border-2 border-black rounded-md font-bold bg-white"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#7F71D9] text-white font-bold py-1 px-2 text-xs rounded-md border-1 border-black">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

