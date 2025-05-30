import { resolveScheme } from 'thirdweb/storage';
import { getCurrentCollection, getCurrentNFT, isNFTOwnedByAddress } from '../../../../../lib/nfts';
import { thirdwebClientServer } from '../../../../../lib/client/thirdwebClient';
import { getNFTMarketplaceInfo } from '../../../../../lib/marketplacev3';
import { MarketplaceInfo } from '../../../../../lib/types';
import { createWallet } from "thirdweb/wallets";
import NFTDetails from './NFTDetails';
import { notFound, redirect } from 'next/navigation';

const contractAddress1155 = "0xC0Fe17Fcd179d9192205b949d967f39d98645Ee7";
const contractAddress721 = "0x35d4AdfB8Bb4Bb16051D9e1b7784E8715F6f9ae5";


export default async function NFTDetailsPage({ params }: { params: { address: string, id: string } }) {
  if (process.env.NODE_ENV === "production") {
    return redirect("/"); 
  }
 const nft = await getCurrentNFT({ contractAdd: params.address, tokenId: BigInt(params.id) });
 //avisar o thirdweb que owner tá vindo nulo
 if (!nft) {
   return <div>NFT not found</div>;
 }
 
 const collection = await getCurrentCollection({ contractAdd: params.address });
 const marketplaceInfo = nft && await getNFTMarketplaceInfo(nft, params.address);
 console.log("marketplaceInfo: ", marketplaceInfo);

  //return ( <NFTDetailsClient nft={nft} collection={collection} marketplaceInfo={marketplaceInfo!}/> );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-gray-900 dark:via-purple-900 dark:to-violet-800">
      <div className="container mx-auto py-8">
        {/*<NFTDetails2 nft={nft} collection={collection} marketplaceInfo={marketplaceInfo!} />*/}
        <NFTDetails nft={nft} marketplaceInfo={marketplaceInfo!} />
      </div>
    </div>
  )
}

//        <RelatedNFTs />