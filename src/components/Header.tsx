"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Wallet, Menu, X } from "lucide-react"
import { ConnectKitButton } from "connectkit"
import { RetroButton } from "./customUI/RetroButton"
import { useTheme } from "@/app/contexts/ThemeContext"
import { useAccount } from "wagmi"
import { useLensSession } from "@/contexts/LensSessionContext"
import ProfileSelectDialog from "../../components/ProfileSelectDialog"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const { theme, toggleTheme } = useTheme()
  const { address, isConnecting, isDisconnected, isConnected: isWalletConnected } = useAccount();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<any>(null);

  const { sessionClient, session, loading, logout, login } = useLensSession();


  const pathname = usePathname()

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Create", href: "/create" },
    { name: "Explore", href: "/explore" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "New Account", href: "/newAccount" },
  ]

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle wallet connection
  const connectWallet = () => {
    // Simulate wallet connection
    setTimeout(() => {
      const mockAddress = "0x" + Math.random().toString(16).slice(2, 12) + "..."
      setWalletAddress(mockAddress)
      setWalletConnected(true)
    }, 1000)
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletConnected(false)
    setWalletAddress("")
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log("Searching for:", searchQuery)
    // In a real app, you would redirect to search results page
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white border-b-2 border-black shadow-md py-2"
          : "bg-gradient-to-r from-[#F7F6FC] to-[#F0EFFA] py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-10 mr-2">
              <Image src="/logo1.png" alt="Lens Agora Logo" fill className="object-contain" />
            </div>
            <span className="font-black text-xl hidden sm:block">Lens Agora</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-md font-bold transition-colors ${
                  pathname === link.href
                    ? "bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search, Wallet, and Lens - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-md border-2 border-black bg-white w-40 lg:w-60 focus:outline-none focus:ring-2 focus:ring-[#7F71D9]"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            </form>

            {/* Wallet Button */}
            {<ConnectKitButton />}
            {/*walletConnected ? (
              <button
                onClick={disconnectWallet}
                className="flex items-center bg-gradient-to-br from-[#8EF5F5] to-[#7EF2F2] text-black font-bold py-2 px-3 rounded-md border-2 border-black hover:-translate-y-1 transition-transform duration-200"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {walletAddress}
              </button>
            ) : (
              <button
                onClick={connectWallet}
                className="flex items-center bg-white text-black font-bold py-2 px-3 rounded-md border-2 border-black hover:-translate-y-1 transition-transform duration-200"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect
              </button>
            )}*/}

            {/* Lens Button */}
            {
          (isWalletConnected && address && ! loading && !session) ? (
              <>
              <ProfileSelectDialog accountAddress={address} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
              </>
            ) : (session && !loading) ? (
              <RetroButton onClick={logout}>
              Log Out
            </RetroButton>) : <></>
            }

            <a
              href="https://lenster.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-10 w-10 bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white font-bold rounded-md border-2 border-black hover:-translate-y-1 transition-transform duration-200"
            >
              <span className="text-lg">L</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md border-2 border-black bg-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-md font-bold ${
                    pathname === link.href
                      ? "bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white"
                      : "bg-white border-2 border-black"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mt-4">
              <input
                type="text"
                placeholder="Search NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-md border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#7F71D9]"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            </form>

            {/* Mobile Wallet and Lens */}
            <div className="flex items-center space-x-3 mt-4">
              {/* Wallet Button */}
              {walletConnected ? (
                <button
                  onClick={disconnectWallet}
                  className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#8EF5F5] to-[#7EF2F2] text-black font-bold py-2 px-3 rounded-md border-2 border-black"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  {walletAddress}
                </button>
              ) : (
                <button
                  onClick={connectWallet}
                  className="flex-1 flex items-center justify-center bg-white text-black font-bold py-2 px-3 rounded-md border-2 border-black"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </button>
              )}

              {/* Lens Button */}
              <a
                href="https://lenster.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-10 w-10 bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white font-bold rounded-md border-2 border-black"
              >
                <span className="text-lg">L</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
