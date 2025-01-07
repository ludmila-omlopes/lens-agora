'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/app/contexts/ThemeContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for the collection
const collectionData = {
  id: '1',
  name: 'Bored Ape Yacht Club',
  description: 'The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain.',
  creator: 'Yuga Labs',
  totalItems: 10000,
  floorPrice: '30.5 ETH',
  volumeTraded: '487,000 ETH',
  bannerImage: '/placeholder.svg?text=BAYC+Banner',
  profileImage: '/placeholder.svg?text=BAYC+Logo',
}

const nfts = [
  { id: 1, name: "Bored Ape #1234", price: "50 ETH", image: "/placeholder.svg?text=Bored+Ape+1234" },
  { id: 2, name: "Bored Ape #5678", price: "45 ETH", image: "/placeholder.svg?text=Bored+Ape+5678" },
  { id: 3, name: "Bored Ape #9101", price: "55 ETH", image: "/placeholder.svg?text=Bored+Ape+9101" },
  // Add more NFTs as needed
]

export default function CollectionDetails({ id }: { id: string }) {
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState('items')

  return (
    <div className="space-y-8">
      <div className="relative h-64 rounded-lg overflow-hidden">
        <Image
          src={collectionData.bannerImage}
          alt={`${collectionData.name} banner`}
          layout="fill"
          objectFit="cover"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <Image
          src={collectionData.profileImage}
          alt={`${collectionData.name} logo`}
          width={100}
          height={100}
          className="rounded-full border-4 border-white dark:border-gray-800"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{collectionData.name}</h1>
          <p className="text-gray-600 dark:text-gray-300">Created by {collectionData.creator}</p>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300">{collectionData.description}</p>

      <div className="grid grid-cols-3 gap-4">
        <Card className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Items</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{collectionData.totalItems}</p>
          </CardContent>
        </Card>
        <Card className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Floor Price</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{collectionData.floorPrice}</p>
          </CardContent>
        </Card>
        <Card className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Volume Traded</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{collectionData.volumeTraded}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="items" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="items">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {nfts.map((nft) => (
              <Link href={`/nft/${nft.id}`} key={nft.id}>
                <Card className={`${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} transition-colors duration-200`}>
                  <CardContent className="p-4">
                    <div className="aspect-square relative mb-2">
                      <Image
                        src={nft.image}
                        alt={nft.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{nft.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{nft.price}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="activity">
          <p className="text-gray-700 dark:text-gray-300 mt-4">Recent activity will be displayed here.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
