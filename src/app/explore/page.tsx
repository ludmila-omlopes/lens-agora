import ExploreNFTs from "@/components/ExploreNFTs";
import { getAllValidListingsWithProfile } from "../../../lib/marketplacev3";

export const metadata = {
  title: "Explore NFTs | Lens Agora Marketplace",
  description: "Discover and collect extraordinary NFTs from various collections.",
};

export default async function ExplorePage() {
  // Fetch listings directly in the component
  const listings = await getAllValidListingsWithProfile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-gray-900 dark:via-purple-900 dark:to-violet-800">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">Explore NFTs</h1>
        <ExploreNFTs listings={listings} />
      </div>
    </div>
  );
}
