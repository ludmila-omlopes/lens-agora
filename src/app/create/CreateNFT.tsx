'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ExistingContractForm from '@/components/ExistingContractForm'
import NewContractForm from '@/components/NewContractForm'
import { useTheme } from '../contexts/ThemeContext'
import CreateNFTProcess from '@/components/CreateNFTProcess'

export default function CreateNFT() {
  const { theme } = useTheme()
  const [contractType, setContractType] = useState<'existing' | 'new'>('existing')

  /*return (
    <Card className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} max-w-4xl mx-auto shadow-2xl`}>
      <CardHeader className="text-center">
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="existing" onValueChange={(value) => setContractType(value as 'existing' | 'new')}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="existing" className="text-lg py-3">Existing Contract</TabsTrigger>
            <TabsTrigger value="new" className="text-lg py-3">New Contract</TabsTrigger>
          </TabsList>
          <TabsContent value="existing">
            <ExistingContractForm />
          </TabsContent>
          <TabsContent value="new">
            <NewContractForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  ) */

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-gray-900 dark:via-purple-900 dark:to-violet-800">
        <div className="container mx-auto py-8 px-4">
          <CreateNFTProcess />
        </div>
      </div>
    )
}



//todo: colocar que vai ter auctions soon

