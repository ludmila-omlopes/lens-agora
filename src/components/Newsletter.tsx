'use client';

export default function Newsletter() {
  return (
    <section className="py-16 bg-gradient-to-br from-[#8EF5F5] to-[#7EF2F2]">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">Stay in the Loop</h2>
          <p className="text-gray-700 mb-8">
            Get the latest updates on new drops, featured artists, and platform news delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md border-2 border-black font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#7F71D9]"
            />
            <button
              type="submit"
              className="bg-black text-white font-bold py-3 px-6 rounded-md border-2 border-black hover:-translate-y-1 transition-transform duration-200"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>
    </section>
  );
} 