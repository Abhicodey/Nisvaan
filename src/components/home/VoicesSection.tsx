"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

interface VoicesSectionProps {
    topVoice: any // Using specific type would be better if imported
}

export function VoicesSection({ topVoice }: VoicesSectionProps) {
    return (
        <section className="py-20 md:py-28 bg-secondary/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="order-2 lg:order-1 relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-lavender/20 rounded-3xl blur-2xl transform -rotate-3" />

                        {topVoice ? (
                            /* Dynamic Top Voice Card */
                            <Link href={`/voices/${topVoice.id}`} className="block group">
                                <div className="relative h-[400px] rounded-3xl bg-card border border-border shadow-xl overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:shadow-2xl group-hover:scale-[1.02]">
                                    {topVoice.cover_image ? (
                                        <Image
                                            src={topVoice.cover_image}
                                            alt={topVoice.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/20 flex items-center justify-center">
                                            <span className="text-6xl">✍️</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 text-white">
                                        <h3 className="text-2xl font-serif font-bold mb-2 line-clamp-2">{topVoice.title}</h3>
                                        <p className="text-sm opacity-90 line-clamp-2 mb-4">{topVoice.content?.substring(0, 100).replace(/<[^>]*>/g, '')}...</p>
                                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
                                            <span>Read Full Story</span>
                                            <span>→</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            /* Placeholder if no voices exist */
                            <div className="relative h-[400px] rounded-3xl bg-card border border-border shadow-xl flex items-center justify-center p-8">
                                <div className="space-y-4 w-full opacity-50">
                                    <div className="h-4 bg-secondary rounded w-3/4 animate-pulse" />
                                    <div className="h-4 bg-secondary rounded w-full animate-pulse" />
                                    <div className="h-4 bg-secondary rounded w-5/6 animate-pulse" />
                                    <div className="h-32 bg-secondary/50 rounded w-full mt-4" />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-muted-foreground font-serif text-xl">Coming Soon...</p>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="order-1 lg:order-2"
                    >
                        <div className="inline-block mb-4">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                                Community Content
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-6">
                            Hear the <span className="text-primary">Voices</span> of Change
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            Read powerful stories, essays, and poetry from our community members. We provide a platform for everyone to share their experiences and perspectives on gender, society, and growth.
                        </p>
                        <Link
                            href="/voices"
                            className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-primary/20 inline-block"
                        >
                            Explore Voices
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
