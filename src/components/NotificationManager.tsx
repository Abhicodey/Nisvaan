"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff } from "lucide-react"
import { toast } from "sonner"
import { subscribeUser } from "@/app/notifications/actions"
import { Button } from "@/components/ui/button"

declare global {
    interface Window {
        workbox: any;
    }
}

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

export function NotificationManager() {
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [subscription, setSubscription] = useState<PushSubscription | null>(null)
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            // Wait for service worker to be ready
            navigator.serviceWorker.ready.then((reg) => {
                setRegistration(reg)
                reg.pushManager.getSubscription().then((sub) => {
                    if (sub && !(sub.expirationTime && Date.now() > sub.expirationTime - 5 * 60 * 1000)) {
                        setSubscription(sub)
                        setIsSubscribed(true)
                    }
                })
            })
        }
    }, [])

    const subscribeButtonOnClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if (!registration) {
            toast.error("Notifications not supported or blocked.")
            return
        }

        try {
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
                ),
            })

            // Send subscription to server
            const result = await subscribeUser(JSON.parse(JSON.stringify(sub)))

            if (result.success) {
                setSubscription(sub)
                setIsSubscribed(true)
                toast.success("Notifications enabled!")
            } else {
                console.error("Backend subscription error:", result.error)
                toast.error(`Subscription failed: ${result.error || "Unknown server error"}`)
            }
        } catch (error: any) {
            console.error("Failed to subscribe the user: ", error)
            toast.error(error.message || "Unknown error")
        }
    }

    const unsubscribeButtonOnClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if (!subscription) return

        try {
            await subscription.unsubscribe()
            // optionally notify backend to delete, but PWA logic often just lets it expire or handles 410 on send
            setSubscription(null)
            setIsSubscribed(false)
            toast.info("Notifications disabled.")
        } catch (error) {
            console.error("Error unsubscribing", error)
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={isSubscribed ? unsubscribeButtonOnClick : subscribeButtonOnClick}
            title={isSubscribed ? "Disable Notifications" : "Enable Notifications"}
        >
            {isSubscribed ? <Bell className="h-[1.2rem] w-[1.2rem]" /> : <BellOff className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
    )
}
