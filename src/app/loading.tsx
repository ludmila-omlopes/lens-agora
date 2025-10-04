'use client'

import { useTheme } from './contexts/ThemeContext'

export default function HomeLoading() {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800' : 'bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100'} transition-colors duration-300`}>
      <main>
        {/* Hero Section Skeleton */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            {/* Hero Title Skeleton */}
            <div className="mb-8">
              <div className="h-16 bg-gray-200 rounded-lg mx-auto mb-4 w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded-lg mx-auto mb-4 w-1/2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-lg mx-auto w-1/3 animate-pulse"></div>
            </div>

            {/* Hero Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <div className="h-12 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
            </div>

            {/* Hero Image/Content Skeleton */}
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Featured NFTs Section Skeleton */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            {/* Section Title */}
            <div className="text-center mb-12">
              <div className="h-12 bg-gray-200 rounded-lg mx-auto mb-4 w-64 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-lg mx-auto w-96 animate-pulse"></div>
            </div>

            {/* Featured NFTs Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-white rounded-lg border-4 border-black overflow-hidden">
                    {/* NFT Image Skeleton */}
                    <div className="aspect-square bg-gray-200"></div>
                    
                    {/* NFT Content Skeleton */}
                    <div className="p-4">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section Skeleton */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <div className="h-12 bg-gray-200 rounded-lg mx-auto mb-6 w-80 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded-lg mx-auto mb-8 w-96 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg mx-auto w-48 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Newsletter Section Skeleton */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <div className="h-10 bg-gray-200 rounded-lg mx-auto mb-4 w-64 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-lg mx-auto mb-8 w-80 animate-pulse"></div>
              
              {/* Newsletter Form Skeleton */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="h-12 bg-gray-200 rounded-lg flex-1 max-w-md animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Loading Indicator */}
        <div className="fixed bottom-8 right-8">
          <div className="bg-white rounded-lg border-4 border-black p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-black border-t-[#7F71D9] rounded-full animate-spin"></div>
              <span className="text-sm font-bold">Loading marketplace...</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
