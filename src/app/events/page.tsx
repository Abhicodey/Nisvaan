import { createClient } from '@/utils/supabase/server'
import { EventCard } from '@/components/EventCard'
import Link from 'next/link'
import { Plus, Clock, CheckCircle } from 'lucide-react'

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const supabase = await createClient()

  // Fetch Current User
  const { data: { user } } = await supabase.auth.getUser()

  // Check Role for Add Button
  let canCreate = false
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile && (profile.role === 'president' || profile.role === 'media_manager')) {
      canCreate = true
    }
  }

  // Fetch Events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('is_hidden', false)
    .order('date', { ascending: true })

  const now = new Date()
  const upcomingEvents = events?.filter(e => new Date(e.date!) >= now) || []
  const pastEvents = events?.filter(e => new Date(e.date!) < now).reverse() || [] // Reverse to show latest past events first

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Events & <span className="text-primary">Gatherings</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Join us in our upcoming dialogues, workshops, and cultural events.
            Explore our archive of past memories.
          </p>
        </div>

        {canCreate && (
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/events/create?type=upcoming"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-full font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg text-sm"
            >
              <Clock className="w-4 h-4" />
              Schedule Upcoming
            </Link>
            <Link
              href="/events/create?type=past"
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground border border-border px-5 py-3 rounded-full font-medium hover:bg-secondary/80 transition-all shadow-sm hover:shadow text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Add Past Highlight
            </Link>
          </div>
        )}
      </div>

      {/* Upcoming Events */}
      <section className="mb-20">
        <h2 className="text-2xl font-serif font-semibold mb-8 flex items-center gap-3">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded text-sm uppercase tracking-wider font-sans">Upcoming</span>
        </h2>

        {upcomingEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-secondary/20 border border-dashed border-border rounded-xl p-12 text-center">
            <p className="text-muted-foreground">No upcoming events scheduled at the moment.</p>
          </div>
        )}
      </section>

      {/* Past Events Archive */}
      <section>
        <h2 className="text-2xl font-serif font-semibold mb-8 opacity-80">Past Highlights</h2>

        {pastEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} isPast={true} />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm italic">
            <p>Archive is empty.</p>
          </div>
        )}
      </section>
    </div>
  )
}
