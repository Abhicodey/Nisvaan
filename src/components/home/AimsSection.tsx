"use client"

import { motion, Variants } from "framer-motion"
import { Flame, Heart, Users, Sparkles, MessageCircle } from "lucide-react"

const aims = [
    {
        icon: Flame,
        emoji: "🕯️",
        title: "Safe Space",
        description: "Promote feminism & provide a safe, respectful space for all voices.",
    },
    {
        icon: MessageCircle,
        emoji: "💌",
        title: "Open Dialogue",
        description: "Encourage meaningful dialogue on gender, identity, and equality.",
    },
    {
        icon: Users,
        emoji: "🤝",
        title: "Inclusivity",
        description: "Embrace diverse viewpoints & foster inclusivity in every conversation.",
    },
    {
        icon: Heart,
        emoji: "💪",
        title: "Break Stereotypes",
        description: "Challenge and break stereotypes through awareness & education.",
    },
    {
        icon: Sparkles,
        emoji: "✨",
        title: "Empathy & Respect",
        description: "Uphold empathy, free speech, and mutual respect always.",
    },
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
}

export function AimsSection() {
    return (
        <section className="py-20 md:py-28 bg-secondary/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
                        What We Aim For
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Our mission is built on five core pillars that guide everything we do.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {aims.map((aim, index) => (
                        <motion.div
                            key={aim.title}
                            variants={itemVariants}
                            className={`group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 ${index === aims.length - 1 ? "lg:col-start-2" : ""
                                }`}
                        >
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-3xl">{aim.emoji}</span>
                                    <aim.icon className="w-6 h-6 text-primary opacity-50" />
                                </div>
                                <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                                    {aim.title}
                                </h3>
                                <p className="text-muted-foreground">{aim.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
