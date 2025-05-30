import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getNFTMediaURL, listNFTsOwnedBy } from "../../../lib/nfts";
import { useEffect, useState } from "react";
import { NFTCollection } from "../../../lib/types";
import { useAccount } from "wagmi";

export default function CollectedNFTs() {
  const { address: userAddress, isConnected } = useAccount();
  const [collectedNFTs, setCollectedNFTs] = useState<NFTCollection[]>([]);
  const [isLoading, setIsLoading] = useState(false); // ✅ Loading state

  useEffect(() => {
    const fetchNFTs = async () => {
      if (isConnected && userAddress) {
        setIsLoading(true); // ✅ Start loading
        try {
          const nfts = await listNFTsOwnedBy(userAddress);
          setCollectedNFTs(nfts);
        } catch (error) {
          console.error("Error fetching NFTs:", error);
        } finally {
          setIsLoading(false); // ✅ Stop loading
        }
      }
    };
    fetchNFTs();
  }, [userAddress]);

  if (isLoading) {
    return <div>Loading collected NFTs...</div>; // ✅ Show loading message
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collectedNFTs.length === 0 ? (
        <p>No NFTs found.</p> // ✅ Show message if no NFTs are available
      ) : (
        collectedNFTs.map((nft) => (
          <Card key={nft.collectionAddress + nft.nft.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <img
                src={getNFTMediaURL(nft.nft)}
                alt={nft.nft.metadata.name!}
                width={400}
                height={400}
                className="w-full h-48 object-cover"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2">{nft.nft.metadata.name!}</CardTitle>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <Link
                href={`/items/${nft.collectionAddress}/${nft.nft.id}`}
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View Details
              </Link>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
