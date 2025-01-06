import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { getAllListingsByAddress } from "../../../lib/marketplacev3";
import { useActiveAccount } from "thirdweb/react";
import { DirectListing } from "thirdweb/extensions/marketplace";
import { getNFTMediaURL } from "../../../lib/nfts";

export default function ListedNFTs() {
  const account = useActiveAccount();
  const [listedNFTs, setListedNFTs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListedNFTs = async () => {
      if (account) {
        try {
          const address = account.address;
          const listings = await getAllListingsByAddress(address!);
          const nfts = listings.map((listing: DirectListing) => ({
            id: listing.id,
            name: listing.asset.metadata.name,
            image: getNFTMediaURL(listing.asset),
            collection: listing.assetContractAddress,
            price: listing.pricePerToken,
            endTime: listing.endTimeInSeconds,
          }));
          setListedNFTs(nfts);
        } catch (error) {
          console.error("Error fetching listed NFTs:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchListedNFTs();
  }, [account]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!account) {
    return <p>Please connect your account to view listed NFTs.</p>;
  }

  if (listedNFTs.length === 0) {
    return <p>No listed NFTs found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listedNFTs.map((nft) => (
        <Card key={nft.id} className="overflow-hidden">
          <CardHeader className="p-0">
            <img src={nft.image} alt={nft.name} width={400} height={400} className="w-full h-48 object-cover" />
          </CardHeader>
          <CardContent className="p-4">
  <CardTitle className="text-lg mb-2">{nft.name}</CardTitle>
  <p className="text-sm text-gray-500 dark:text-gray-400">{nft.collection}</p>
  <p className="text-sm mt-2">Listed for: <span className="font-bold">{nft.price}</span></p>
  <p className="text-sm">Ends on: {new Date(Number(nft.endTime) * 1000).toLocaleDateString()}</p>
</CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <Button variant="outline" size="sm">Cancel Listing</Button>
            <Link href={`/nft/${nft.id}`} className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
              View Details
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
