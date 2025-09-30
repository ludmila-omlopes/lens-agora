"use client"

import { useState } from "react"
import { Heart, Share2, Flag } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SocialActionsProps {
  isLiked: boolean
  onLikeToggle: (liked: boolean) => void
  onShare: (message: string) => void
}

export default function SocialActions({ isLiked, onLikeToggle, onShare }: SocialActionsProps) {
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [shareMessage, setShareMessage] = useState("")

  const handleShare = () => {
    onShare(shareMessage)
    setIsShareOpen(false)
    setShareMessage("")
  }

  return (
    <>
      <div className="absolute top-0 right-0 flex gap-2 z-10">
        <button
          className={`p-3 rounded-md border-2 border-black ${isLiked ? "bg-[#F29BD4] text-white" : "bg-white"} transition-colors`}
          onClick={() => onLikeToggle(!isLiked)}
        >
          <Heart className={`h-5 w-5 ${isLiked ? "fill-white" : ""}`} />
          <span className="sr-only">Like</span>
        </button>
        <button 
          className="p-3 rounded-md border-2 border-black bg-white"
          onClick={() => setIsShareOpen(true)}
        >
          <Share2 className="h-5 w-5" />
          <span className="sr-only">Share</span>
        </button>
        <button className="p-3 rounded-md border-2 border-black bg-white">
          <Flag className="h-5 w-5" />
          <span className="sr-only">Report</span>
        </button>
      </div>

      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Share this NFT</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Write your thoughts..."
            value={shareMessage}
            onChange={(e) => setShareMessage(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleShare}>Share</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
