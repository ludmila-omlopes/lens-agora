'use client';

import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#8F83E0] to-[#7F71D9]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">Ready to Start Your Journey?</h2>
        <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of artists and collectors in the most vibrant NFT community. Create, discover, and trade
          unique digital assets.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/create-account"
            className="bg-white text-black font-black py-4 px-8 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
          >
            CREATE ACCOUNT
          </Link>
          <Link
            href="/explore"
            className="bg-transparent text-white font-black py-4 px-8 rounded-md border-2 border-white transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-y-0 active:shadow-none"
          >
            EXPLORE NOW
          </Link>
        </div>
      </div>
    </section>
  );
} 