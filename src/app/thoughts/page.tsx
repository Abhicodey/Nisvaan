
import { createClient } from '@/utils/supabase/server'
import { submitThought, toggleLike } from './actions'
import { Heart, MessageCircle, Send, Flag, Clock } from 'lucide-react'
import { redirect } from 'next/navigation'
import { ReportButton } from '@/components/ReportButton'

export default async function ThoughtsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch Thoughts (Approved only)
    // Also fetch likes count and if current user liked it
    // Supabase complex query or simple join
    const { data: thoughts } = await supabase
        .from('thoughts')
        .select(`
        *,
        profiles(name, avatar_url),
        thought_likes(user_id)
    `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

    // Transform data to get like count easily
    const thoughtsWithLikes = thoughts?.map((t: any) => ({
        ...t,
        likes_count: t.thought_likes?.length || 0,
        // Check if current user liked
        is_liked_by_me: user ? t.thought_likes.some((like: any) => like.user_id === user.id) : false
    }))

    return (
        <div className="min-h-screen bg-background py-16">
            <div className="max-w-2xl mx-auto px-4">

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold mb-4">Community Thoughts</h1>
                    <p className="text-muted-foreground">Short reflections, daily musings, and shared wisdom.</p>
                </div>

                {/* Submission Box */}
                {user ? (
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-12">
                        <h3 className="text-lg font-serif font-semibold mb-4">Share a thought</h3>
                        <form action={submitThought} className="relative">
                            <textarea
                                name="content"
                                rows={3}
                                placeholder="What's on your mind? (Max 300 chars)"
                                maxLength={300}
                                className="w-full bg-secondary/30 rounded-xl p-4 border border-border focus:border-primary focus:outline-none resize-none pr-12"
                                required
                            />
                            <button type="submit" className="absolute bottom-4 right-4 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-sm">
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Submissions are moderated before appearing here.
                        </p>
                    </div>
                ) : (
                    <div className="text-center p-8 bg-secondary/30 rounded-2xl mb-12 border border-dashed border-border">
                        <p className="text-muted-foreground mb-4">Join the conversation to share your thoughts.</p>
                        <a href="/login" className="text-primary font-medium hover:underline">Log in to post</a>
                    </div>
                )}


                {/* Stream */}
                <div className="space-y-6">
                    {thoughtsWithLikes && thoughtsWithLikes.length > 0 ? (
                        thoughtsWithLikes.map((thought: any) => (
                            <div key={thought.id} className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden flex-shrink-0">
                                        {thought.profiles?.avatar_url ? (
                                            <img src={thought.profiles.avatar_url} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground font-serif">
                                                {thought.profiles?.name?.charAt(0) || '?'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-semibold text-foreground">{thought.profiles?.name || 'Anonymous'}</h4>
                                                <p className="text-xs text-muted-foreground">{new Date(thought.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <ReportButton targetId={thought.id} targetType="thought" />
                                        </div>

                                        <p className="text-foreground/90 leading-relaxed mb-4">
                                            {thought.content}
                                        </p>

                                        <div className="flex items-center gap-6 pt-4 border-t border-border/50">
                                            {/* Like Action (Server Action Form for now) */}
                                            <form action={async () => {
                                                'use server'
                                                await toggleLike(thought.id)
                                            }}>
                                                <button type="submit" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-rose-500 transition-colors group">
                                                    <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                    <span>{thought.likes_count || 0}</span>
                                                </button>
                                            </form>

                                            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-not-allowed opacity-60" title="Coming soon">
                                                <MessageCircle className="w-4 h-4" />
                                                <span>Reply</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No thoughts shared yet. Be the first!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
