"use client";

import Link from "next/link";
import { Palette } from "lucide-react";
import { Account } from "@lens-protocol/client";
import { useState } from "react";
import { NFT } from "thirdweb";

export const ProductsTab = ({ account }: { account: Account }) => {
  // Mock data for created NFTs
  const createdNFTs = [
    {
      id: "1",
      image: "https://picsum.photos/400/400",
      title: "Digital Art #1",
      price: "0.5 ETH",
      creator: {
        name: account.username?.localName || "Creator",
        avatar: account.metadata?.picture?.optimized?.uri || "/placeholder.svg"
      }
    },
    {
      id: "2",
      image: "https://picsum.photos/401/400",
      title: "Digital Art #2",
      price: "0.8 ETH",
      creator: {
        name: account.username?.localName || "Creator",
        avatar: account.metadata?.picture?.optimized?.uri || "/placeholder.svg"
      }
    },
    {
      id: "3",
      image: "https://picsum.photos/402/400",
      title: "Digital Art #3",
      price: "1.2 ETH",
      creator: {
        name: account.username?.localName || "Creator",
        avatar: account.metadata?.picture?.optimized?.uri || "/placeholder.svg"
      }
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black">Products</h2>
        <Link
          href="/mint-nft"
          className="bg-white text-black font-bold py-2 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0 active:shadow-none"
        >
          Create New Product
        </Link>
      </div>

      {createdNFTs.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {createdNFTs.map((nft) => (
            <ProfileNFTCard
              key={nft.id}
              id={nft.id}
              image={nft.image}
              title={nft.title}
              price={nft.price}
              creator={nft.creator}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border-4 border-black">
          <Palette className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">No Products Yet</h3>
          <p className="text-gray-500 mb-6">Start creating your first product to showcase your work.</p>
          <Link
            href="/mint-nft"
            className="bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white font-bold py-2 px-6 rounded-md border-2 border-black"
          >
            Create Product
          </Link>
        </div>
      )}
    </div>
  );
};

// NFT Card Component for profile page
const ProfileNFTCard = ({
    id,
    image,
    title,
    price,
    creator,
  }: {
    id: string
    image: string
    title: string
    price?: string
    creator: { name: string; avatar: string }
  }) => {
    return (
      <Link href={`/nft/${id}`}>
        <div className="border-4 border-black rounded-lg overflow-hidden bg-white hover:-translate-y-1 transition-transform duration-200">
          <div className="relative aspect-square">
            <img src={image || "/placeholder.svg"} alt={title} className="object-cover" />
          </div>
          <div className="p-3">
            <h3 className="font-bold truncate">{title}</h3>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full overflow-hidden relative border-2 border-black">
                  <img src={creator.avatar || "/placeholder.svg"} alt={creator.name} className="object-cover" />
                </div>
                <span className="text-xs font-bold truncate">{creator.name}</span>
              </div>
              {price && <span className="text-sm font-black">{price}</span>}
            </div>
          </div>
        </div>
      </Link>
    )
  }