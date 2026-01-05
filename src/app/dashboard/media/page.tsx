'use client'

import { useState, useEffect, useTransition } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle, Clock, FileText, User, Trash2, EyeOff, Eye } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils' // Ensure cn is imported or available

import { MarkNotificationsAsRead } from '@/components/MarkNotificationsAsRead'

export default function MediaDashboard() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        const fetchDashboard = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            // Check Permissions
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (!profile || (profile.role !== 'president' && profile.role !== 'media_manager')) {
                toast.error("Unauthorized access")
                router.push('/')
                return
            }

            // Fetch Recent Events
            const { data: recentEvents } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: false })

            setEvents(recentEvents || [])
            setLoading(false)
        }

        fetchDashboard()
    }, [router])

    // Action Handlers
    const handleToggleEvent = (eventId: string, isHidden: boolean) => {
        startTransition(async () => {
            // Importing the same shared action
            const { toggleEventVisibility } = await import('@/app/admin/actions')
            const res = await toggleEventVisibility(eventId, isHidden)
            if (res.success) {
                toast.success(res.message)
                setEvents(prev => prev.map(e => e.id === eventId ? { ...e, is_hidden: isHidden } : e))
            } else {
                toast.error(res.message)
            }
        })
    }

    const handleDeleteEvent = (eventId: string) => {
        if (!confirm("Permanently delete this event?")) return
        startTransition(async () => {
            const { deleteEvent } = await import('@/app/admin/actions')
            const res = await deleteEvent(eventId)
            if (res.success) {
                toast.success("Event Deleted")
                setEvents(prev => prev.filter(e => e.id !== eventId))
            } else {
                toast.error(res.message)
            }
        })
    }

    // Filter for Mark as Read
    const upcomingEvents = events
        .filter(e => new Date(e.date) > new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const latestEventId = upcomingEvents[0]?.id || null

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
            <MarkNotificationsAsRead latestEventId={latestEventId} />
            <header className="mb-10">
                <h1 className="text-3xl font-serif font-bold text-foreground">Media Management</h1>
                <p className="text-muted-foreground">Manage events and community highlights.</p>
            </header>


            {/* EVENTS SECTION */}
            <div className="space-y-12 mb-12">
                {/* Upcoming Events */}
                <section>
                    <h2 className="text-xl font-medium border-b border-border pb-4 mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Upcoming Events
                    </h2>
                    {events.filter(e => new Date(e.date) > new Date()).length === 0 ? (
                        <p className="text-muted-foreground italic">No upcoming events scheduled.</p>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {events.filter(e => new Date(e.date) > new Date()).map(event => (
                                <div key={event.id} className={cn("bg-card border border-border rounded-xl overflow-hidden shadow-sm relative group", event.is_hidden && "opacity-75 border-dashed")}>
                                    <div className="aspect-video relative bg-secondary">
                                        {event.image_urls?.[0] ? (
                                            <Image src={event.image_urls[0]} alt={event.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
                                        )}
                                        {event.is_hidden && (
                                            <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm">
                                                <span className="bg-background/80 px-3 py-1 rounded-full text-xs font-bold border border-border flex items-center gap-2">
                                                    <EyeOff className="w-3 h-3" /> Hidden
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold truncate">{event.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-4">{new Date(event.date).toLocaleDateString()}</p>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleToggleEvent(event.id, !event.is_hidden)}
                                                disabled={isPending}
                                                className={cn(
                                                    "flex-1 py-2 text-xs border rounded transition-colors flex items-center justify-center gap-2",
                                                    event.is_hidden ? "border-primary text-primary hover:bg-primary/10" : "border-border text-muted-foreground hover:bg-secondary"
                                                )}
                                            >
                                                {event.is_hidden ? <><Eye className="w-3 h-3" /> Unhide</> : <><EyeOff className="w-3 h-3" /> Hide</>}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteEvent(event.id)}
                                                disabled={isPending}
                                                className="py-2 px-3 text-xs border border-destructive/20 text-destructive hover:bg-destructive/10 rounded transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Past Highlights */}
                <section>
                    <h2 className="text-xl font-medium border-b border-border pb-4 mb-6 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-secondary-foreground" />
                        Past Highlights
                    </h2>
                    {events.filter(e => new Date(e.date) <= new Date()).length === 0 ? (
                        <p className="text-muted-foreground italic">No past events found.</p>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {events.filter(e => new Date(e.date) <= new Date()).map(event => (
                                <div key={event.id} className={cn("bg-card border border-border rounded-xl overflow-hidden shadow-sm relative group", event.is_hidden && "opacity-75 border-dashed")}>
                                    <div className="aspect-video relative bg-secondary">
                                        {event.image_urls?.[0] ? (
                                            <Image src={event.image_urls[0]} alt={event.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
                                        )}
                                        {event.is_hidden && (
                                            <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm">
                                                <span className="bg-background/80 px-3 py-1 rounded-full text-xs font-bold border border-border flex items-center gap-2">
                                                    <EyeOff className="w-3 h-3" /> Hidden
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold truncate">{event.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-4">{new Date(event.date).toLocaleDateString()}</p>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleToggleEvent(event.id, !event.is_hidden)}
                                                disabled={isPending}
                                                className={cn(
                                                    "flex-1 py-2 text-xs border rounded transition-colors flex items-center justify-center gap-2",
                                                    event.is_hidden ? "border-primary text-primary hover:bg-primary/10" : "border-border text-muted-foreground hover:bg-secondary"
                                                )}
                                            >
                                                {event.is_hidden ? <><Eye className="w-3 h-3" /> Unhide</> : <><EyeOff className="w-3 h-3" /> Hide</>}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteEvent(event.id)}
                                                disabled={isPending}
                                                className="py-2 px-3 text-xs border border-destructive/20 text-destructive hover:bg-destructive/10 rounded transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
