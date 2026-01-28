import { createClient } from '@/utils/supabase/server'
import { Calendar, MapPin, Clock, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

export const dynamic = 'force-dynamic'

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: event } = await supabase
        .from('events')
        .select('*, profiles(name)')
        .eq('id', id)
        .single()

    if (!event) return notFound()

    const eventDate = new Date(event.date!)
    const images = event.image_urls || []

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
            <Link href="/events" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Events
            </Link>

            <article>
                {/* Header */}
                <header className="mb-12 max-w-4xl">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-secondary rounded-full">
                            <Calendar className="w-4 h-4" />
                            {eventDate.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-secondary rounded-full">
                            <Clock className="w-4 h-4" />
                            {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-secondary rounded-full">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl md:leading-tight font-serif font-bold text-foreground mb-6">
                        {event.title}
                    </h1>

                    <div className="prose prose-lg dark:prose-invert text-muted-foreground">
                        <p>{event.description}</p>
                    </div>
                </header>

                {/* Gallery (Bento / Masonry Style) */}
                {images.length > 0 && (
                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif font-semibold">Gallery</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-auto md:auto-rows-[250px]">
                            {images.map((url: string, index: number) => {
                                // Dynamic classes for Bento Layout
                                // First image: Large square (2x2)
                                // Standard (1x1)
                                // Every 3rd image: Wide (2x1) if possible
                                const isHero = index === 0
                                const isWide = !isHero && index % 3 === 0

                                return (
                                    <div
                                        key={url}
                                        className={cn(
                                            "relative rounded-xl overflow-hidden bg-secondary group aspect-square md:aspect-auto", // Force square on mobile
                                            isHero ? "md:col-span-2 md:row-span-2 md:min-h-[500px]" : "",
                                            isWide ? "md:col-span-2" : ""
                                        )}
                                    >
                                        <ImageWithFallback
                                            src={url}
                                            alt={`Event highlight ${index + 1}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            sizes={isHero ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )}
            </article>
        </div>
    )
}
