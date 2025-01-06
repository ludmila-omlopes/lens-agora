import Image from 'next/image'
import Link from 'next/link'
import { NFT } from 'thirdweb'
import { getNFTMediaURL } from '../lib/nfts'

interface NFTCardProps {
  nft: {
    id: string
    name: string
    image: string
    price: string
  }
}

export default function NFTCard({ nft, collectionAddress }: {nft: NFT, collectionAddress: string}) {
  return (
    <Link href={`/items/${collectionAddress}/${nft.id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden border-4 border-pink-400 transition-transform hover:scale-105">
        <div className="relative h-48">
          <img
            src={getNFTMediaURL(nft)}
            alt={nft.metadata.name!}
            //fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-purple-600 mb-2">{nft.metadata.name!}</h3>
          <p className="text-green-500 font-bold">{"nft.price"}</p>
        </div>
      </div>
    </Link>
  )
}

