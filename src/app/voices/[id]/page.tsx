import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, User, Calendar, Clock, Heart, ShieldAlert } from 'lucide-react'
import { toggleLike, reportPost } from '../actions'
import { VoiceActions } from '@/components/VoiceActions' // We'll make a client component for buttons

export default async function VoiceDetails({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    // Fetch Post
    const { data: post } = await supabase
        .from('posts')
        .select('*, profiles(name, bio, avatar_url)')
        .eq('id', id)
        .single()

    if (!post) {
        notFound()
    }

    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full bg-secondary">
                {post.image_url ? (
                    <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-mauve/20 to-peach/20">
                        <span className="text-6xl font-serif text-muted-foreground/20">Nisvaan</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                <div className="absolute top-24 left-4 md:left-8">
                    <Link
                        href="/voices"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-md text-foreground hover:bg-background transition-colors text-sm font-medium border border-white/10"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Voices
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl mx-auto">
                    <div className="space-y-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm text-primary text-xs font-semibold uppercase tracking-wider border border-primary/20">
                            {post.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                <span className="font-medium text-foreground">{post.profiles?.name || 'Anonymous'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span>{new Date(post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                            {/* <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">

                <div className="prose prose-lg dark:prose-invert prose-headings:font-serif prose-p:leading-relaxed prose-img:rounded-xl max-w-none">
                    {/* 
                        Ideally use a Markdown parser here like react-markdown. 
                        For now, simple whitespace preservation.
                     */}
                    {post.content.split('\n').map((para: string, i: number) => (
                        <p key={i} className="mb-6">{para}</p>
                    ))}
                </div>

                {/* Actions / Author Bio */}
                <div className="mt-16 pt-8 border-t border-border flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Written by</p>
                        <p className="font-serif text-xl font-bold">{post.profiles?.name || 'Anonymous'}</p>
                    </div>

                    <VoiceActions postId={post.id} currentUserId={user?.id} />
                </div>

            </div>
        </div>
    )
}
