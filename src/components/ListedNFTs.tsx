import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getNFTMediaURL } from '../../lib/nfts';
import { ListingWithProfile } from '../../lib/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ListedNFTs({ nfts }: { nfts: ListingWithProfile[] }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map((nft) => {
        const isAuction = nft.type === 'english-auction';
        const isLiveAuction =
          isAuction &&
          Number(nft.startTimeInSeconds) * 1000 < Date.now() &&
          Number(nft.endTimeInSeconds) * 1000 > Date.now();

        return (
          <Card
            key={nft.id.toString()}
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() =>
              router.push(`/items/${nft.assetContractAddress}/${nft.tokenId}`)
            }
          >
            {/* NFT Image */}
            <CardHeader className="p-0 relative">
              <img
                src={getNFTMediaURL(nft.asset) || '/placeholder.svg'}
                alt={nft.asset?.metadata.name || 'NFT'}
                width={300}
                height={300}
                className="w-full h-64 object-cover"
              />
              {/* 🔴 Live Auction Indicator */}
              {isLiveAuction && (
                <div className="absolute top-2 left-2 flex items-center space-x-2">
                  <span className="h-3 w-3 bg-red-500 rounded-full animate-ping" />
                  <span className="text-red-500 font-bold text-sm">Live Auction</span>
                </div>
              )}
            </CardHeader>

            {/* NFT Details */}
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2">{nft.asset?.metadata.name || 'Unnamed NFT'}</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                by {nft.creatorProfile || 'Unknown Creator'}
              </p>
            </CardContent>

            {/* Pricing Info */}
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              {isAuction ? (
                // 🟢 Auction Layout
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Min Bid</span>
                  <span className="font-bold">
                    {parseFloat(nft.minimumBidCurrencyValue.displayValue).toFixed(2)}{' '}
                    {nft.minimumBidCurrencyValue.symbol}
                  </span>
                  {nft.buyoutBidAmount > 0n && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Buyout: {parseFloat(nft.buyoutCurrencyValue.displayValue).toFixed(2)}{' '}
                      {nft.buyoutCurrencyValue.symbol}
                    </span>
                  )}
                </div>
              ) : (
                // 🟢 Direct Listing Layout
                <span className="font-bold">
                  {(Number(nft.pricePerToken) / 10 ** 18).toFixed(2)} GRASS
                </span>
              )}
            </CardFooter>

            {/* Action Button */}
            <div className="p-4 pt-0">
              <Button
                onClick={(e) => {
                  e.stopPropagation(); // Prevents clicking on the card from triggering navigation
                  router.push(`/items/${nft.assetContractAddress}/${nft.tokenId}`);
                }}
                className={`w-full ${
                  isAuction ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
                } text-white font-semibold`}
              >
                {isAuction ? 'Bid Now' : 'Buy Now'}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
