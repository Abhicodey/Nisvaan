"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";

export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        // Register Service Worker
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => {
                    console.log("SW registered:", registration);
                })
                .catch((error) => {
                    console.log("SW registration failed:", error);
                });
        }

        const handleBeforeInstallPrompt = (e: any) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setIsVisible(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        // Check if already installed
        if (window.matchMedia("(display-mode: standalone)").matches) {
            setIsVisible(false);
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);

        if (outcome === "accepted") {
            setIsVisible(false);
        }
    };

    if (!isMounted) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-white/20 bg-black/40 p-4 shadow-2xl backdrop-blur-xl md:bottom-8 md:right-8 md:bg-black/60 md:left-auto"
                >
                    <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black">
                            <Image
                                src="/logo.png"
                                alt="Nisvaan Logo"
                                fill
                                className="object-contain p-1"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-white">Install Nisvaan</h3>
                            <p className="text-xs text-zinc-300">
                                Install our app for a better experience.
                            </p>
                        </div>
                        <Button
                            onClick={handleInstallClick}
                            size="sm"
                            className="bg-white text-black hover:bg-zinc-200"
                        >
                            Install
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
