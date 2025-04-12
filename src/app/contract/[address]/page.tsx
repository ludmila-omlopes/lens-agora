import ContractDetails from "@/components/ContractDetails"
import { getCurrentCollection } from "../../../../lib/nfts";
import { notFound, redirect } from "next/navigation";

export default async function ContractDetailsPage({ params }: { params: { address: string } }) {
  if (process.env.NODE_ENV === "production") {
    return redirect("/"); 
  }
const collection = await getCurrentCollection({ contractAdd: params.address });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 dark:from-gray-900 dark:via-purple-900 dark:to-violet-800">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Contract Details</h1>
        <ContractDetails contract={collection} />
      </div>
    </div>
  )
}

