'use client'

import Image from 'next/image'
import { useTheme } from '@/app/contexts/ThemeContext'
import { DirectListing } from 'thirdweb/extensions/marketplace'
import { getNFTMediaURL } from '../../lib/nfts'

const featuredNFTs = [
  { id: 1, name: "Cosmic Harmony", artist: "StellarArtist", price: "2.5 ETH" },
  { id: 2, name: "Digital Dreams", artist: "CyberCreator", price: "1.8 ETH" },
  { id: 3, name: "Neon Nights", artist: "GlowMaster", price: "3.2 ETH" },
  { id: 4, name: "Abstract Realms", artist: "QuantumBrush", price: "2.0 ETH" },
]

export default function FeaturedNFTs({ nfts }: { nfts: DirectListing[]}) {
  const { theme } = useTheme()

  return (
    <section className={`py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} transition-colors duration-300`}>
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-10 text-center">Featured NFTs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {nfts.map((nft) => (
            <div key={nft.id} className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300`}>
              <img 
                src={getNFTMediaURL(nft.asset)} 
                alt={nft.asset.metadata.name!} 
                width={300} 
                height={300} 
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{nft.asset.metadata.name!}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">by {nft.creatorAddress}</p> 
                <p className="text-pink-500 dark:text-pink-400 font-bold">{nft.pricePerToken}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

