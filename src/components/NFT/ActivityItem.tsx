"use client"

import Link from "next/link"
import { ActivityType } from "../../../lib/types"
import { formatAddress } from "../../../lib/profileUtils"
import { Account } from "@lens-protocol/client"

interface ActivityItemProps {
  item: any
  lensAccountMap: Map<string, Account>
}

export default function ActivityItem({ item, lensAccountMap }: ActivityItemProps) {
  // Helper function to get display info for an address
  const getDisplayInfo = (address: string) => {
    const lensAccount = lensAccountMap.get(address)
    if (lensAccount?.metadata) {
      return {
        name: lensAccount.metadata.name || lensAccount.username?.localName || formatAddress(address),
        avatar: lensAccount.metadata.picture || "/placeholder.png"
      }
    }
    return {
      name: formatAddress(address),
      avatar: "/placeholder.png"
    }
  }

  const actorInfo = item.actor ? getDisplayInfo(item.actor) : null
  const counterpartyInfo = item.counterparty ? getDisplayInfo(item.counterparty) : null

  return (
    <div className="flex items-center p-4 border-2 border-black rounded-md bg-white">
      <div className="h-10 w-10 rounded-full overflow-hidden relative border-2 border-black mr-3">
        {actorInfo && (
          <img
            src={actorInfo.avatar}
            alt={actorInfo.name!}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex-1">
        {item.type === ActivityType.NewBid && (
          <p className="font-bold">
            <Link href={"/profile/" + item.actor?.toString()} className="hover:underline">
              {actorInfo?.name || formatAddress(item.actor?.toString()!)}
            </Link>{" "}
            placed a bid of <span className="text-[#7F71D9]">{item.price?.toString()}</span>
          </p>
        )}
        {item.type === ActivityType.NewSale && (
          <p className="font-bold">
            Sold from{" "}
            <Link href={"/profile/" + item.actor?.toString()} className="hover:underline">
              {actorInfo?.name || formatAddress(item.actor?.toString()!)}
            </Link>{" "}
            to{" "}
            <Link href={"/profile/" + item.counterparty?.toString()} className="hover:underline">
              {counterpartyInfo?.name || formatAddress(item.counterparty?.toString()!)}
            </Link>
            {" "}for <span className="text-[#7F71D9]">{item.price?.toString()}</span> GHO
          </p>
        )}
        {item.type === ActivityType.NewListing && (
          <p className="font-bold">
            Listed for sale by{" "}
            <Link href={"/profile/" + item.actor?.toString()} className="hover:underline">
              {actorInfo?.name || formatAddress(item.actor?.toString()!)}
            </Link>
            {" "} for <span className="text-[#7F71D9]">{item.price?.toString()}</span> GHO
          </p>
        )}
        {item.type === ActivityType.NewAuction && (
          <p className="font-bold">
            Listed for Auction by{" "}
            <Link href={"/profile/" + item.actor?.toString()} className="hover:underline">
              {actorInfo?.name || formatAddress(item.actor?.toString()!)}
            </Link>
            {" "} for <span className="text-[#7F71D9]">{item.price?.toString()}</span> GHO
          </p>
        )}
      </div>
      <div className="text-sm text-gray-600 font-bold">{item.blockTimestamp?.toString()!}</div>
    </div>
  )
}
