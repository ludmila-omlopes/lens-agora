import { getCurrentNFT } from '../../../../../lib/nfts';
import NFTDetails from './NFTDetails';
import { redirect } from 'next/navigation';
import { withTimeout } from '@/lib/utils';
import { NFTProvider } from 'thirdweb/react';
import { Address, getContract } from 'thirdweb';
import { activeChain } from '../../../../../lib/lensNetwork';
import { thirdwebClientServer } from '../../../../../lib/client/thirdwebClient';

export const maxDuration = 30;

export default async function NFTDetailsPage({ params }: { params: { address: string, id: string } }) {
  if (process.env.NEXT_PUBLIC_LENSNETWORK_ENVIRONMENT === "main" && process.env.NODE_ENV !== "development") {
    return redirect("/"); 
  }

  try {
    // Only fetch NFT data on server-side for fastest loading
    const contract = getContract({
      client: thirdwebClientServer,
      chain: activeChain,
      address: params.address,
    });

    const nft = await withTimeout(
      getCurrentNFT({ contractAdd: params.address, tokenId: BigInt(params.id), existingContract: contract }), 
      20000 // 10s timeout
    );


    if (!nft) {
      return <div>NFT not found</div>;
    }

    // All other data (collection, marketplace, activity) will be loaded client-side
    const activity: any[] = [];

    return (
      <NFTProvider contract={contract} tokenId={nft.id}>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-gray-900 dark:via-purple-900 dark:to-violet-800">
        <div className="container mx-auto py-8">
          <NFTDetails 
            nft={nft} 
            collectionAddress={params.address}
            activityItems={activity} 
          />
        </div>
      </div>
      </NFTProvider>
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