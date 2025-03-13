'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ExistingContractForm from '@/components/ExistingContractForm'
import NewContractForm from '@/components/NewContractForm'
import { useTheme } from '../contexts/ThemeContext'
import CreateNFTProcess from '@/components/CreateNFTProcess'

export default function CreateNFT() {

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-gray-900 dark:via-purple-900 dark:to-violet-800">
        <div className="container mx-auto py-8 px-4">
          <CreateNFTProcess />
        </div>
      </div>
    )
}

