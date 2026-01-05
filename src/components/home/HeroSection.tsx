"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function HeroSection() {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-lavender/30 via-background to-peach/20" />
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-lavender/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-peach/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="inline-block mb-6"
                    >
                        <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            The Feminist Gender Dialogue Society of BHU
                        </span>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-foreground leading-tight mb-6">
                        <span className="text-primary">Voices</span> meet,{" "}
                        <span className="text-primary">ideas</span> flow,{" "}
                        <span className="block mt-2">perspectives are heard.</span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
                    >
                        Nisvaan is a student-led platform at Banaras Hindu University dedicated to promoting feminism, equality, and open dialogue. We believe true feminism is about understanding, not confrontation — about empowering everyone through empathy.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <Link
                            href="/join"
                            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                        >
                            Join Us
                        </Link>
                        <Link
                            href="/events"
                            className="px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-all duration-300 border border-border"
                        >
                            Explore Events
                        </Link>
                        <Link
                            href="/voices"
                            className="px-8 py-3 rounded-full bg-transparent text-foreground font-medium hover:bg-secondary/50 transition-all duration-300 border border-border"
                        >
                            Read Voices
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
