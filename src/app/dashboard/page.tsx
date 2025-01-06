import Dashboard from "@/components/Dashboard"
import { getProfiles } from "thirdweb/wallets";
import { thirdwebClient } from "../../../lib/client/thirdwebClient";

export default function DashboardPage() {

  //const deployedContracts = listDeployedContractsByAddress({ address: '0x1234...5678' })
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 dark:from-gray-900 dark:via-purple-900 dark:to-violet-800">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>
        <Dashboard />
      </div>
    </div>
  )
}

