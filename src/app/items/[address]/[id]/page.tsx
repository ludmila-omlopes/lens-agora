import { resolveScheme } from 'thirdweb/storage';
import { getCurrentCollection, getCurrentNFT, isNFTOwnedByAddress } from '../../../../../lib/nfts';
import { thirdwebClient, thirdwebClientServer } from '../../../../../lib/client/thirdwebClient';
import { fetchNftActivity, getNFTMarketplaceInfo } from '../../../../../lib/marketplacev3';
import { MarketplaceInfo } from '../../../../../lib/types';
import { createWallet } from "thirdweb/wallets";
import NFTDetails from './NFTDetails';
import { notFound, redirect } from 'next/navigation';
import { Address, NFT } from 'thirdweb';
import { ethProvider } from '../../../../../utils/providers';
import { publicClient } from '../../../../../lib/client/publicClient';

const contractAddress1155 = "0xC0Fe17Fcd179d9192205b949d967f39d98645Ee7";
const contractAddress721 = "0x35d4AdfB8Bb4Bb16051D9e1b7784E8715F6f9ae5";


export default async function NFTDetailsPage({ params }: { params: { address: string, id: string } }) {
  if (process.env.NODE_ENV === "production") {
    return redirect("/"); 
  }
 const nft = await getCurrentNFT({ contractAdd: params.address, tokenId: BigInt(params.id) });
 console.log("nft: ", nft);
 //avisar o thirdweb que owner tá vindo nulo
 if (!nft) {
   return <div>NFT not found</div>;
 }

const activityItems = await fetchNftActivity(
  { assetContract: params.address as Address, tokenId: BigInt(params.id) },
  { fromBlock: 0n } // or a recent start block
);

 
 const collection = await getCurrentCollection({ contractAdd: params.address });

 const marketplaceInfo = nft && await getNFTMarketplaceInfo(nft as NFT, params.address);
 //console.log("marketplaceInfo: ", marketplaceInfo);
 //const marketplaceInfo = {} as MarketplaceInfo;


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-gray-900 dark:via-purple-900 dark:to-violet-800">
      <div className="container mx-auto py-8">
        <NFTDetails nft={nft} collection={collection!} marketplaceInfo={marketplaceInfo!} activityItems={activityItems} />
      </div>
    </div>
  )
}

//        <RelatedNFTs />