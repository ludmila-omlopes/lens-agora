'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from '@/app/contexts/ThemeContext';
import { DirectListing } from 'thirdweb/extensions/marketplace';
import { getNFTMediaURL } from '../../lib/nfts';
import { getProfileByAddress } from '../../lib/profileUtils';
import Link from 'next/link';
import { Eye, Heart } from 'lucide-react';

export default function FeaturedNFTs({ nfts }: { nfts: DirectListing[] }) {
  const { theme } = useTheme();
  const [creatorNames, setCreatorNames] = useState<Record<string, string>>({});
  const [hoveredNFT, setHoveredNFT] = useState<string | null>(null)
  
  const featuredNFTs = [
    {
      id: "1",
      title: "Cosmic Voyage #42",
      image: "/amethyst-flow.png",
      price: "2.5 ETH",
      artist: { name: "Elena Rivera", avatar: "/thoughtful-gaze.png" },
      likes: 234,
      views: 1520,
    },
    {
      id: "2",
      title: "Digital Dreams",
      image: "/emerald-circuitry.png",
      price: "1.8 ETH",
      artist: { name: "Marcus Kim", avatar: "/focused-artist.png" },
      likes: 189,
      views: 980,
    },
    {
      id: "3",
      title: "Neon Genesis",
      image: "/electric-cityscape.png",
      price: "3.2 ETH",
      artist: { name: "Akira Tanaka", avatar: "/thoughtful-urbanite.png" },
      likes: 456,
      views: 2340,
    },
    {
      id: "4",
      title: "Abstract Reality",
      image: "/abstract-geometric-shapes.png",
      price: "1.5 ETH",
      artist: { name: "Jordan Smith", avatar: "/serene-gaze.png" },
      likes: 167,
      views: 890,
    },
  ]

  
  useEffect(() => {
    const fetchCreatorNames = async () => {
      const fetchedNames: Record<string, string> = {};
      for (const nft of nfts) {
        if (nft.creatorAddress && !fetchedNames[nft.creatorAddress]) {
          try {
            const profile = await getProfileByAddress(nft.creatorAddress);
            fetchedNames[nft.creatorAddress] = profile?.name || 'Unknown Creator';
          } catch (error) {
            console.error(`Failed to fetch profile for address ${nft.creatorAddress}:`, error);
            fetchedNames[nft.creatorAddress] = 'Unknown Creator';
          }
        }
      }
      setCreatorNames(fetchedNames);
    };

    fetchCreatorNames();
  }, [nfts]);

  return (
    <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-black">Featured Artworks</h2>
            <Link
              href="/explore"
              className="bg-white text-black font-bold py-2 px-6 rounded-md border-2 border-black hover:-translate-y-1 transition-transform duration-200"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {nfts.map((nft) => (
              <Link
                key={nft.id}
                href="/items/[address]/[id]" as={`/items/${nft.assetContractAddress}/${nft.asset.id}`}
                className="group"
                onMouseEnter={() => setHoveredNFT(nft.id.toString())}
                onMouseLeave={() => setHoveredNFT(null)}
              >
                <div
                  className={`border-4 border-black rounded-lg overflow-hidden bg-white transition-transform duration-200 ${
                    hoveredNFT === nft.id.toString() ? "-translate-y-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : ""
                  }`}
                >
                  <div className="relative aspect-square">
                    <img src={ getNFTMediaURL(nft.asset) || "/placeholder.png"} alt={nft.asset.metadata.name!} className="object-cover" />
                    <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs font-bold">
                      {nft.pricePerToken}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-black text-lg mb-2 truncate">{nft.asset.metadata.name || " "}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full overflow-hidden relative border-2 border-black">
                          <Image
                            src={"/placeholder.png"} //todo: pegar avatar do artista, já está no array usado aqui
                            alt={"Artist Avatar"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm font-bold truncate"> {creatorNames[nft.creatorAddress] || 'Loading...'}
                        </span>
                      </div>
                    </div>
                    {/* todo: pegar dados do Lens Protocol */}
                    {/* <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" /> {nft.likes}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" /> {nft.views}
                      </span>
                    </div> */}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
  );
}
