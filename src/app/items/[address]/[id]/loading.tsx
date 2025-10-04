export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-gray-900 dark:via-purple-900 dark:to-violet-800">
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image skeleton */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              <div className="flex space-x-2">
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
              </div>
            </div>

            {/* Info skeleton */}
            <div className="space-y-6">
              <div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              </div>

              <div className="space-y-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
              </div>

              <div className="space-y-2">
                <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>

              <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>

          {/* Activity section skeleton */}
          <div className="mt-12">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
