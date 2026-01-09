'use server'

import { createClient } from '@/utils/supabase/server'
import webpush from 'web-push'

webpush.setVapidDetails(
    'mailto:support@nisvaan.org',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
)

interface PushSubscriptionData {
    endpoint: string
    keys: {
        p256dh: string
        auth: string
    }
}

export async function subscribeUser(sub: PushSubscriptionData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Store in Supabase
    // Using upsert based on endpoint
    const { error } = await supabase.from('push_subscriptions').upsert({
        user_id: user?.id || null, // Optional connection to user
        endpoint: sub.endpoint,
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
    }, { onConflict: 'endpoint' })

    if (error) {
        console.error("Error saving subscription:", error)
        return { success: false, error: error.message }
    }

    return { success: true }
}

interface NotificationPayload {
    title: string
    body: string
    url?: string
}

export async function sendNotificationToAll(payload: NotificationPayload) {
    const supabase = await createClient()

    // Fetch all subscriptions
    const { data: subscriptions, error } = await supabase
        .from('push_subscriptions')
        .select('*')

    if (error) {
        console.error("Error fetching subscriptions:", error)
        return { success: false, error: error.message }
    }

    if (!subscriptions || subscriptions.length === 0) {
        return { success: true, count: 0 }
    }

    const notifications = subscriptions.map((sub) => {
        const pushConfig = {
            endpoint: sub.endpoint,
            keys: {
                auth: sub.auth,
                p256dh: sub.p256dh,
            },
        }

        return webpush
            .sendNotification(pushConfig, JSON.stringify(payload))
            .catch((err) => {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    // Subscription has expired or is no longer valid
                    console.log(`Subscription expired/invalid: ${sub.endpoint}`)
                    return supabase.from('push_subscriptions').delete().eq('id', sub.id)
                }
                console.error("Error sending notification:", err)
            })
    })

    await Promise.all(notifications)
    return { success: true, count: subscriptions.length }
}
