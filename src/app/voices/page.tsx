
import { createClient } from '@/utils/supabase/server'
import { PenLine } from "lucide-react"
import Link from 'next/link'
import Image from 'next/image'
import { VoiceCard } from '@/components/VoiceCard'

// This must be a Server Component to fetch data effectively without extra client-side fuss for SEO
export const dynamic = 'force-dynamic'

export default async function VoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()

  const resolvedSearchParams = await searchParams

  // URL Params for filtering
  const categoryFilter = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : 'All'

  // Build query
  let query = supabase
    .from('posts')
    .select('*, profiles(name, account_status, timeout_until)')
    .eq('is_hidden', false)
    .order('likes_count', { ascending: false }) // Primary Sort: Popularity
    .order('created_at', { ascending: false })  // Secondary Sort: Recency

  if (categoryFilter !== 'All') {
    query = query.eq('category', categoryFilter)
  }

  const { data: { user } } = await supabase.auth.getUser()
  const { data: rawPosts } = await query

  // Filter out suspended users
  const posts = (rawPosts || []).filter((post: any) => {
    const profile = post.profiles
    if (!profile) return true // Keep if no profile (orphan?) or handle separate

    const isTimedOut = profile.timeout_until && new Date(profile.timeout_until) > new Date()
    const isPermanentlySuspended = profile.account_status === 'suspended' && !profile.timeout_until

    return !isPermanentlySuspended && !isTimedOut
  })

  // Fetch current user's likes for optimistic UI
  let myLikedPostIds = new Set<string>()
  if (user) {
    const { data: myLikes } = await supabase
      .from('voice_likes')
      .select('post_id')
      .eq('user_id', user.id)

    if (myLikes) {
      myLikes.forEach(like => myLikedPostIds.add(like.post_id))
    }
  }

  const categories = ["All", "Article", "Poem", "Reflection", "Artwork"]

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-mauve/20 via-background to-peach/10" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-mauve/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-peach/15 rounded-full blur-3xl opacity-50" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground mb-6">
            <span className="text-primary">Voices</span> of Nisvaan
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A space for members to share their stories, poems, reflections, and artwork. Every voice matters here.
          </p>
          <Link
            href="/voices/submit"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            <PenLine className="w-5 h-5" />
            Submit Your Voice
          </Link>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border sticky top-16 bg-background/80 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={cat === 'All' ? '/voices' : `/voices?category=${cat}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${categoryFilter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts && posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <VoiceCard
                  key={post.id}
                  post={post}
                  currentUserId={user?.id}
                  initialLiked={myLikedPostIds.has(post.id)}
                  initialCount={post.likes_count || 0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No voices found in this category yet.</p>
              <p className="text-sm mt-2">Be the first to share your story!</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-lavender/20 to-peach/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-6">✍️</div>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
            Your Story Matters
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether it&apos;s a personal reflection, a creative piece, or an opinion you want to share — this platform is yours.
          </p>
        </div>
      </section>
    </div>
  )
}
