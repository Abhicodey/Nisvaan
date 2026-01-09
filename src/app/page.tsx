import { createClient } from '@/utils/supabase/server'
import { UpcomingEventBanner } from "@/components/UpcomingEventBanner"
import { HeroSection } from "@/components/home/HeroSection"
import { AimsSection } from "@/components/home/AimsSection"
import { PhilosophySection } from "@/components/home/PhilosophySection"
import { CTASection } from "@/components/home/CTASection"
import { VoicesSection } from "@/components/home/VoicesSection"
import { EventsSection } from "@/components/home/EventsSection"

// This must be a Server Component to fetch data effectively
export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()
  const now = new Date()

  // 1. Fetch Top Liked Voice (Visible only)
  // We sort by likes_count and limit to 1.
  const { data: topVoiceData } = await supabase
    .from('posts')
    .select('id, title, content, cover_image, author_id, created_at, likes_count')
    .eq('is_hidden', false)
    .order('likes_count', { ascending: false })
    .limit(1)
    .single()

  // 2. Fetch Upcoming Events (Limit 3)
  const { data: eventsData } = await supabase
    .from('events')
    .select('*')
    .eq('is_hidden', false)
    .eq('category', 'upcoming')
    .gte('date', now.toISOString()) // Only future events
    .order('date', { ascending: true })
    .limit(3)

  return (
    <div className="min-h-screen">
      <UpcomingEventBanner />

      <HeroSection />

      <AimsSection />

      <PhilosophySection />

      {/* Dynamic Sections */}
      <VoicesSection topVoice={topVoiceData} />

      <EventsSection upcomingEvents={eventsData || []} />

      <CTASection />

      <section className="py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            <p className="text-sm">Part of</p>
            <div className="font-serif text-xl text-foreground">Banaras Hindu University</div>
            <div className="h-8 w-px bg-border hidden md:block" />
            <p className="text-sm text-center">Fostering dialogue since founding</p>
          </div>
        </div>
      </section>
    </div>
  )
}