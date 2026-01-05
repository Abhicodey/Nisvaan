'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Calendar, User, Heart, ShieldAlert } from 'lucide-react'
import { toggleLike, reportPost } from '@/app/voices/actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface VoiceCardProps {
    post: any
    currentUserId?: string
    initialLiked?: boolean
    initialCount?: number
}

export function VoiceCard({ post, currentUserId, initialLiked = false, initialCount = 0 }: VoiceCardProps) {
    const [isPending, startTransition] = useTransition()
    const [liked, setLiked] = useState(initialLiked)
    const [likesCount, setLikesCount] = useState(initialCount)

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!currentUserId) {
            toast.error("Please login to admire voices.")
            return
        }

        const newLikedState = !liked
        const newCount = newLikedState ? likesCount + 1 : Math.max(0, likesCount - 1)

        // Optimistic Update
        setLiked(newLikedState)
        setLikesCount(newCount)

        startTransition(async () => {
            const res = await toggleLike(post.id)
            if (!res.success) {
                // Revert on failure
                setLiked(!newLikedState)
                setLikesCount(likesCount) // Reset to original
                toast.error(res.message)
            }
        })
    }

    const handleReport = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!currentUserId) {
            toast.error("Please login to report.")
            return
        }

        const reason = prompt("Why are you reporting this voice? (abuse, hate, harassment, spam, misinformation)")
        if (!reason) return

        startTransition(async () => {
            const res = await reportPost(post.id, reason)
            if (res.success) {
                toast.success("Report submitted. We will review this shortly.")
            } else {
                if (res.message.toLowerCase().includes("already reported")) {
                    toast.info("You've already reported this voice.", {
                        description: "One report per person is enough to flag it."
                    })
                } else {
                    toast.error(res.message)
                }
            }
        })
    }

    return (
        <article className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            {/* Image Section */}
            <div className="aspect-[4/3] overflow-hidden relative bg-secondary">
                {post.image_url ? (
                    <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-4xl font-serif">
                        Nisvaan
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-primary text-xs font-medium uppercase tracking-wider">
                        {post.category}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col relative">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.profiles?.name || 'Anonymous'}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        })}
                    </span>
                </div>

                <h2 className="text-xl font-serif font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                </h2>

                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                    {post.excerpt || post.content.substring(0, 100) + '...'}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                    <Link href={`/voices/${post.id}`} className="text-primary text-sm font-medium hover:underline">
                        Read More &rarr;
                    </Link>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            <button
                                onClick={handleLike}
                                disabled={isPending}
                                className={cn(
                                    "p-2 rounded-full hover:bg-red-50 transition-colors",
                                    liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                                )}
                                title="Admire this voice"
                            >
                                <Heart className={cn("w-5 h-5", liked && "fill-current")} />
                            </button>
                            {likesCount > 0 && (
                                <span className="text-xs font-semibold text-muted-foreground mr-1">
                                    {likesCount}
                                </span>
                            )}
                        </div>

                        <button
                            onClick={handleReport}
                            disabled={isPending}
                            className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Report this voice"
                        >
                            <ShieldAlert className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}
