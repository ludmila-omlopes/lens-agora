'use client'

import Link from 'next/link'
import { useTheme } from '@/app/contexts/ThemeContext'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const topCollectors = [
  { id: 1, name: "Princess Je$$yFries", username: "jessyjeanne", avatar: "/jessyb.jpg", totalValue: "1,234 GRASS" },
  { id: 2, name: "Stani", username: "stani", avatar: "/stani.webp", totalValue: "987 GRASS" },
  { id: 3, name: "Prince Twari", username: "princetiwari", avatar: "/tiwari.webp", totalValue: "876 GRASS" },
  { id: 4, name: "horticulture", username: "horticulture", avatar: "/horticulture.webp", totalValue: "765 GRASS" },
  { id: 5, name: "Kipto | Orb", username: "kipto", avatar: "/kipto.webp", totalValue: "654 GRASS" },
]

export default function TopCollectors() {
  const { theme } = useTheme()

  return (
    <section className="py-20">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-10 text-center">Top Collectors</h2>
        <Card className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            {topCollectors.map((collector, index) => (
              
                <div key={collector.id} className={`flex items-center justify-between p-4 ${index !== topCollectors.length - 1 ? 'border-b' : ''} ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-100'} transition-colors duration-200`}>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-gray-400 w-8">{index + 1}</span>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={collector.avatar} alt={collector.name} />
                      <AvatarFallback>{collector.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{collector.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">@{collector.username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800 dark:text-white">{collector.totalValue}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
                  </div>
                </div>
             
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

