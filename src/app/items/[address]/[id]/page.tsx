import { resolveScheme } from 'thirdweb/storage';
import { getCurrentCollection, getCurrentNFT, isNFTOwnedByAddress } from '../../../../../lib/nfts';
import NFTDetailsClient from './itemClient'
import { thirdwebClientServer } from '../../../../../lib/client/thirdwebClient';
import { getNFTMarketplaceInfo } from '../../../../../lib/marketplacev3';
import { MarketplaceInfo } from '../../../../../lib/types';
import { createWallet } from "thirdweb/wallets";

const contractAddress1155 = "0xC0Fe17Fcd179d9192205b949d967f39d98645Ee7";
const contractAddress721 = "0x35d4AdfB8Bb4Bb16051D9e1b7784E8715F6f9ae5";


export default async function NFTDetailsPage({ params }: { params: { address: string, id: string } }) {
  
 const nft = await getCurrentNFT({ contractAdd: params.address, tokenId: BigInt(params.id) });
 if (!nft) {
   return <div>NFT not found</div>;
 }
 
 const collection = await getCurrentCollection({ contractAdd: params.address });

 const marketplaceInfo = nft && await getNFTMarketplaceInfo(nft, params.address);

  return ( <NFTDetailsClient nft={nft} collection={collection} marketplaceInfo={marketplaceInfo!}/> );
}

