"use client"

import { motion } from "framer-motion"

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
            transition={{ ease: [0.25, 0.1, 0.25, 1], duration: 0.8 }}
            className="w-full"
        >
            {children}
        </motion.div>
    )
}
