"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Account } from "@lens-protocol/client";
import Link from "next/link";

// Replace with the correct import once the Lens utility is available
type Collector = {
  username: string;
  name: string;
  avatar: string;
  isFollowing: boolean;
};

export default function CollectorsTab({ account }: { account: Account }) {
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollectors = async () => {
      setLoading(true);
      // TODO: Replace this with actual Lens call to fetch collectors
      const mockCollectors: Collector[] = [
        {
          username: "nftfanatic",
          name: "Laura Kim",
          avatar: "/placeholder.svg",
          isFollowing: true,
        },
        {
          username: "web3whale",
          name: "John Smith",
          avatar: "/placeholder.svg",
          isFollowing: false,
        },
      ];

      setCollectors(mockCollectors);
      setLoading(false);
    };

    fetchCollectors();
  }, [account]);

  if (loading) {
    return <p className="text-center py-6 font-bold">Loading collectors...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-black mb-6">Collectors</h2>

      {collectors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collectors.map((collector) => (
            <UserCard
              key={collector.username}
              username={collector.username}
              name={collector.name}
              avatar={collector.avatar}
              isFollowing={collector.isFollowing}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border-4 border-black">
          <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">No Collectors Yet</h3>
          <p className="text-gray-500">When someone collects your NFTs, they'll appear here.</p>
        </div>
      )}
    </div>
  );
}

// User Card Component
const UserCard = ({
    username,
    name,
    avatar,
    isFollowing,
  }: {
    username: string
    name: string
    avatar: string
    isFollowing?: boolean
  }) => {
    const [following, setFollowing] = useState(isFollowing || false)
  
    return (
      <div className="flex items-center justify-between p-3 border-2 border-black rounded-lg bg-white">
        <Link href={`/profile/${username}`} className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden relative border-2 border-black">
            <img src={avatar || "/placeholder.svg"} alt={name} className="object-cover" />
          </div>
          <div>
            <h3 className="font-bold">{name}</h3>
            <p className="text-xs text-gray-500">@{username}</p>
          </div>
        </Link>
        <button
          onClick={() => setFollowing(!following)}
          className={`px-3 py-1 rounded-md border-2 border-black font-bold text-sm ${
            following ? "bg-white text-black" : "bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white"
          }`}
        >
          {following ? "Following" : "Follow"}
        </button>
      </div>
    )
  }