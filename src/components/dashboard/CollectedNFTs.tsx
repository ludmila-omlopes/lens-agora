import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'
import Link from 'next/link'
import { getNFTMediaURL, listNFTsOwnedBy } from "../../../lib/nfts"
import { useActiveAccount } from "thirdweb/react"
import { useEffect, useState } from 'react'
import { NFT } from "thirdweb"
import { NFTCollection } from "../../../lib/types"


export default function CollectedNFTs() {
  const account = useActiveAccount();
  const [collectedNFTs, setCollectedNFTs] = useState<NFTCollection[]>([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (account) {
        const nfts = await listNFTsOwnedBy(account.address);
        setCollectedNFTs(nfts);
      }
    };
    fetchNFTs();
  }, [account]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collectedNFTs && collectedNFTs.map((nft) => (
        <Card key={nft.collectionAddress+nft.nft.id} className="overflow-hidden">
          <CardHeader className="p-0">
            <img src={getNFTMediaURL(nft.nft)} alt={nft.nft.metadata.name!} width={400} height={400} className="w-full h-48 object-cover" />
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-lg mb-2">{nft.nft.metadata.name!}</CardTitle>
            {/*<p className="text-sm text-gray-500 dark:text-gray-400">{nft.collection}</p>*/}
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <Link href={`/items/${nft.collectionAddress}/${nft.nft.id}`} className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
              View Details
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

