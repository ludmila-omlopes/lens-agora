'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import { useTheme } from '@/app/contexts/ThemeContext'

export default function Footer() {
  const { theme } = useTheme()

  return (
    <footer className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'} py-10 transition-colors duration-300`}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Lens Agora Marketplace</h3>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Discover, collect, and sell extraordinary NFTs</p>
          </div>
          {/*<div>
            <h4 className="text-lg font-semibold mb-4">Marketplace</h4>
            <ul className="space-y-2">
              <li><Link href="/explore" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>All NFTs</Link></li>
              <li><Link href="/art" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>Art</Link></li>
              <li><Link href="/collectibles" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>Collectibles</Link></li>
              <li><Link href="/music" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>Music</Link></li>
            </ul>
          </div>*/}
          {/*<div>
            <h4 className="text-lg font-semibold mb-4">My Account</h4>
            <ul className="space-y-2">
              <li><Link href="/profile" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>Profile</Link></li>
              <li><Link href="/favorites" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>Favorites</Link></li>
              <li><Link href="/watchlist" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>Watchlist</Link></li>
              <li><Link href="/settings" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>Settings</Link></li>
            </ul>
          </div>*/}
          {/*<div>
            <h4 className="text-lg font-semibold mb-4">Stay Connected</h4>
            <div className="flex space-x-4">
              <Link href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}><Facebook /></Link>
              <Link href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}><Twitter /></Link>
              <Link href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}><Instagram /></Link>
              <Link href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}><Youtube /></Link>
            </div>
          </div>*/}
        </div>
        <div className={`mt-10 pt-8 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>&copy; 2025 Lens Agora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

