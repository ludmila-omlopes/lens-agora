import { Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function FollowersTab({ followers }: { followers: any[] }) {
  return (
    <div>
      <h2 className="text-2xl font-black mb-6">Followers</h2>

      {followers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {followers.map((user) => (
            <UserCard
              key={user.username}
              username={user.username}
              name={user.name}
              avatar={user.avatar}
              isFollowing={user.isFollowing}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border-4 border-black">
          <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">No Followers Yet</h3>
          <p className="text-gray-500">Share your profile to gain followers.</p>
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