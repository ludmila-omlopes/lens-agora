import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'
import Link from 'next/link'
import { listNFTs } from '../../../lib/nfts'
import { NFT } from 'thirdweb'
import { resolveScheme } from 'thirdweb/storage'
import { thirdwebClient } from '../../../lib/client/thirdwebClient'

export default function MintedNFTs({ contractAddress }: { contractAddress: string }) {
  const [mintedNFTs, setMintedNFTs] = useState<NFT[]>()

  useEffect(() => {
    // Fetch minted NFTs based on contractId
    const fetchMintedNFTs = async () => {
      try {
        const nfts = await listNFTs({contractAdd: contractAddress, start: 0, count: 10})
        setMintedNFTs(nfts!)
      } catch (error) {
        console.error('Error fetching minted NFTs:', error)
      }
    }

    fetchMintedNFTs()
  }, [contractAddress])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mintedNFTs && mintedNFTs.map((nft) => (
        <Card key={nft.id} className="overflow-hidden">
          <CardHeader className="p-0">
            <img src={resolveScheme( {uri: nft.metadata.image!, client: thirdwebClient })} alt={nft.metadata.name!} width={400} height={400} className="w-full h-48 object-cover" />
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-lg mb-2">{nft.metadata.name!}</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">Owner: {nft.owner}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Link href={`/nft/${nft.id}`} className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
              View Details
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

