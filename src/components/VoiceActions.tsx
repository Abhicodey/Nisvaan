'use client'

import { useState, useTransition } from 'react'
import { Heart, ShieldAlert, Share2 } from 'lucide-react'
import { toggleLike, reportPost } from '@/app/voices/actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function VoiceActions({ postId, currentUserId }: { postId: string, currentUserId?: string }) {
    const [isPending, startTransition] = useTransition()
    const [liked, setLiked] = useState(false)

    const handleLike = () => {
        if (!currentUserId) return toast.error("Please login first")

        setLiked(!liked)
        startTransition(async () => {
            const res = await toggleLike(postId)
            if (!res.success) setLiked(!liked)
        })
    }

    const handleReport = () => {
        if (!currentUserId) return toast.error("Please login first")
        const reason = prompt("Reason for reporting?")
        if (reason) {
            startTransition(async () => {
                await reportPost(postId, reason)
                toast.success("Reported")
            })
        }
    }

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
        toast.success("Link copied!")
    }

    return (
        <div className="flex items-center gap-4">
            <button onClick={handleLike} className={cn("p-3 rounded-full hover:bg-secondary transition-colors", liked ? "text-red-500" : "text-muted-foreground hover:text-red-500")}>
                <Heart className={cn("w-6 h-6", liked && "fill-current")} />
            </button>
            <button onClick={handleShare} className="p-3 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-primary">
                <Share2 className="w-6 h-6" />
            </button>
            <button onClick={handleReport} className="p-3 rounded-full hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                <ShieldAlert className="w-6 h-6" />
            </button>
        </div>
    )
}
