
import CreateNFT from "./CreateNFT"

export default function CreatePage() {

  return (
    <div className={`min-h-screen ${'bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100'} transition-colors duration-300`}>
      <main className="container mx-auto py-16 px-4">
        <h1 className="text-5xl font-bold mb-12 text-center">Create Your NFT</h1>
        <CreateNFT />
      </main>
    </div>
  )
}

