"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { RetroButton } from "@/components/customUI/RetroButton"
import ProfileSelectDialog from "../../components/ProfileSelectDialog"
import { useLensSession } from "@/contexts/LensSessionContext"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import type { Account } from "@lens-protocol/client"
import Link from "next/link"
import { User, LogOut } from "lucide-react"

export default function LoginLogoutButton() {
  const { address, isConnected } = useAccount()
  const { session, loading, logout, getLoggedAccount } = useLensSession()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loggedAccount, setLoggedAccount] = useState<Account | null>(null)

  useEffect(() => {
    let isMounted = true
    const fetch = async () => {
      if (session && !loading) {
        const acc = await getLoggedAccount()
        if (isMounted) {
          setLoggedAccount(acc)
        }
      } else if (!session) {
        if (isMounted) {
          setLoggedAccount(null)
        }
      }
    }
    fetch()
    return () => { isMounted = false }
  }, [session, loading, getLoggedAccount])

  // Reset logged account immediately when session changes
  useEffect(() => {
    if (!session) {
      setLoggedAccount(null)
    }
  }, [session])

  // If there is an active Lens session, show user dropdown menu
  if (session && !loading) {
    const handle = loggedAccount?.username?.localName || "Account"
    const avatarUrl = loggedAccount?.metadata?.picture || "/avatar.png"
    const name = loggedAccount?.metadata?.name || handle
    const fallback = name?.charAt(0)?.toUpperCase() || "A"
    
    const handleLogout = async () => {
      await logout()
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 bg-white text-black font-bold py-2 px-3 rounded-md border-2 border-black hover:-translate-y-1 transition-transform duration-200">
            <Avatar className="h-6 w-6 border-2 border-black">
              <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
              <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
            <span className="hidden lg:inline">{handle}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 border-2 border-black">
          <DropdownMenuItem asChild>
            <Link href={`/profile/${loggedAccount?.address}`} className="flex items-center cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span className="font-bold">Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-black" />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span className="font-bold">Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Otherwise, allow login via profile selection when wallet is connected
  if (isConnected && address) {
    return (
      <ProfileSelectDialog
        accountAddress={address}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    )
  }

  return null
}


