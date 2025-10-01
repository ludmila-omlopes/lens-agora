import ContractDetails from "@/components/ContractDetails"
import { getCurrentCollection } from "../../../../lib/nfts";
import { notFound, redirect } from "next/navigation";

export default async function ContractDetailsPage({ params }: { params: { address: string } }) {
  if (process.env.NODE_ENV === "production") {
    return redirect("/"); 
  }


try {
  const collection = await getCurrentCollection({ contractAdd: params.address });
  if (!collection) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 dark:from-gray-900 dark:via-purple-900 dark:to-violet-800">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Contract Details</h1>
        <ContractDetails contract={collection} />
      </div>
    </div>
  )
} catch (error) {
  console.error("Error fetching collection:", error);
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 dark:from-gray-900 dark:via-purple-900 dark:to-violet-800">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Contract Not Found</h1>
        <p className="text-white text-lg mb-4">The contract you are looking for could not be found.</p>
        <p className="text-white text-lg">Please check the contract address and try again.</p>
      </div>
    </div>
  )
}

}