"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Rocket, Mail, User, Bell, ArrowRight, Check, AlertCircle, Search, X } from "lucide-react"
import { searchLensAccounts } from "../../../lib/lensProtocolUtils"
import { Account } from "@lens-protocol/client"
import { addWaitlist } from "../../../lib/db"
import { useAccount } from "wagmi"

export default function LaunchingSoonPage() {
    const connectAccount = useAccount();

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
  })

  // Username search state
  const [searchResults, setSearchResults] = useState<Account[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Account | null>(null)

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Form validation state
  const [errors, setErrors] = useState<{
    username?: string
    email?: string
  }>({})

  // Handle username search
  useEffect(() => {
    if (formData.username.length < 2) {
      setSearchResults([])
      return
    }

    // Simulate API call to search for users
    const timeoutId = setTimeout(async () => {
        setIsSearching(true);
        try {
          const results = await searchLensAccounts(formData.username);
          setSearchResults(results!);
        } catch (err) {
          console.error(err);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);

    return () => clearTimeout(timeoutId)
  }, [formData.username])

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear selected user when typing in username field
    if (name === "username") {
      setSelectedUser(null)
    }

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  // Handle user selection from search results
  const handleSelectUser = (account: Account) => {
    setFormData((prev) => ({
        ...prev,
        username: account.username?.localName || "",
        address: account.owner || ""
      }))
    setSelectedUser(account)
    setSearchResults([])
  }

  // Clear selected user
  const handleClearUser = () => {
    setFormData((prev) => ({ ...prev, username: "", address: "" }))
    setSelectedUser(null)
  }

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Form validation
  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.address && formData.address.toLowerCase() !== connectAccount?.address?.toLowerCase()) {
      newErrors.username = "The selected account does not match the connected wallet address";
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      try {
        // Simulate API call
        await addWaitlist(formData.username, formData.email, formData.address)

        // In a real app, you would send this data to your backend
        console.log("Form submitted:", { ...formData, isExistingUser: !!selectedUser })

        // Show success state
        setIsSubmitted(true)
      } catch (error) {
        console.error("Error submitting form:", error)
        setErrors((prev) => ({
          ...prev,
          email: "Something went wrong. Please try again.",
        }))
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F6FC] to-[#F0EFFA] flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Logo and Header */}
       {/* Hero Image */}
       <div className="relative mb-8">
          <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-lg"></div>
          <div className="relative z-10 border-4 border-black rounded-lg overflow-hidden">
            <div className="relative">
              <img
                src="/agora_hero.png"
                alt="Lens Agora Marketplace"
                className="aspect-[2/1] object-cover"
              />

              {/* Overlay with text */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#7F71D9]/80 to-transparent flex flex-col justify-center p-8">
                <h1 className="text-5xl md:text-6xl font-black mb-4 text-white drop-shadow-md">Lens Agora</h1>
                <p className="text-xl md:text-2xl font-bold text-white drop-shadow-md max-w-md">
                  The premier NFT marketplace launching soon
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative">
          <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-lg"></div>
          <div className="relative z-10 bg-white rounded-lg border-4 border-black p-8">
            {isSubmitted ? (
              /* Success Message */
              <div className="bg-gradient-to-br from-[#E0FAFA] to-white rounded-lg border-4 border-black p-6 text-center">
                <div className="bg-gradient-to-r from-[#8EF5F5] to-[#7EF2F2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
                  <Check className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black mb-2">The Agora Is Forming.</h3>
                <p className="text-gray-600 mb-4">
                You’re on the list. The Agora will call you soon.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false)
                    setFormData({ username: "", email: "" , address: ""})
                    setSelectedUser(null)
                  }}
                  className="bg-white text-black font-bold py-2 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
                >
                  Register Another
                </button>
              </div>
            ) : (
              /* Registration Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gradient-to-br from-[#F7B5DE] to-[#F29BD4] rounded-lg border-4 border-black p-6">
                  <h2 className="text-xl font-black mb-4 flex items-center">
                    <Bell className="mr-2 h-5 w-5" /> Get Notified
                  </h2>

                  {/* Username Lookup Field */}
                  <div className="mb-4">
                    <label htmlFor="username" className="block font-bold mb-2">
                      Find Your Lens Account
                    </label>
                    <div className="relative">
                      {selectedUser ? (
                        <div className="flex items-center justify-between bg-white p-3 border-2 border-black rounded-md">
                          <div className="flex items-center">
                            <div className="bg-[#D7D3F5] p-2 rounded-full border-2 border-black mr-3">
                              <User className="h-4 w-4" />
                            </div>
                            <span className="font-bold">{selectedUser.username?.localName}</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleClearUser}
                            className="p-1 rounded-md border-2 border-black bg-white hover:bg-gray-100"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Search for your username"
                            className="w-full p-3 pl-10 border-2 border-black rounded-md font-bold bg-white"
                            disabled={isSubmitting}
                            autoComplete="off"
                          />

                          {/* Search Results Dropdown */}
                          {(searchResults.length > 0 || isSearching) && (
                            <div className="absolute z-10 mt-1 w-full bg-white border-2 border-black rounded-md shadow-lg max-h-60 overflow-auto">
                              {isSearching ? (
                                <div className="p-3 text-center text-gray-600">
                                  <svg
                                    className="animate-spin h-5 w-5 mx-auto mb-1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Searching...
                                </div>
                              ) : searchResults.length > 0 ? (
                                <ul>
                                  {searchResults.map((account) => (
                                    <li
                                      key={account.username?.id}
                                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0 flex items-center"
                                      onClick={() => handleSelectUser(account)} 
                                    >
                                      <User className="h-4 w-4 mr-2 text-gray-500" />
                                      <span className="font-medium">{account.username?.localName}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    {errors.username && (
                      <div className="mt-1 flex items-center text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.username}
                      </div>
                    )}
                    <p className="mt-1 text-sm text-gray-600">
                      {selectedUser
                        ? "We'll notify you when Lens Agora launches."
                        : "Search for your existing username or enter a new one to reserve."}
                    </p>
                  </div>

                  
                  {/* Wallet Address Field */}
<div>
  <label htmlFor="address" className="block font-bold mb-2">
    Wallet Address
  </label>
  <div className="relative">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 12h14M12 5l7 7-7 7"
      />
    </svg>
    <input
      type="text"
      id="address"
      name="address"
      value={formData.address}
      onChange={handleInputChange}
      placeholder="0x..."
      className="w-full p-3 pl-10 border-2 border-black rounded-md font-bold bg-white"
      disabled={isSubmitting}
    />
  </div>
  <p className="mt-1 text-sm text-gray-600 mb-4"></p>
</div>

                  {/* Email Field  todo: o icon do email tá desalinhado */}
                  <div>
                    <label htmlFor="email" className="block font-bold mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className="w-full p-3 pl-10 border-2 border-black rounded-md font-bold bg-white"
                        disabled={isSubmitting}
                      />
                      <p className="mt-1 text-sm text-gray-600 mb-4">In case you're still into mailing. Don't worry, we won't flood.</p>
                    </div>
                    {errors.email && (
                      <div className="mt-1 flex items-center text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 ${
                    !isSubmitting && "hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  } active:translate-y-0 active:shadow-none flex items-center justify-center`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      SUBMITTING...
                    </>
                  ) : (
                    <>
                      JOIN WAITLIST <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Features Preview 
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="bg-[#F7B5DE] w-12 h-12 rounded-full flex items-center justify-center mb-4 border-2 border-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-black text-lg mb-2">Buy & Sell NFTs</h3>
            <p className="text-gray-600 text-sm">Trade unique digital assets on our secure marketplace.</p>
          </div>

          <div className="bg-white p-6 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="bg-[#D7D3F5] w-12 h-12 rounded-full flex items-center justify-center mb-4 border-2 border-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-black text-lg mb-2">Low Gas Fees</h3>
            <p className="text-gray-600 text-sm">Enjoy minimal transaction costs on our optimized platform.</p>
          </div>

          <div className="bg-white p-6 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="bg-[#8EF5F5] w-12 h-12 rounded-full flex items-center justify-center mb-4 border-2 border-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="font-black text-lg mb-2">Creator Community</h3>
            <p className="text-gray-600 text-sm">Connect with artists and collectors in our vibrant ecosystem.</p>
          </div>
        </div>
*/}
       
      </div>
    </div>
  )
}

