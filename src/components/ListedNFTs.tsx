import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getNFTMediaURL } from '../../lib/nfts';

export default function ListedNFTs({ nfts }: { nfts: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map((nft) => (
        <Card key={nft.id} className="overflow-hidden">
          <CardHeader className="p-0">
            <img
              src={getNFTMediaURL(nft.asset) || '/placeholder.svg'}
              alt={nft.asset?.name || 'NFT'}
              width={300}
              height={300}
              className="w-full h-64 object-cover"
            />
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-lg mb-2">{nft.asset?.metadata.name || 'Unnamed NFT'}</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              by {nft.creatorProfile || 'Unknown Creator'}
            </p>
            {/* <p className="text-sm text-gray-500 dark:text-gray-400">
              {nft.collection || 'No Collection'}
            </p>*/}
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <span className="font-bold">
              {(parseFloat(nft.pricePerToken || '0') / 10 ** 18).toFixed(2)} GRASS
            </span>
            <Link
              href={`/items/${nft.assetContractAddress}/${nft.tokenId}`}
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View Details
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
