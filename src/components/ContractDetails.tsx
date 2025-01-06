'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ContractInfo from './contract/ContractInfo'
import MintedNFTs from './contract/MintedNFTs'
import { Collection } from '../../lib/types'
//import MintNFT from './contract/MintNFT'

export default function ContractDetails({ contract }: { contract: Collection }) {
  const [activeTab, setActiveTab] = useState('info')

  return (
    <Card className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
      <CardHeader>
        <CardTitle className="text-2xl">{contract.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="info" onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="info">Contract Info</TabsTrigger>
            <TabsTrigger value="minted">Minted NFTs</TabsTrigger>
          </TabsList>
          <TabsContent value="info">
            <ContractInfo contract={contract} />
          </TabsContent>
          <TabsContent value="minted">
            <MintedNFTs contractAddress={contract.address} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

