"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function PhilosophySection() {
    return (
        <section className="py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-block mb-4">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                                Our Philosophy
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-6">
                            Understand What We <span className="text-primary">Stand For</span>
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            At Nisvaan, we believe that feminism is often misunderstood. It&apos;s not about putting anyone down — it&apos;s about lifting everyone up. True feminism advocates for equal rights, opportunities, and respect for all genders.
                        </p>
                        <Link
                            href="/stand-for"
                            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300"
                        >
                            Read our Manifesto
                            <span>→</span>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-lavender/40 to-peach/40 rounded-3xl blur-2xl" />
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-lavender/60 to-peach/60 p-1">
                            <div className="w-full h-full rounded-3xl bg-card flex items-center justify-center">
                                <div className="text-center p-8">
                                    <div className="text-6xl mb-4">🌻</div>
                                    <p className="font-serif text-2xl text-foreground italic">
                                        &quot;Empower through empathy&quot;
                                    </p>
                                    <p className="text-muted-foreground mt-2">- Nisvaan</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
