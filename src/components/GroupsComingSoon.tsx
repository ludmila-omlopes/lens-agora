'use client'

import { useState } from 'react'
import { useTheme } from '@/app/contexts/ThemeContext'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users } from 'lucide-react'

export default function GroupsComingSoon() {
  const { theme } = useTheme()
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your backend
    console.log('Submitted email:', email)
    // Reset the input field
    setEmail('')
    // You might also want to show a success message to the user
  }

  return (
    <Card className={`max-w-2xl mx-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <Users size={48} className="text-pink-500" />
        </div>
        <CardTitle className="text-3xl font-bold text-center">Agora Groups Coming Soon!</CardTitle>
        <CardDescription className="text-center text-lg mt-2">
          Join exclusive collector communities and participate in collective buying opportunities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center mb-6">
          We're working hard to bring you an amazing group experience.
        </p>
      </CardContent>
    </Card>
  )
}

