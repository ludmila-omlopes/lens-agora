import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const NFTMetadata = ({ nft, collection, ensProfile, marketplaceInfo }: any) => {
  // Extract price if NFT is listed
  const listedPrice = marketplaceInfo?.listing
    ? (Number(marketplaceInfo.listing.pricePerToken) / 10 ** 18).toFixed(2) + ' GRASS'
    : null;

  return (
    <div className="text-gray-800 dark:text-white">
      {/* Collection Name & Link */}
      <Link href={`/items/${collection.address}`} className="inline-flex items-center text-pink-400 hover:text-pink-300 mb-2">
        <span>{collection.name}</span>
        <ExternalLink className="ml-2 h-4 w-4" />
      </Link>

      {/* NFT Name */}
      <h1 className="text-4xl font-bold mb-4">{nft.metadata.name}</h1>

      {/* NFT Description */}
      <p className="mb-6">{nft.metadata.description}</p>

      {/* Artist Profile */}
      <div className="flex items-center mb-6">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage src={ensProfile?.avatar} alt={ensProfile?.name} />
          <AvatarFallback>O</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{ensProfile?.name}</p>
          <p className="text-sm text-gray-500">@{ensProfile?.name}</p>
        </div>
      </div>

      {/* NFT Price if Listed */}
      {listedPrice && (
        <div className="mb-6">
          <p className="text-gray-500 dark:text-gray-400">Current Price</p>
          <p className="font-semibold text-2xl">{listedPrice}</p>
        </div>
      )}
    </div>
  );
};
