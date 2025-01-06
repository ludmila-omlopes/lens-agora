'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, Share2, Flag } from 'lucide-react'
import { NFT } from 'thirdweb'
import { resolveScheme } from 'thirdweb/storage'
import { thirdwebClient, thirdwebClientServer } from '../../../../../lib/client/thirdwebClient'
import Link from 'next/link'
import { createNewListing } from '../../../../../lib/marketplacev3'
import { CreateDirectListingButton, useActiveAccount, BuyDirectListingButton  } from 'thirdweb/react'
import { lensTestnetChain } from '../../../../../lib/lensNetwork'
import { DirectListing } from 'thirdweb/extensions/marketplace'
import { isNFTOwnedByAddress } from '../../../../../lib/nfts'
import { useEffect, useState } from 'react'
import { Collection } from '../../../../../lib/types'

export default function NFTDetailsClient({nft, collection, marketplaceInfo}: {nft: NFT, collection: Collection, marketplaceInfo: DirectListing}) { 

const [isOwner, setIsOwner] = useState(false);
  const imageurl = resolveScheme({uri: nft.metadata.image!, client: thirdwebClientServer});
const supply = nft.type === "ERC1155" ? nft.supply.toString() : "1";
const account = useActiveAccount();
const isListed = marketplaceInfo && marketplaceInfo.status === 'ACTIVE';

//todo: tratar se a media for um video
//todo: listar todos os listings se for um erc1155

useEffect(() => {
  const checkOwnership = async () => {
    if ( account && account.address ) {
      const userisOwner = await isNFTOwnedByAddress(account.address, nft, collection.address);
      setIsOwner(userisOwner);
    }
  };
  checkOwnership();
}, [account, nft]);

  return (
  <div className="min-h-screen bg-purple-100 text-purple-900 p-8 [&_*]:shadow-cartoon">
    <div className="max-w-4xl mx-auto bg-white rounded-xl border-4 border-pink-400 overflow-hidden">
    <div className="md:flex">
      <div className="md:flex-shrink-0">
      <img
        src={imageurl}
        alt={nft.metadata.name!}
        width={600}
        height={600}
        className="h-full w-full object-cover md:w-96"
      />
      </div>
      <div className="p-8">
      <div className="flex justify-between items-start">
        <div>
        <h1 className="text-3xl font-bold text-purple-600 mb-2">{nft.metadata.name!}</h1>
        <p className="text-purple-400 mb-4">From the <Link href={`/items/`+ collection.address} className="font-bold hover:text-purple-600 transition-colors">{collection.name}</Link>  collection</p>
        </div>
        <Badge variant="outline" className="text-green-500 border-green-500">#{ nft.id.toString() }</Badge>
      </div>
      
      <div className="flex items-center mb-4">
      {nft.type === "ERC1155" && (
        <div className="mr-4">
          <p className="text-sm text-purple-400">Supply</p>
          <p className="font-bold text-purple-600">{supply}</p>
        </div>
      )}
        <div>
        <p className="text-sm text-purple-400">Owned by</p>
        <p className="font-bold text-purple-600">{isOwner ? "you" : nft.owner}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xl font-bold text-green-500 mb-2">Current Price</p>
        <p className="text-3xl font-bold text-purple-600">
          {isListed ? `${marketplaceInfo.currencyValuePerToken.displayValue} ${marketplaceInfo.currencyValuePerToken.symbol}` : "Not for sale"}
        </p>
      </div>

      <div className="flex space-x-4 mb-6">
        {isOwner && !isListed && (
          <CreateDirectListingButton
        contractAddress="0x06A4d039c7450628d52F2D81f59DBD948E07DbdA" // contract address for the marketplace-v3
        chain={lensTestnetChain}
        client={thirdwebClient}
        tokenId={nft.id}
        assetContractAddress={collection.address} // The NFT contract address whose NFT(s) you want to sell
        pricePerToken={"0.1"} // sell for 0.1 <native token>
        onError={(err) => {
          alert(err.message);
          // Add your own logic here
        }}
          >
        List for Sale
          </CreateDirectListingButton>
        )}
        {!isOwner && isListed && (
          <BuyDirectListingButton
        contractAddress="0x06A4d039c7450628d52F2D81f59DBD948E07DbdA"
        chain={lensTestnetChain}
        client={thirdwebClient}
        listingId={marketplaceInfo.id} // the listingId or the item you want to buy
        quantity={1n} // optional - see the docs to learn more
          >
        Buy NFT
          </BuyDirectListingButton>
        )}
        <Button variant="outline" className="rounded-lg">
          <Heart className="mr-2 h-4 w-4" /> Favorite
        </Button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-purple-600 mb-2">Description</h2>
        <p className="text-purple-500">{nft.metadata.description!}</p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-purple-600 mb-2">Traits</h2>
        <div className="grid grid-cols-2 gap-4">
        {Array.isArray(nft.metadata.attributes) && nft.metadata.attributes.map((trait, index) => (
          <div key={index} className="bg-yellow-100 rounded-lg p-2 text-center">
          <p className="text-sm text-purple-400">{trait.trait_type}</p>
          <p className="font-bold text-purple-600">{trait.value}</p>
          </div>
        ))}
        </div>
      </div>
      </div>
    </div>
    </div>

    <div className="max-w-4xl mx-auto mt-8 flex justify-between items-center">
    <Button variant="ghost" className="text-purple-600 hover:text-purple-700">
      <Share2 className="mr-2 h-4 w-4" /> Share
    </Button>
    <Button variant="ghost" className="text-purple-600 hover:text-purple-700">
      <Flag className="mr-2 h-4 w-4" /> Report
    </Button>
    </div>
  </div>
  )
}
