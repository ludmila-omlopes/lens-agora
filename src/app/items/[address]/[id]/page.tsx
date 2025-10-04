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

// Utility function to add timeout to promises
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    )
  ]);
}

const contractAddress1155 = "0xC0Fe17Fcd179d9192205b949d967f39d98645Ee7";
const contractAddress721 = "0x35d4AdfB8Bb4Bb16051D9e1b7784E8715F6f9ae5";


export default async function NFTDetailsPage({ params }: { params: { address: string, id: string } }) {
  if (process.env.NEXT_PUBLIC_LENSNETWORK_ENVIRONMENT === "main" && process.env.NODE_ENV !== "development") {
    return redirect("/"); 
  }

  try {
    // Parallel API calls to improve performance with timeouts
    const [nft, collection] = await Promise.all([
      withTimeout(getCurrentNFT({ contractAdd: params.address, tokenId: BigInt(params.id) }), 5000), // 5s timeout
      withTimeout(getCurrentCollection({ contractAdd: params.address }), 5000) // 5s timeout
    ]);

    if (!nft) {
      return <div>NFT not found</div>;
    }

    if (!collection) {
      return <div>Collection not found</div>;
    }

    // Fetch marketplace info with timeout (activity is optional and can be loaded client-side)
    const marketplaceResult = await Promise.allSettled([
      withTimeout(
        getNFTMarketplaceInfo(nft as NFT, params.address),
        5000 // 5s timeout for marketplace info
      )
    ]);

    // Handle marketplace info result
    const marketplace = marketplaceResult[0].status === 'fulfilled' ? marketplaceResult[0].value : null;
    
    // Activity will be loaded client-side to avoid timeout issues
    const activity: any[] = [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-gray-900 dark:via-purple-900 dark:to-violet-800">
        <div className="container mx-auto py-8">
          <NFTDetails 
            nft={nft} 
            collection={collection} 
            marketplaceInfo={marketplace || {} as MarketplaceInfo} 
            activityItems={activity} 
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading NFT details:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-gray-900 dark:via-purple-900 dark:to-violet-800">
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Error Loading NFT
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              There was an error loading this NFT. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

//        <RelatedNFTs />