import Link from "next/link"
import { fetchProfileData } from "../../../../lib/profileUtils"
import ProfileClient from "./ProfileClient"
import WalletClient from "./WalletClient"

// Main Profile Page Component
export default async function ProfilePage({ params }: { params: { username: string } }) {
  // Fetch profile data on the server
  const profileData = await fetchProfileData(params.username)

  // Loading state
  if (!profileData) {
    return (
      <div className="container mx-auto py-12 px-4 bg-gradient-to-b from-[#F7F6FC] to-[#F0EFPA] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-black border-t-[#7F71D9] rounded-full animate-spin mb-4"></div>
          <p className="font-bold">Loading profile...</p>
        </div>
      </div>
    )
  }

  // User not found
  if (!profileData.isWallet && !profileData.lensAccounts) {
    return (
      <div className="container mx-auto py-12 px-4 bg-gradient-to-b from-[#F7F6FC] to-[#F0EFPA] min-h-screen">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg border-4 border-black text-center">
          <h1 className="text-2xl font-black mb-4">User Not Found</h1>
          <p className="mb-6">The user you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/"
            className="bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white font-bold py-2 px-4 rounded-md border-2 border-black inline-block"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  // If it's a wallet address, show the wallet client
  if (profileData.isWallet) {
    return <WalletClient walletData={profileData} />
  }

  // Otherwise, show the profile client
  return (
    <ProfileClient
      userData={profileData.lensAccounts![0]}
      accountStats={profileData.accountStats![0]}
      isFollowing={profileData.isFollowing[0]}
      isWallet={profileData.isWallet}
      walletAddress={profileData.walletAddress}
    />
  )
}
