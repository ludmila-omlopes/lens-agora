"use client"

import { useState, useEffect, lazy, Suspense, useMemo } from "react"
import Link from "next/link"
import { Activity } from "lucide-react"
import { ActivityItem, ActivityType } from "../../../lib/types"
import { formatAddress } from "../../../lib/profileUtils"
import { fetchAccountsBulk } from "@lens-protocol/client/actions"
import { lensPublicClient } from "../../../lib/client/lensProtocolClient"
import { Account, evmAddress } from "@lens-protocol/client"

// Lazy load the detailed activity item component
const ActivityItemComponent = lazy(() => import("./ActivityItem"))

interface ActivityFeedProps {
  activityItems: ActivityItem[]
}

export default function ActivityFeed({ activityItems }: ActivityFeedProps) {
  const [lensAccountMap, setLensAccountMap] = useState<Map<string, Account>>(new Map())
  const [loading, setLoading] = useState(true)

  // Extract unique addresses from activity items
  const uniqueAddresses = useMemo(() => 
    Array.from(new Set(
      activityItems
        .flatMap(item => [item.actor, item.counterparty])
        .filter(Boolean) as string[]
    )), [activityItems]
  )

  // Fetch Lens accounts for all unique addresses
  useEffect(() => {
    const fetchLensAccounts = async () => {
      if (uniqueAddresses.length === 0) {
        setLoading(false)
        return
      }
      
      try {
        const result = await fetchAccountsBulk(lensPublicClient, {
          ownedBy: uniqueAddresses.map(address => evmAddress(address))
        })
        
        if (result.isOk()) {
          const accountMap = new Map<string, Account>()
          result.value.forEach(account => {
            if (account.owner) { //todo: não tá considerando mais de uma account por address
              accountMap.set(account.owner, account)
            }
          })
          setLensAccountMap(accountMap)
        }
      } catch (error) {
        console.error("Failed to fetch Lens accounts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLensAccounts()
  }, [uniqueAddresses])

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-[#E5E2F9] rounded-lg border-4 border-black p-6">
        <h2 className="text-2xl font-black mb-4 flex items-center">
          <Activity className="mr-2 h-6 w-6" /> Activity
        </h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center p-4 border-2 border-black rounded-md bg-white animate-pulse">
              <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-[#E5E2F9] rounded-lg border-4 border-black p-6">
      <h2 className="text-2xl font-black mb-4 flex items-center">
        <Activity className="mr-2 h-6 w-6" /> Activity
      </h2>
      <div className="space-y-4">
        <Suspense fallback={
          <div className="flex items-center p-4 border-2 border-black rounded-md bg-white animate-pulse">
            <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        }>
          {activityItems.map((item, index) => (
            <ActivityItemComponent
              key={index}
              item={item}
              lensAccountMap={lensAccountMap}
            />
          ))}
        </Suspense>
      </div>
      <button className="w-full mt-4 py-2 border-2 border-black rounded-md font-bold bg-white hover:bg-[#F7F6FC]">
        View All Activity
      </button>
    </div>
  )
}
