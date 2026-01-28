"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function StartupAnimation() {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        // Lock scroll
        document.body.style.overflow = "hidden"

        // Hide animation after completion
        const timer = setTimeout(() => {
            setIsVisible(false)
            document.body.style.overflow = "unset"
        }, 3500)
        return () => {
            clearTimeout(timer)
            document.body.style.overflow = "unset"
        }
    }, [])

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    }

    const item = {
        hidden: { y: 20, opacity: 0, filter: "blur(10px)" },
        show: {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: { duration: 0.8, ease: "circOut" }
        },
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, filter: "blur(20px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] grid place-items-center bg-background"
                >
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="relative flex flex-col items-center text-center"
                    >
                        {/* Logo Mark */}
                        <motion.div
                            variants={item}
                            className="w-24 h-24 mb-6 rounded-full overflow-hidden shadow-2xl relative"
                        >
                            <img
                                src="/logo-updated.png"
                                alt="Nisvaan Logo"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        {/* Staggered Text */}
                        <div className="overflow-hidden">
                            <motion.h1
                                variants={item}
                                className="text-7xl md:text-9xl font-serif font-bold tracking-tighter text-foreground"
                            >
                                Nisvaan
                            </motion.h1>
                        </div>

                        <motion.p
                            variants={item}
                            className="text-lg md:text-xl text-primary mt-6 font-medium tracking-[0.2em] uppercase"
                        >
                            Empower through Empathy
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
