'use client'

import { Calendar, MapPin, Clock } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface EventCardProps {
    event: any
    isPast?: boolean
}

export function EventCard({ event, isPast = false }: EventCardProps) {
    const eventDate = new Date(event.date)

    return (
        <Link href={`/events/${event.id}`} className="block h-full">
            <article className={cn(
                "group bg-card border border-border rounded-xl overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300",
                isPast && "opacity-80 grayscale-[0.5] hover:opacity-100 hover:grayscale-0"
            )}>
                {/* Image */}
                <div className="relative aspect-video bg-secondary overflow-hidden">
                    {event.image_urls && event.image_urls.length > 0 ? (
                        <Image
                            src={event.image_urls[0]}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 font-serif text-2xl">
                            Nisvaan Event
                        </div>
                    )}

                    {/* Date Badge */}
                    <div className="absolute top-3 left-3 bg-background/90 backdrop-blur text-center px-3 py-1 rounded-lg border border-border shadow-sm">
                        <div className="text-xs uppercase font-bold text-muted-foreground">
                            {eventDate.toLocaleString('default', { month: 'short' })}
                        </div>
                        <div className="text-xl font-bold text-foreground leading-none">
                            {eventDate.getDate()}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">
                        {event.title}
                    </h3>

                    <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span suppressHydrationWarning>
                                {eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                        </div>
                    </div>

                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                        {event.description}
                    </p>
                </div>
            </article>
        </Link>
    )
}
