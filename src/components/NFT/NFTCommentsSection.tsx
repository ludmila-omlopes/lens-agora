"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  createCommentonNFT,
  getCommentsForNFT,
} from "../../../lib/lensProtocolUtils";
import { AnyPost, Post } from "@lens-protocol/client";

export function NFTCommentsSection({
  nftId,
  collectionAddress,
}: {
  nftId: string;
  collectionAddress: string;
}) {
  const [comments, setComments] = useState<AnyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function formatTimeAgo(date: Date) {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

    return date.toLocaleDateString();
  }

  const fetchComments = async () => {
    try {
      setLoading(true);
      const results = await getCommentsForNFT(nftId, collectionAddress);
      setComments(results || []);
    } catch (err) {
      console.error("Failed to load comments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [nftId, collectionAddress]);

  const handleCommentSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const comment = formData.get("comment") as string;

    if (!comment.trim()) return;

    try {
      setIsPosting(true);
      await createCommentonNFT(nftId, collectionAddress, comment);
      await fetchComments();
      setVisibleCount(3);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      console.error("Error submitting comment:", err);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-[#F7E5F2] rounded-lg border-4 border-black p-6">
      <h2 className="text-xl font-black mb-4 flex items-center">
        <MessageCircle className="mr-2 h-5 w-5" /> Comments
      </h2>

      <div className="space-y-4">
        {(loading ? [] : (comments as Post[]).slice(0, visibleCount)).map((comment, index) => (
          <div key={index} className="p-3 border-2 border-black rounded-md bg-white">
            <div className="flex items-center mb-2">
              <div className="h-6 w-6 rounded-full overflow-hidden relative border-2 border-black mr-2">
                <img
                  src={comment.author.metadata?.picture || "/placeholder.svg"}
                  alt={comment.author.username?.localName || "User Avatar"}
                  className="object-cover"
                />
              </div>
              {/*todo: colocar link pra página do user */}
              <Link href={"/"} className="font-bold text-sm hover:underline">
                {comment.author.username?.localName}
              </Link>
              <div className="text-xs text-gray-600 ml-auto">
                {formatTimeAgo(new Date(comment.timestamp))}
              </div>
            </div>
            <p className="text-sm">
              {comment.metadata.__typename === "TextOnlyMetadata"
                ? comment.metadata.content
                : "no comments"}
            </p>
          </div>
        ))}

        {!loading && comments.length > visibleCount && (
          <button
            onClick={() => setVisibleCount((prev) => prev + 3)}
            className="block w-full text-center py-2 border-2 border-black rounded-md font-bold text-sm bg-white hover:bg-[#F7F6FC]"
          >
            See {comments.length} Comments
          </button>
        )}

        <form onSubmit={handleCommentSubmission} className="flex gap-2 mt-4">
          <div className="h-8 w-8 rounded-full overflow-hidden relative border-2 border-black flex-shrink-0">
            <img src="/placeholder.svg?height=40&width=40" alt="Your avatar" className="object-cover" />
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              name="comment"
              ref={inputRef}
              placeholder={isPosting ? "Posting..." : "Add a comment..."}
              disabled={isPosting}
              className="w-full p-2 text-sm border-2 border-black rounded-md font-bold bg-white"
            />
            <button
              type="submit"
              disabled={isPosting}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#7F71D9] text-white font-bold py-1 px-2 text-xs rounded-md border border-black"
            >
              {isPosting ? "Wait..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
