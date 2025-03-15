'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/app/contexts/ThemeContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collection } from '../../../../lib/types'
import { NFT } from 'thirdweb'
import { getNFTMediaURL } from '../../../../lib/nfts'

export default function CollectionDetails({collectionContract, firstNFTs}: {collectionContract: Collection, firstNFTs: NFT[]}) {
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState('items')

  return (
    <div className="space-y-8">
      <div className="relative h-64 rounded-lg overflow-hidden">
        <img className='object-none object-center'
          src={collectionContract.imageUrl}
          alt={`${collectionContract.name} banner`}
          //layout="fill"
          //objectFit="cover"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <img
          src={collectionContract.imageUrl}
          alt={`${collectionContract.name} logo`}
          width={100}
          height={100}
          className="rounded-full border-4 border-white dark:border-gray-800"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{collectionContract.name}</h1>
          <p className="text-gray-600 dark:text-gray-300">Created by {collectionContract.owner}</p>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300">{collectionContract.description}</p>

      <div className="grid grid-cols-3 gap-4">
        <Card className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Items</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{collectionContract.totalItems}</p>
          </CardContent>
        </Card>
        <Card className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Floor Price</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{collectionContract.marketplaceInfo?.totalListedItems && collectionContract.marketplaceInfo?.totalListedItems > 0 ? collectionContract.marketplaceInfo?.floorPrice : "-"} GRASS</p>
          </CardContent>
        </Card>
        <Card className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Volume Traded</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{collectionContract.marketplaceInfo?.volumeTraded}</p>
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
            {firstNFTs.map((nft) => (
              <Link href={`/items/${collectionContract.address}/${nft.id}`} key={nft.id}>
                <Card className={`${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} transition-colors duration-200`}>
                  <CardContent className="p-4">
                    <div className="aspect-square relative mb-2">
                      <img
                        src={getNFTMediaURL(nft)}
                        alt={nft.metadata.name}
                        //layout="fill"
                        //objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{nft.metadata.name}</h3>
                    {/*<p className="text-gray-600 dark:text-gray-300">{nft.price}</p>*/}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="activity">
          <p className="text-gray-700 dark:text-gray-300 mt-4">Recent activity will be displayed here soon.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}

