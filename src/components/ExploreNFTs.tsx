'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import ListedNFTs from './ListedNFTs';
import Filters from './Filters';
import { Button } from '@/components/ui/button';
import { ListingWithProfile } from '../../lib/types';

export default function ExploreNFTs({ listings }: { listings: ListingWithProfile[] }) {
  const [nfts, setNfts] = useState(listings.slice(0, 20)); // Initialize with the first 20 listings
  const [hasMore, setHasMore] = useState(listings.length > 20); // Determine if there are more NFTs to load
  const [filters, setFilters] = useState({
    priceRange: [0, 10],
    collections: [],
    creators: []
  });

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasMore) {
      loadMore();
    }
  }, [inView]);

  const loadMore = () => {
    const currentLength = nfts.length;
    const nextBatch = listings.slice(currentLength, currentLength + 20);
    if (nextBatch.length > 0) {
      setNfts([...nfts, ...nextBatch]);
    } else {
      setHasMore(false);
    }
  };

  const applyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    const filteredNFTs = listings.filter((nft) => {
      if ('pricePerToken' in nft) {
        const price = parseFloat((parseFloat(String(nft.pricePerToken) || '0') / 10 ** 18).toFixed(2) || '0');
        const inPriceRange =
          price >= newFilters.priceRange[0] && price <= newFilters.priceRange[1];
        return inPriceRange;
      }
      return false; // or handle auctions differently if needed
    });
    setNfts(filteredNFTs.slice(0, 20));
    setHasMore(filteredNFTs.length > 20);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/4">
        <Filters onApplyFilters={applyFilters} />
      </div>
      <div className="md:w-3/4">
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
