import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import NFTCard from '../../../../components/NFTCard'
import { NFT, ThirdwebContract } from 'thirdweb'
import { Collection } from '../../../../lib/types'

// In a real application, you'd fetch this data based on the collection ID
const collection = {
  id: 'wacky-toon-world',
  name: 'Wacky Toon World',
  description: 'Step into a realm of pure imagination with Wacky Toon World! This collection features an array of delightfully absurd and charmingly peculiar cartoon characters that will bring a smile to your face and a bounce to your step. Each NFT is a portal to a world where the laws of physics take a backseat to fun!',
  image: '/placeholder.svg?height=300&width=1200',
  creator: {
    name: 'Doodle Master',
    avatar: '/placeholder.svg?height=64&width=64'
  },
  stats: {
    items: 1000,
    owners: 750,
    floorPrice: '0.5 ETH',
    volumeTraded: '1250 ETH'
  },
  nfts: [
    { id: '42', name: 'Crazy Cartoon Critter #42', image: '/placeholder.svg?height=300&width=300', price: '5.5 ETH' },
    { id: '7', name: 'Giggling Gizmo #7', image: '/placeholder.svg?height=300&width=300', price: '3.2 ETH' },
    { id: '23', name: 'Wacky Widget #23', image: '/placeholder.svg?height=300&width=300', price: '2.8 ETH' },
    { id: '11', name: 'Silly Sculpture #11', image: '/placeholder.svg?height=300&width=300', price: '1.5 ETH' },
    { id: '99', name: 'Loony Landscape #99', image: '/placeholder.svg?height=300&width=300', price: '4.0 ETH' },
    { id: '63', name: 'Bonkers Balloon #63', image: '/placeholder.svg?height=300&width=300', price: '2.1 ETH' },
  ]
}

export default function CollectionClient({collectionContract, firstNFTs}: {collectionContract: Collection, firstNFTs: NFT[]}) {
  return (
    <div className="min-h-screen bg-purple-100 text-purple-900 p-8 [&_*]:shadow-cartoon">
      <div className="max-w-6xl mx-auto">
        <div className="relative h-64 rounded-xl overflow-hidden mb-8">
          <img
            src={collectionContract.imageUrl}
            alt={collectionContract.name}
            //fill - esse parametro é para Image do next.js
            className="object-cover"
          />
        </div>
        
        <div className="bg-white rounded-xl border-4 border-pink-400 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-purple-600">{collectionContract.name}</h1>
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4 border-2 border-purple-400">
                <AvatarImage src={collection.creator.avatar} alt={collection.creator.name} />
                <AvatarFallback>{collectionContract.owner}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-purple-400">Created by</p>
                <p className="font-bold text-purple-600">{collectionContract.owner}</p>
              </div>
            </div>
          </div>
          
          <p className="text-purple-500 mb-6">{collectionContract.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-yellow-100 rounded-lg p-4 text-center">
              <p className="text-sm text-purple-400">Items</p>
              <p className="font-bold text-purple-600">{collection.stats.items}</p>
            </div>
            <div className="bg-green-100 rounded-lg p-4 text-center">
              <p className="text-sm text-purple-400">Owners</p>
              <p className="font-bold text-purple-600">{collection.stats.owners}</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-4 text-center">
              <p className="text-sm text-purple-400">Floor Price</p>
              <p className="font-bold text-purple-600">{collection.stats.floorPrice}</p>
            </div>
            <div className="bg-pink-100 rounded-lg p-4 text-center">
              <p className="text-sm text-purple-400">Volume Traded</p>
              <p className="font-bold text-purple-600">{collection.stats.volumeTraded}</p>
            </div>
          </div>
          
          <Button className="w-full bg-yellow-400 text-purple-600 hover:bg-yellow-500 rounded-lg py-2 font-bold transform transition-transform hover:scale-105">
            View All Items
          </Button>
        </div>
        
        <h2 className="text-3xl font-bold text-purple-600 mb-6">Featured NFTs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {firstNFTs.map((nft) => (
            <NFTCard key={nft.id} nft={nft} collectionAddress={collectionContract.address} />
          ))}
        </div>
      </div>
    </div>
  )
}

