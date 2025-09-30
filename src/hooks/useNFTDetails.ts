"use client"

import { useState, useEffect, useRef } from "react"
import { NFT } from "thirdweb"
import { MarketplaceInfo, ActivityItem, Collection } from "../../lib/types"
import { isNFTOwnedByAddress } from "../../lib/nfts"
import { useActiveAccount } from "thirdweb/react"
import { useThirdwebWallet } from "./useThirdwebWallet"

interface UseNFTDetailsProps {
  nft: NFT
  marketplaceInfo: MarketplaceInfo
  activityItems: ActivityItem[]
  collection: Collection
  owners: string[]
}

export function useNFTDetails({ nft, marketplaceInfo, activityItems, collection, owners }: UseNFTDetailsProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isImageSticky, setIsImageSticky] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const buttonsRef = useRef<HTMLDivElement | null>(null)
  const imageContainerRef = useRef<HTMLDivElement | null>(null)

  useThirdwebWallet()
  const account = useActiveAccount()

  // Mobile detection
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Ownership check
  useEffect(() => {
    const checkOwnership = async () => {
      if (account && account.address) {
        try {
          const userIsOwner = await isNFTOwnedByAddress(account.address, nft, collection.address)
          setIsOwner(userIsOwner)
        } catch (error) {
          console.error("Failed to check ownership:", error)
        }
      }
    }
    checkOwnership()
  }, [account, nft, collection.address])

  // Scroll behavior for image sticky
  useEffect(() => {
    const handleScroll = () => {
      if (isMobile) {
        setIsImageSticky(false)
        return
      }

      if (buttonsRef.current && imageContainerRef.current) {
        const buttonsRect = buttonsRef.current.getBoundingClientRect()
        const imageRect = imageContainerRef.current.getBoundingClientRect()

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

  return {
    isLiked,
    setIsLiked,
    isImageSticky,
    setIsImageSticky,
    isMobile,
    isOwner,
    buttonsRef,
    imageContainerRef
  }
}
