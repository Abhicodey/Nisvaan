"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Clock } from "lucide-react"

interface EventsSectionProps {
    upcomingEvents: any[]
}

export function EventsSection({ upcomingEvents }: EventsSectionProps) {
    return (
        <section className="py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-block mb-4">
                        <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider border border-border">
                            Get Involved
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-6">
                        Join Our Upcoming <span className="text-primary">Events</span>
                    </h2>
                    <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
                        From workshops and debates to open mic nights, there's always something happening at Nisvaan. Come be a part of the conversation in person.
                    </p>

                    <div className="relative max-w-6xl mx-auto mb-12">
                        {upcomingEvents && upcomingEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {upcomingEvents.map((event, i) => (
                                    <Link key={event.id} href={`/events/${event.id}`} className="block group text-left h-full">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="bg-card rounded-2xl border border-border overflow-hidden h-full hover:shadow-lg transition-all duration-300 hover:border-primary/20 flex flex-col"
                                        >
                                            {/* Image Area */}
                                            <div className="relative h-48 w-full bg-secondary">
                                                {event.image_url ? (
                                                    <Image src={event.image_url} alt={event.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center text-4xl">🗓️</div>
                                                )}
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold shadow-sm border border-border">
                                                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </div>
                                            </div>

                                            <div className="p-6 flex flex-col flex-grow">
                                                <h3 className="text-xl font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                                    {event.title}
                                                </h3>
                                                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-primary/70" />
                                                        <span>
                                                            {new Date(event.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-primary/70" />
                                                        <span className="line-clamp-1">{event.location || 'TBA'}</span>
                                                    </div>
                                                </div>
                                                {/* Spacer to push button down if needed, or consistent height */}
                                                <div className="mt-auto">
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-primary group-hover:underline">Event Details →</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            /* Empty / Abstract State */
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm transition-shadow text-left">
                                        <div className="w-12 h-12 bg-primary/10 rounded-xl mb-4 flex items-center justify-center text-xl">🗓️</div>
                                        <div className="h-4 w-2/3 bg-secondary rounded mb-2" />
                                        <div className="h-3 w-full bg-secondary/50 rounded" />
                                    </div>
                                ))}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="bg-background/80 backdrop-blur-md px-6 py-2 rounded-full border border-border text-sm font-medium">Coming Soon</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <Link
                        href="/events"
                        className="px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-all duration-300 border border-border"
                    >
                        Explore Events
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
