'use client'

import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { useTheme } from "@/app/contexts/ThemeContext"
import Link from "next/link"
import { ArrowRight, Eye, Heart, Palette, Star, TrendingUp, Users } from "lucide-react"

export default function Hero() {
  const { theme } = useTheme()

  // Mockup data
  const heroStats = [
    { 
      label: "Total Volume", 
      value: "2,847 ETH", 
      icon: TrendingUp 
    },
    { 
      label: "Active Users", 
      value: "12,456", 
      icon: Users 
    },
    { 
      label: "Artworks", 
      value: "8,923", 
      icon: Palette 
    },
    { 
      label: "Artists", 
      value: "1,234", 
      icon: Star 
    }
  ]

  const featuredNFT = {
    title: "Yellow Dog",
    artist: "Space Cat",
    price: "2.5 ETH",
    likes: 234,
    views: 1500,
    imageUrl: "/girlanddog.png"
  }

  const heroContent = {
    title: "LENS AGORA",
    subtitle: "The decentralized marketplace where art meets community. Discover, collect, and trade unique digital assets powered by Lens Protocol.",
    ctaButtons: [
      {
        text: "EXPLORE MARKETPLACE",
        href: "/explore",
        variant: "primary"
      },
      {
        text: "CREATE NFT",
        href: "/create",
        variant: "secondary"
      }
    ]
  }

  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                <span className="bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] bg-clip-text text-transparent">
                  {heroContent.title.split(' ')[0]}
                </span>
                <br />
                <span className="text-black">{heroContent.title.split(' ')[1]}</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 max-w-lg">
                {heroContent.subtitle}
              </p>
            </div>

            {/* Hero Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {heroContent.ctaButtons.map((button, index) => (
                <Link
                  key={index}
                  href={button.href}
                  className={`${
                    button.variant === 'primary'
                      ? 'bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white'
                      : 'bg-white text-black'
                  } font-black py-4 px-8 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none flex items-center justify-center`}
                >
                  {button.text} {index === 0 ? <ArrowRight className="ml-2 h-5 w-5" /> : <Palette className="ml-2 h-5 w-5" />}
                </Link>
              ))}
            </div>

            {/* Quick Stats */}
            {/* 
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
              {heroStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-6 w-6 text-[#7F71D9]" />
                  </div>
                  <div className="text-2xl font-black">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
            */}
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="absolute -bottom-6 -right-6 w-full h-full bg-black rounded-lg"></div>
            <div className="relative z-10 border-4 border-black rounded-lg overflow-hidden bg-white">
              <Image
                src={featuredNFT.imageUrl}
                alt={featuredNFT.title}
                width={600}
                height={600}
                className="w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <div className="text-white">
                  <h3 className="text-xl font-black mb-1">{featuredNFT.title}</h3>
                  <p className="text-sm opacity-90">by {featuredNFT.artist}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-black">{featuredNFT.price}</span>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" /> {featuredNFT.likes}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" /> {featuredNFT.views}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

