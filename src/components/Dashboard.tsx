'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CollectedNFTs from './dashboard/CollectedNFTs'
import ListedNFTs from './dashboard/ListedNFTs'
import DeployedContracts from './dashboard/DeployedContracts'
import { useAccount } from "wagmi";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('collected')
  const account = useAccount();

  //todo: aqui os fetches estão sendo feitos no componente, mas o ideal é que sejam feitos no page.tsx e passados como props

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

