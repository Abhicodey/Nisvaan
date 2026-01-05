"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function CTASection() {
    return (
        <section className="py-20 md:py-28 bg-gradient-to-br from-primary/10 via-background to-lavender/10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-6">
                        Ready to Be Part of the Dialogue?
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Every thought matters, and every voice counts. Join our community of thinkers, dreamers, and changemakers who believe in the power of respectful conversation.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/join"
                            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                        >
                            Join Our Community
                        </Link>
                        <Link
                            href="/team"
                            className="px-8 py-3 rounded-full bg-card text-foreground font-medium hover:bg-secondary transition-all duration-300 border border-border"
                        >
                            Meet the Team
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
