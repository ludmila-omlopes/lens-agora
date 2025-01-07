'use client'

import { useState } from 'react'
import { useTheme } from '@/app/contexts/ThemeContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const featuredGroups = [
  { id: 1, name: "Trust Me Bro", members: 10000, image: "/tmbro.webp" },
  { id: 2, name: "Foofees by Aoife", members: 9000, image: "/aoife.webp" },
  { id: 3, name: "Fries Lovers", members: 8000, image: "/fries.webp" },
]

const collectorsGroups = [
  { id: 1, name: "Bonsai Lords", members: 500, fee: "0.5 ETH", totalFunds: "250 ETH", image: "/bonsai.jpg" },
  { id: 2, name: "Emerging Artists Fund", members: 1000, fee: "0.2 ETH", totalFunds: "200 ETH", image: "/placeholder.png" },
  { id: 3, name: "Lens Queens", members: 300, fee: "1 ETH", totalFunds: "300 ETH", image: "/queen.jpg" },
]

export default function GroupsHighlight() {
  const { theme } = useTheme()

  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">Exclusive Groups</h2>
        <p className="text-center text-xl mb-12 text-gray-600 dark:text-gray-300">
          Connect with fellow collectors and join exclusive communities to participate in collective buying opportunities.
        </p>

        <Tabs defaultValue="join" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="join">Join Groups</TabsTrigger>
            <TabsTrigger value="collectors">Collectors Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="join">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredGroups.map((group) => (
                <Card key={group.id} className={theme === 'dark' ? 'bg-gray-700' : 'bg-white'}>
                  <CardHeader>
                    <Avatar className="w-16 h-16 mb-4">
                      <AvatarImage src={group.image} alt={group.name} />
                      <AvatarFallback>{group.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <CardTitle>{group.name}</CardTitle>
                    <CardDescription>{group.members} members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Join the exclusive group for {group.name} collectors and be part of the community.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Join Group</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="collectors">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collectorsGroups.map((group) => (
                <Card key={group.id} className={theme === 'dark' ? 'bg-gray-700' : 'bg-white'}>
                  <CardHeader>
                    <Avatar className="w-16 h-16 mb-4">
                      <AvatarImage src={group.image} alt={group.name} />
                      <AvatarFallback>{group.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <CardTitle>{group.name}</CardTitle>
                    <CardDescription>{group.members} members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Join this collectors group to participate in collective NFT purchases.
                    </p>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Membership Fee: {group.fee}
                    </p>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Total Funds: {group.totalFunds}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Join Collectors Group</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <Link href="/groups" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline">
            Explore all groups
          </Link>
        </div>
      </div>
    </section>
  )
}

