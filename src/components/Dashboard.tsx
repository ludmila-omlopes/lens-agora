'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CollectedNFTs from './dashboard/CollectedNFTs'
import ListedNFTs from './dashboard/ListedNFTs'
import DeployedContracts from './dashboard/DeployedContracts'
import { useActiveAccount } from 'thirdweb/react'
import { Account } from 'thirdweb/wallets'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('collected')
  const account = useActiveAccount(); // Custom hook to fetch the active account

  return (
    <Tabs defaultValue="collected" onValueChange={(value) => setActiveTab(value)}>
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="collected">Collected NFTs</TabsTrigger>
        <TabsTrigger value="listed">Listed NFTs</TabsTrigger>
        <TabsTrigger value="deployed">Deployed Contracts</TabsTrigger>
      </TabsList>
      <TabsContent value="collected">
        <CollectedNFTs />
      </TabsContent>
      <TabsContent value="listed">
        <ListedNFTs />
      </TabsContent>
      <TabsContent value="deployed">
        <DeployedContracts />
      </TabsContent>
    </Tabs>
  )
}

