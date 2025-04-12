import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Check, ArrowRight } from "lucide-react"
import { listCreatedContractsByAddress } from "../../../lib/nfts";
import { useAccount } from "wagmi";
import { Collection } from "../../../lib/types";

export function ExistingCollections({ goBack }: { goBack: () => void }) {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [existingCollections, setExistingCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      if (address) {
        setIsLoading(true);
        const collections = await listCreatedContractsByAddress(address);
        setExistingCollections(collections);
        setIsLoading(false);
      }
    };
    fetchCollections();
  }, [address]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={goBack} className="flex items-center font-bold mb-6 hover:underline">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to options
      </button>
      <h1 className="text-4xl font-black mb-8">Select Collection</h1>
      <div className="relative">
        <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-lg"></div>
        <div className="relative z-10 bg-gradient-to-br from-[#D7D3F5] to-[#CFC9F2] rounded-lg border-4 border-black p-6">
          <h2 className="text-xl font-black mb-6">Your Collections</h2>
          <div className="space-y-4">
          {!isLoading && existingCollections.length === 0 && (
  <div className="text-center text-gray-500 py-10 font-bold">
    No collections found.
  </div>
)}
            {isLoading ? (
    <div className="text-center text-gray-500 py-10 font-bold animate-pulse">
      Loading your collections...
    </div>
  ) : (
            existingCollections.map((collection) => (
              <div
                key={collection.address}
                className={`p-4 border-2 border-black rounded-md cursor-pointer transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0 active:shadow-none ${
                  selectedCollection === collection.address ? "bg-[#CFC9F2] border-black" : "bg-white"
                }`}
                onClick={() => setSelectedCollection(collection.address)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-md overflow-hidden relative border-2 border-black">
                      <img
                        src={collection.imageUrl || "/placeholder.svg"}
                        alt={collection.name}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-black text-lg">{collection.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold bg-[#D7D3F5] px-2 py-0.5 rounded border border-black">
                          {collection.symbol}
                        </span>
                        <span className="text-sm text-gray-600">{collection.totalItems} items</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center ${
                      selectedCollection === collection.address ? "bg-black" : "bg-white"
                    }`}
                  >
                    {selectedCollection === collection.address && <Check className="h-4 w-4 text-white" />}
                  </div>
                </div>
              </div>
            )))}
          </div>
          {selectedCollection && (
            <div className="mt-8">
              <Link
                href={`/items/${selectedCollection}/addNew`}
                className="w-full bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0 active:shadow-none flex items-center justify-center"
              >
                CONTINUE TO MINT <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Don't see your collection?{" "}
          <button onClick={goBack} className="font-bold text-[#7F71D9] hover:underline">
            Create a new one
          </button>
        </p>
      </div>
    </div>
  )
}
