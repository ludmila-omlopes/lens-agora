'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import ListedNFTs from './ListedNFTs';
import NFTFilterCard from './NFTFilterCard';
import { Button } from '@/components/ui/button';
import { ListingWithProfile } from '../../lib/types';

export default function ExploreNFTs({ listings }: { listings: ListingWithProfile[] }) {
  const [nfts, setNfts] = useState(listings.slice(0, 20)); // Initialize with the first 20 listings
  const [filteredNFTs, setFilteredNFTs] = useState<ListingWithProfile[]>(listings);
  const [hasMore, setHasMore] = useState(listings.length > 20); // Determine if there are more NFTs to load
  const [filters, setFilters] = useState({
    priceRange: [0, 10],
    listingTypes: ["auction", "buy-now"],
  });

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasMore) {
      loadMore();
    }
  }, [inView]);

  useEffect(() => {
    setNfts(filteredNFTs.slice(0, 20));
    setHasMore(filteredNFTs.length > 20);
  }, [filteredNFTs]);

  const loadMore = () => {
    const currentLength = nfts.length;
    const nextBatch = filteredNFTs.slice(currentLength, currentLength + 20);
    if (nextBatch.length > 0) {
      setNfts((prevNFTs) => [...prevNFTs, ...nextBatch]);
    } else {
      setHasMore(false);
    }
  };

  const applyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);

    const filteredNFTs = listings.filter((nft) => {
      let inPriceRange = true;
      let isMatchingListingType = true;

      if ("pricePerToken" in nft) {
        const price = parseFloat((parseFloat(String(nft.pricePerToken) || "0") / 10 ** 18).toFixed(2) || "0");
        inPriceRange = price >= newFilters.priceRange[0] && price <= newFilters.priceRange[1];
      }

      if (newFilters.listingTypes) {
        if (!newFilters.listingTypes.includes("auction") && nft.type === "english-auction") {
          isMatchingListingType = false;
        }
        if (!newFilters.listingTypes.includes("buy-now") && nft.type === "direct-listing") {
          isMatchingListingType = false;
        }
      }

      return inPriceRange && isMatchingListingType;
    });

    setFilteredNFTs(filteredNFTs);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      <div className="xl:w-1/4">
        <NFTFilterCard onApplyFilters={applyFilters} />
      </div>
      <div className="xl:w-3/4 justify-center">
        <ListedNFTs nfts={nfts} />
        {hasMore && (
          <div ref={ref} className="flex justify-center mt-8">
            <Button onClick={loadMore} variant="outline">
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
