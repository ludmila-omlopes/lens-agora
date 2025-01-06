import CreateNFT from "./CreateNFT"

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 dark:from-gray-900 dark:via-purple-900 dark:to-violet-800">
      <main className="container mx-auto py-16 px-4">
        <h1 className="text-5xl font-bold text-white mb-12 text-center">Create Your NFT</h1>
        <CreateNFT />
      </main>
    </div>
  )
}

