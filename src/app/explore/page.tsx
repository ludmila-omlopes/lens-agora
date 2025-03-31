import ExploreNFTs from "@/components/ExploreNFTs";
import { getAllValidListingsWithProfile } from "../../../lib/marketplacev3";

export const metadata = {
  title: "Explore NFTs | Lens Agora Marketplace",
  description: "Discover and collect extraordinary NFTs from various collections.",
};

export default async function ExplorePage() {
  const listings = await getAllValidListingsWithProfile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-gray-900 dark:via-purple-900 dark:to-violet-800">
      <div className="container mx-auto py-8 px-4">
      <h2 className="text-4xl font-black mb-12 text-center tracking-tight inline-block bg-white px-6 py-3 border-4 border-black mx-auto">
        Explore
      </h2>
        <ExploreNFTs listings={listings} />
      </div>
    </div>
  );
}
