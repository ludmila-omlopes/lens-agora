'use client'

import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { useTheme } from "@/app/contexts/ThemeContext"

export default function Hero() {
  const { theme } = useTheme()

  return (
    <section className="py-20 text-gray-800 dark:text-white transition-colors duration-300">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-5xl font-bold mb-6 leading-tight">Lens Agora - Where Creativity Meets Community</h1>
          <p className="text-xl mb-8">Explore, connect, and thrive in the first social marketplace powered by Lens Network and Lens Protocol social graphs.</p>
          <div className="flex space-x-4">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white">Explore</Button>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white">Create</Button>
          </div>
        </div>
        <div className="md:w-1/2 relative">
          <div className={`w-80 h-80 rounded-full ${theme === 'dark' ? 'bg-pink-500' : 'bg-pink-300'} absolute top-0 right-0 filter blur-3xl opacity-50 animate-pulse`}></div>
          <div className={`w-80 h-80 rounded-full ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-300'} absolute bottom-0 left-0 filter blur-3xl opacity-50 animate-pulse`}></div>
          <img 
            src="/girlanddog.png" 
            alt="Featured NFT" 
            width={500} 
            height={500} 
            className="rounded-lg shadow-2xl relative z-10 transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </section>
  )
}

