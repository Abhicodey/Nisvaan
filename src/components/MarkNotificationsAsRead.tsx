'use client'

import { useEffect } from 'react'

export function MarkNotificationsAsRead({ latestEventId }: { latestEventId: string | null }) {
    useEffect(() => {
        if (!latestEventId) return

        // Save to LocalStorage
        localStorage.setItem('nisvaan_seen_event_id', latestEventId)

        // Dispatch event so Navbar updates immediately if on the same page
        window.dispatchEvent(new CustomEvent('notificationsRead', { detail: latestEventId }))

    }, [latestEventId])

    return null
}
