import { Metadata } from 'next'
import GroupsComingSoon from '@/components/GroupsComingSoon'

export const metadata: Metadata = {
  title: 'Groups - Coming Soon | NFT Marketplace',
  description: 'Join exclusive NFT collector groups and participate in collective buying opportunities. Coming soon to our NFT marketplace.',
}

export default function GroupsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 dark:from-gray-900 dark:via-purple-900 dark:to-violet-800">
      <div className="container mx-auto py-16 px-4">
        <GroupsComingSoon />
      </div>
    </div>
  )
}

