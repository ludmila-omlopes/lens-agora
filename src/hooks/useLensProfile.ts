"use client"

import { useState, useEffect } from "react"
import { getProfileByAddress } from "../../lib/profileUtils"
import { Profile } from "../../lib/types"

interface UseLensProfileProps {
  address: string | null | undefined
  enabled?: boolean
}

interface UseLensProfileReturn {
  profile: Profile | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useLensProfile({ 
  address, 
  enabled = true 
}: UseLensProfileProps): UseLensProfileReturn {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    if (!address || !enabled) {
      setProfile(null)
      setError(null)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const result = await getProfileByAddress(address)
      
      if (result) {
        // Handle both single profile and array of profiles
        if (Array.isArray(result)) {
          setProfile(result[0] || null)
        } else {
          setProfile(result)
        }
      } else {
        setProfile(null)
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch profile")
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [address, enabled])

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile
  }
}

// Convenience hook for single address
export function useLensProfileByAddress(address: string | null | undefined) {
  return useLensProfile({ address })
}

// Hook for multiple addresses - optimized to fetch all at once
export function useLensProfiles(addresses: (string | null | undefined)[]) {
  const [profiles, setProfiles] = useState<Record<string, Profile | null>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfiles = async () => {
    const validAddresses = addresses.filter((addr): addr is string => Boolean(addr))
    
    if (validAddresses.length === 0) {
      setProfiles({})
      setError(null)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const result = await getProfileByAddress(validAddresses)
      
      if (result) {
        // Handle both single profile and array of profiles
        const profilesArray = Array.isArray(result) ? result : [result]
        const profilesMap: Record<string, Profile | null> = {}
        
        validAddresses.forEach((address, index) => {
          profilesMap[address] = profilesArray[index] || null
        })
        
        setProfiles(profilesMap)
      } else {
        setProfiles({})
      }
    } catch (err) {
      console.error("Failed to fetch profiles:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch profiles")
      setProfiles({})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [addresses.join(',')]) // Re-fetch when addresses change

  return {
    profiles,
    loading,
    error,
    refetch: fetchProfiles,
    getProfile: (address: string) => profiles[address] || null
  }
}
