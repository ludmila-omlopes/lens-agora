import React from "react"
import { Plus, Layers } from "lucide-react"

type MintOptionsProps = {
  setView: React.Dispatch<React.SetStateAction<"options" | "new-collection" | "existing-collection">>
}

export function MintOptions({ setView }: MintOptionsProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-black mb-8 text-center">Mint New NFTs</h1>
      <div className="grid md:grid-cols-2 gap-10">
        <MintOptionCard
          icon={<Plus className="h-12 w-12 text-[#F29BD4]" />}
          title="Create New Collection"
          description="Create a new NFT collection with its own contract and settings"
          buttonLabel="GET STARTED"
          gradient="from-[#F7B5DE] to-[#F29BD4]"
          onClick={() => setView("new-collection")}
        />
        <MintOptionCard
          icon={<Layers className="h-12 w-12 text-[#7F71D9]" />}
          title="Mint to Existing Collection"
          description="Add new NFTs to one of your existing collections"
          buttonLabel="SELECT COLLECTION"
          gradient="from-[#D7D3F5] to-[#CFC9F2]"
          onClick={() => setView("existing-collection")}
        />
      </div>
    </div>
  )
}

type MintOptionCardProps = {
  icon: React.ReactNode
  title: string
  description: string
  buttonLabel: string
  onClick: () => void
  gradient: string
}

function MintOptionCard({
  icon,
  title,
  description,
  buttonLabel,
  onClick,
  gradient,
}: MintOptionCardProps) {
  return (
    <div className="relative">
      <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-lg"></div>
      <div
        className={`relative z-10 bg-gradient-to-br ${gradient} rounded-lg border-4 border-black p-6 h-full cursor-pointer transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0 active:shadow-none`}
        onClick={onClick}
      >
        <div className="flex flex-col items-center justify-center text-center h-full py-10">
          <div className="bg-white p-4 rounded-full border-4 border-black mb-6">{icon}</div>
          <h2 className="text-2xl font-black mb-4">{title}</h2>
          <p className="mb-6">{description}</p>
          <button className="bg-white text-black font-bold py-2 px-6 rounded-md border-2 border-black transition-colors duration-200 hover:bg-opacity-90">
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
