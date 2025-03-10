'use client';

import { useThirdwebWallet } from '@/hooks/useThirdwebWallet';
import { useAccount } from 'wagmi';
import { NFTImage } from '@/components/NFT/NFTImage';
import { NFTMetadata } from '@/components/NFT/NFTMetadata';
import { NFTBuyActions } from '@/components/NFT/NFTBuyActions';
import { NFTTransactionHistory } from '@/components/NFT/NFTTransactionHistory';
import { NFTBids } from '@/components/NFT/NFTBids';
import { NFTActionButtons } from '@/components/NFT/NFTActionButtons';
import SocialFeed from '@/components/SocialFeed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActiveAccount, useSocialProfiles } from 'thirdweb/react';
import { thirdwebClient } from '../../../../../lib/client/thirdwebClient';
import { marketplaceContractAddress } from '../../../../../lib/marketplacev3';
import { useEffect, useState } from 'react';
import { isNFTOwnedByAddress } from '../../../../../lib/nfts';

export default function NFTDetails({ nft, collection, marketplaceInfo }: any) {
  const [isOwner, setIsOwner] = useState(false);
  
  useThirdwebWallet();
  const account = useActiveAccount();

  useEffect(() => {
          const checkOwnership = async () => {
            if (account && account.address) {
              const userIsOwner = await isNFTOwnedByAddress(account.address, nft, collection.address);
              console.log("userIsOwner: ", userIsOwner)
              setIsOwner(userIsOwner);
            }
          };
          checkOwnership();
        }, [account, nft]);

  const { data: artistProfiles,  } = useSocialProfiles({
      client: thirdwebClient,
      address: collection.owner, 
    });

  const ensProfile = artistProfiles && artistProfiles.find(profile => profile.type === 'ens');

  return (
    <div className="bg-white bg-opacity-80 rounded-lg p-8 backdrop-blur-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Left Column - NFT Image & Actions */}
        <div className="col-span-1">
          <NFTImage imageUrl={nft.metadata.image} nftName={nft.metadata.name} />
          <NFTActionButtons
  contractAddress={marketplaceContractAddress}
  assetContract={collection.address}
  tokenId={nft.id} />

          {/* ✅ Tabs Below NFT Image */}
          <Tabs defaultValue="history" className="mt-6">
            <TabsList className="bg-white bg-opacity-20">
              <TabsTrigger value="history" className="text-gray-800 dark:text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">
                History
              </TabsTrigger>
              <TabsTrigger value="bids" className="text-gray-800 dark:text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">
                Bids
              </TabsTrigger>
            </TabsList>

            {/* History Content */}
            <TabsContent value="history">
              <NFTTransactionHistory history=
{ [
    { event: "Minted", from: "StellarArtist", to: "StellarArtist", price: "1.0 ETH", date: "2023-05-01" },
    { event: "Listed", from: "StellarArtist", to: null, price: "2.5 ETH", date: "2023-05-15" },
    { event: "Bid", from: "ArtEnthusiast", to: null, price: "2.7 ETH", date: "2023-05-20" },
  ]}  />
            </TabsContent>

            {/* Bids Content */}
            <TabsContent value="bids">
              <NFTBids bids={[]} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Middle Column - NFT Metadata & Buy Actions */}
        <div className="col-span-1">
          <NFTMetadata nft={nft} collection={collection} ensProfile={ensProfile} marketplaceInfo={marketplaceInfo} />
          <NFTBuyActions
            isOwner={isOwner} // Replace with actual ownership logic
            marketplaceInfo={marketplaceInfo}
            contractAddress={marketplaceContractAddress}
            assetContract={collection.address}
            tokenId={nft.id}
          />
        </div>

        {/* Right Column - Social Feed */}
        <div className="col-span-1">
          <SocialFeed />
        </div>

      </div>
    </div>
  );
}



