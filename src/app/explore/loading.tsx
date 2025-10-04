export default function ExploreLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-gray-900 dark:via-purple-900 dark:to-violet-800">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black tracking-tight inline-block bg-white px-6 py-3 border-4 border-black">
            Explore
          </h2>
        </div>

        {/* Loading Spinner */}
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block h-16 w-16 border-4 border-black border-t-[#7F71D9] rounded-full animate-spin mb-6"></div>
            <p className="text-xl font-bold text-gray-700">Loading amazing NFTs...</p>
            <p className="text-sm text-gray-500 mt-2">Discovering the best collections for you</p>
          </div>
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              {/* NFT Card Skeleton */}
              <div className="bg-white rounded-lg border-4 border-black overflow-hidden">
                {/* Image Skeleton */}
                <div className="aspect-square bg-gray-200"></div>
                
                {/* Content Skeleton */}
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Loading Message */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-lg border-2 border-black">
            <div className="w-2 h-2 bg-[#7F71D9] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#7F71D9] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-[#7F71D9] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <span className="ml-2 text-sm font-bold text-gray-600">Fetching latest listings...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
