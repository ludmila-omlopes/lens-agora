"use client";

import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { Account } from "@lens-protocol/client";
import { useEffect, useState } from "react";
import { listCreatedContractsByAddress } from "../../../lib/nfts";
import { Collection } from "../../../lib/types";

export default function CollectionsTab({ address }: { address: string }) {

    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        const fetchCollectors = async () => {
          setLoading(true);
          const collections = await listCreatedContractsByAddress(address);
          console.log("collections", collections);
          if (collections) setCollections(collections);
          setLoading(false);
        };
    
        fetchCollectors();
      }, [address]);
    
      if (loading) {
        return (
          <div className="text-center py-12 bg-white rounded-lg border-4 border-black">
            <div className="h-12 w-12 border-4 border-black border-t-[#7F71D9] rounded-full animate-spin mb-4 mx-auto"></div>
            <p className="font-bold">Loading Owned NFTs...</p>
          </div>
        );
      }
      
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black">Collections</h2>
        <Link href={"/items/addNew"} className="bg-white text-black font-bold py-2 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0 active:shadow-none">
          Create Collection
        </Link>
      </div>

      {collections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <GalleryCard
              key={collection.address}
              id={collection.address}
              name={collection.name}
              coverImage={collection.imageUrl}
              itemCount={collection.items?.length || 0}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border-4 border-black">
          <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">No Collections Yet</h3>
          <p className="text-gray-500 mb-6">Create your first collection to showcase your products.</p>
          <button className="bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white font-bold py-2 px-6 rounded-md border-2 border-black">
            Create Collection
          </button>
        </div>
      )}
    </div>
  );
}

// todo: modularizar ou substituir por algum card já existente
const GalleryCard = ({
    id,
    name,
    coverImage,
    itemCount,
  }: {
    id: string
    name: string
    coverImage: string
    itemCount: number
  }) => {
    return (
      <Link href={`/items/${id}`}>
        <div className="border-4 border-black rounded-lg overflow-hidden bg-white hover:-translate-y-1 transition-transform duration-200">
          <div className="relative aspect-video">
            <img src={coverImage || "/placeholder.png"} alt={name} className="object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2">
              <h3 className="font-bold truncate">{name}</h3>
              <p className="text-xs">{itemCount} items</p>
            </div>
          </div>
        </div>
      </Link>
    )
  }
