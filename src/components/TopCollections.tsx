'use client'

import Image from 'next/image'
import { useTheme } from '@/app/contexts/ThemeContext'

const topCollections = [
  { id: 1, name: "Bored Ape Yacht Club", volume: "12,345 ETH", change: "+5.6%" },
  { id: 2, name: "CryptoPunks", volume: "10,987 ETH", change: "-2.3%" },
  { id: 3, name: "Azuki", volume: "8,765 ETH", change: "+8.1%" },
  { id: 4, name: "Doodles", volume: "6,543 ETH", change: "+3.7%" },
  { id: 5, name: "CloneX", volume: "5,432 ETH", change: "-1.5%" },
]

export default function TopCollections() {
  const { theme } = useTheme()

  return (
    <section className="py-20">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-10 text-center">Top Collections</h2>
        <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-lg overflow-hidden transition-colors duration-300`}>
          {topCollections.map((collection, index) => (
            <div key={collection.id} className={`flex items-center justify-between p-4 ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} transition-colors duration-300`}>
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-gray-400 w-8">{index + 1}</span>
                <Image 
                  src={`/placeholder.svg?text=${collection.name[0]}`} 
                  alt={collection.name} 
                  width={50} 
                  height={50} 
                  className="rounded-full"
                />
                <span className="text-gray-800 dark:text-white font-semibold">{collection.name}</span>
              </div>
              <div className="text-right">
                <p className="text-gray-800 dark:text-white">{collection.volume}</p>
                <p className={collection.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                  {collection.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

