'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/app/contexts/ThemeContext'
import { ConnectButton, useActiveAccount } from 'thirdweb/react'
import { thirdwebClient } from '../../lib/client/thirdwebClient'
import { ConnectKitButton } from 'connectkit'
import { getCurrentSession, login } from '../../lib/lensProtocolUtils'
import ProfileSelectDialog from '../../components/ProfileSelectDialog'
import { useEffect, useState } from 'react'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const account = useActiveAccount();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<any>(null);

  useEffect(() => {
    const manageSession = async () => {
      const _currentSession = getCurrentSession();
      setCurrentSession(_currentSession);
    }
    manageSession();
  }
  , [account]);


  const handleLogin = () => {
      login(account);
    };

  return (
    <header className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white py-4 transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1 items-center justify-between">
          <Link href="/">
            <img src="/logo1.png" alt="Lens Agora Logo" className="h-12" />
          </Link>
          <Link href="/" className="text-2xl font-bold space-x-2">Lens Agora</Link>
        </div>
         <nav className="hidden md:flex space-x-4">
            <Link href="/explore" className="hover:text-pink-400 transition-colors">Explore</Link>
            <Link href="/create" className="hover:text-pink-400 transition-colors">Create</Link>
            <Link href="/dashboard" className="hover:text-pink-400 transition-colors">Dashboard</Link>
          </nav>
          </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input 
              type="search" 
              placeholder="Search NFTs" 
              className="pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 transition-all duration-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
         
          {   /*todo: embeleza o botao do thirdweb */ }  
          {(account && !currentSession) ? (
              <>
              <Button onClick={handleLogin} className="bg-pink-500 hover:bg-pink-600 text-white">Lens Login</Button>
                <ProfileSelectDialog account={account} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
              </>
            ) : (currentSession) ? (
             <p>Logged</p>) : <></>}
             
           <ConnectButton client={thirdwebClient} /> 
           {/*<ConnectKitButton />*/}
          {/* <Button variant="ghost" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          */}
        </div>
      </div>
    </header>
  )
}

