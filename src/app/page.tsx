'use client'

import { useEffect, useState } from 'react'
import Hero from '@/components/Hero'
import FeaturedNFTs from '@/components/FeaturedNFTs'
import TopCollections from '@/components/TopCollections'
import { useTheme } from './contexts/ThemeContext'
import { getFeaturedListings } from '../../lib/marketplacev3'
import { DirectListing } from 'thirdweb/extensions/marketplace'

export default function Home() {
  const { theme } = useTheme()
  const [featuredNFTs, setFeaturedNFTs] = useState<DirectListing[]>([])

  useEffect(() => {
    async function fetchFeaturedNFTs() {
      try {
        const data = await getFeaturedListings()
        setFeaturedNFTs(data)
      } catch (error) {
        console.error('Error fetching featured NFTs:', error)
      }
    }

    fetchFeaturedNFTs()
  }, [])

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800' : 'bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100'} transition-colors duration-300`}>
      <main>
        <Hero />
        <FeaturedNFTs nfts={featuredNFTs} />
        <TopCollections />
      </main>
    </div>
  )
}
