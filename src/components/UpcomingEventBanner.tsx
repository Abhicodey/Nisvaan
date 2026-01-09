'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Calendar, MapPin, X, ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export function UpcomingEventBanner() {
    const [event, setEvent] = useState<any | null>(null)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const fetchNextEvent = async () => {
            const supabase = createClient()
            const now = new Date().toISOString()

            const { data } = await supabase
                .from('events')
                .select('*')
                .eq('is_hidden', false)
                .eq('category', 'upcoming')
                .gt('date', now)
                .order('date', { ascending: true })
                .limit(1)

            const upcomingEvent = data?.[0] ?? null
            if (upcomingEvent) setEvent(upcomingEvent)
        }
        fetchNextEvent()
    }, [])

    if (!event || !isVisible) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-20 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-3xl z-40"
            >
                <div className="bg-gradient-to-r from-primary/90 to-primary text-primary-foreground p-4 rounded-xl shadow-lg backdrop-blur-md border border-primary/20 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1 opacity-90">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            Upcoming Event
                        </div>
                        <h3 className="font-serif font-bold text-lg truncate">{event.title}</h3>
                        <div className="flex items-center gap-4 text-sm mt-1 opacity-90">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="hidden sm:flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3" />
                                {event.location}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <Link
                            href="/events"
                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            Details <ArrowRight className="w-3 h-3" />
                        </Link>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
