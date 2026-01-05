
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PenLine, Clock, CheckCircle, Bell } from 'lucide-react'

import { MarkNotificationsAsRead } from '@/components/MarkNotificationsAsRead'

export default async function UserDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile } = await supabase.from('profiles').select('name').eq('id', user!.id).single()
    const displayName = profile?.name || 'Member'

    // Fetch latest upcoming event ID for badge clearing
    const now = new Date().toISOString()
    const { data: latestEventData } = await supabase
        .from('events')
        .select('id')
        .gt('date', now)
        .eq('is_hidden', false)
        .order('date', { ascending: true })
        .limit(1)

    const latestEventId = latestEventData?.[0]?.id || null

    // Fetch recent submissions
    const { data: myPosts } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(5)

    return (
        <div className="space-y-8">
            <MarkNotificationsAsRead latestEventId={latestEventId} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">Welcome, {displayName}</h1>
                    <p className="text-muted-foreground">Track your contributions and stay updated.</p>
                </div>
                <Link href="/voices/submit" className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                    <PenLine className="w-4 h-4" />
                    New Submission
                </Link>
            </div>

            <div className="grid md:grid-cols-[2fr_1fr] gap-8">
                {/* Main Content: Submissions */}
                <div className="space-y-6">
                    <h2 className="text-xl font-serif font-semibold">Your Voices (Posts)</h2>
                    {myPosts && myPosts.length > 0 ? (
                        <div className="grid gap-4">
                            {myPosts.map((post: any) => (
                                <div key={post.id} className="p-4 rounded-xl bg-card border border-border flex justify-between items-center group hover:border-primary/30 transition-colors">
                                    <div>
                                        <h3 className="font-medium group-hover:text-primary transition-colors">{post.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Submitted {new Date(post.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {post.status === 'approved' && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Published</span>}
                                        {post.status === 'pending' && <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>}
                                        {post.status === 'rejected' && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Rejected</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 rounded-2xl bg-secondary/30 border border-dashed border-border text-center">
                            <p className="text-muted-foreground mb-4">You haven&apos;t submitted any posts yet.</p>
                            <Link href="/voices/submit" className="text-primary hover:underline">Share your first story</Link>
                        </div>
                    )}
                </div>

                {/* Sidebar: Notifications & Quick Stats */}
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-card border border-border">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Bell className="w-5 h-5" /> Recent Notifications
                        </h2>
                        <div className="space-y-4">
                            {/* Dynamic Notifications: Upcoming Events */}
                            <SuspenseNotifications />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

async function SuspenseNotifications() {
    const supabase = await createClient()
    const now = new Date().toISOString()

    const { data: events } = await supabase
        .from('events')
        .select('id, title, date')
        .gt('date', now)
        .eq('is_hidden', false)
        .order('date', { ascending: true })
        .limit(3)

    if (!events || events.length === 0) {
        return <p className="text-sm text-muted-foreground italic text-center py-4">No new notifications.</p>
    }

    return (
        <div className="space-y-3">
            {events.map((event: any) => (
                <Link
                    key={event.id}
                    href="/events"
                    className="block p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors border border-transparent hover:border-primary/20"
                >
                    <div className="flex justify-between items-start gap-2">
                        <div>
                            <span className="text-xs font-bold text-primary uppercase tracking-wider">Upcoming Event</span>
                            <h4 className="font-medium text-sm mt-0.5">{event.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1 text-nowrap">
                                {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    </div>
                </Link>
            ))}
        </div>
    )
}
