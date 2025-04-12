import Dashboard from "@/components/Dashboard"
import { getProfiles } from "thirdweb/wallets";
import { thirdwebClient } from "../../../lib/client/thirdwebClient";
import { notFound, redirect } from "next/navigation";

export default function DashboardPage() {
  if (process.env.NODE_ENV === "production") {
    return redirect("/"); 
  }
  //const deployedContracts = listDeployedContractsByAddress({ address: '0x1234...5678' })
    
  return (
    <div className={`min-h-screen ${'bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100'} transition-colors duration-300`}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <Dashboard />
      </div>
    </div>
  )
}

