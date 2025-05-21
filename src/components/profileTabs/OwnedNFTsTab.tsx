"use client";

import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLensSession } from "@/contexts/LensSessionContext";
import { Account } from "@lens-protocol/client";
import { NFT } from "thirdweb";
import { getNFTMediaURL, listNFTsOwnedBy } from "../../../lib/nfts";
import { NFTCollection } from "../../../lib/types";
import { formatAddress } from "../../../lib/profileUtils";

export default function OwnedNFTsTab({ address }: { address: string }) {

  const [ownedNFTs, setOwnedNFTs] = useState<NFTCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwned = async () => {
      setLoading(true);

      const owned = await listNFTsOwnedBy(address, true);
      if (owned) setOwnedNFTs(owned);

      setLoading(false);
    };

    fetchOwned();
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
      <h2 className="text-2xl font-black mb-6">Owned NFTs</h2>

      {ownedNFTs.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ownedNFTs.map((nft) => (
            <ProfileNFTCard
              key={nft.nft.tokenURI}
              collectionAddress={nft.collectionAddress}
              id={nft.nft.id.toString()}
              image={getNFTMediaURL(nft.nft) || "/placeholder.svg"}
              title={nft.nft.metadata.name || "Untitled"}
              //price={nft.price || undefined}
              creator={{ name: nft.creatorLensAccount?.username?.localName || formatAddress(nft.collection?.owner!) || "Unknown", 
                avatar: nft.creatorLensAccount?.metadata?.picture || "/placeholder.png" }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border-4 border-black">
          <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">No Owned NFTs</h3>
          <p className="text-gray-500 mb-6">Explore the marketplace to find NFTs you love.</p>
          <Link
            href="/marketplace"
            className="bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white font-bold py-2 px-6 rounded-md border-2 border-black"
          >
            Explore Marketplace
          </Link>
        </div>
      )}
    </div>
  );
}

const ProfileNFTCard = ({
  id,
  image,
  title,
  price,
  creator,
  collectionAddress
}: {
  id: string
  image: string
  title: string
  price?: string
  collectionAddress: string
  creator: { name: string; avatar: string }
}) => {
  return (
    <Link href={`/items/${collectionAddress}/${id}`} className="group">
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