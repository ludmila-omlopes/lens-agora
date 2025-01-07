'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, MessageCircle, Share2 } from 'lucide-react'

interface Post {
  id: string
  user: {
    name: string
    avatar: string
  }
  content: string
  likes: number
  comments: number
  timestamp: string
}

const initialPosts: Post[] = [
  {
    id: '1',
    user: { name: 'Alice', avatar: '/placeholder.svg?text=A' },
    content: 'This NFT is absolutely stunning! 😍',
    likes: 24,
    comments: 3,
    timestamp: '2h ago'
  },
  {
    id: '2',
    user: { name: 'Bob', avatar: '/placeholder.svg?text=B' },
    content: 'I love the use of colors in this piece. The artist has really outdone themselves!',
    likes: 18,
    comments: 2,
    timestamp: '4h ago'
  },
  {
    id: '3',
    user: { name: 'Charlie', avatar: '/placeholder.svg?text=C' },
    content: 'Does anyone know if there are more pieces in this collection?',
    likes: 7,
    comments: 5,
    timestamp: '6h ago'
  }
]

export default function SocialFeed() {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [newPost, setNewPost] = useState('')

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPost.trim()) {
      const post: Post = {
        id: Date.now().toString(),
        user: { name: 'You', avatar: '/placeholder.png' },
        content: newPost.trim(),
        likes: 0,
        comments: 0,
        timestamp: 'Just now'
      }
      setPosts([post, ...posts])
      setNewPost('')
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lens Social Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePostSubmit} className="mb-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Share your thoughts..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <Button type="submit" disabled={true}>Soon</Button>
          </div>
        </form>
        <ScrollArea className="h-[400px]">
          {posts.map((post) => (
            <div key={post.id} className="mb-4 pb-4 border-b last:border-b-0">
              <div className="flex items-start space-x-3">
                <Avatar>
                  <AvatarImage src={post.user.avatar} alt={post.user.name} />
                  <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{post.user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{post.timestamp}</p>
                  <p className="mt-2">{post.content}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Button variant="ghost" size="sm" className="text-red-500">
                      <Heart className="w-4 h-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

