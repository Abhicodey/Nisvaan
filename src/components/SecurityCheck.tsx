'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { Skull, Clock, Lock } from 'lucide-react'
import { toast } from 'sonner' // Assuming sonner is used based on previous files

export function SecurityCheck() {
    const [blockedState, setBlockedState] = useState<{ type: 'banned' | 'timeout', until?: string } | null>(null)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const checkStatus = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) return

            // Fetch Profile Status
            const { data: profile } = await supabase
                .from('profiles')
                .select('account_status, timeout_until')
                .eq('id', user.id)
                .single()

            if (!profile) return

            // Check Ban
            // Note: If account_status is 'suspended' AND no timeout, it's a permanent suspension (Ban)
            // Or if we deleted them, they wouldn't be logged in (handled by Auth).
            // But if we just marked them 'suspended' manually:
            if (profile.account_status === 'suspended') {
                const now = new Date()
                const timeoutDate = profile.timeout_until ? new Date(profile.timeout_until) : null

                if (timeoutDate && timeoutDate > now) {
                    // Timed Out
                    setBlockedState({ type: 'timeout', until: timeoutDate.toLocaleString() })
                } else if (!timeoutDate) {
                    // Indefinite Suspension (Ban)
                    setBlockedState({ type: 'banned' })
                } else {
                    // Timeout Expired - Should we auto-restore?
                    // For now, let's just assume if timeout expired, they are free to go, 
                    // unless status is still 'suspended'. 
                    // Ideally, backend should clear status, but UI can just ignore it if timeout is past.
                    // However, typical logic: if suspended and timeout passed -> OK. 
                    // Use server action to clear 'suspended' status lazily? 
                    // For now, we only block if timeout is active.
                    // If blockedState was set, clear it.
                    setBlockedState(null)
                }
            }
        }

        checkStatus()
    }, [pathname]) // Re-check on navigation

    if (!blockedState) return null

    // Full Screen Block
    return (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-card border border-destructive/50 p-8 rounded-2xl shadow-2xl max-w-md w-full">
                {blockedState.type === 'banned' ? (
                    <>
                        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Skull className="w-10 h-10 text-destructive" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Account Suspended</h2>
                        <p className="text-muted-foreground mb-8">
                            Your account has been permanently suspended due to severe violations of our community guidelines.
                        </p>
                        <button
                            onClick={async () => {
                                const supabase = createClient()
                                await supabase.auth.signOut()
                                window.location.href = '/'
                            }}
                            className="w-full py-3 bg-destructive text-destructive-foreground rounded-lg font-bold hover:bg-destructive/90 transition-colors"
                        >
                            Sign Out
                        </button>
                    </>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock className="w-10 h-10 text-orange-500" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Temporary Timeout</h2>
                        <p className="text-muted-foreground mb-2">
                            You have been placed in a temporary timeout by a moderator.
                        </p>
                        <p className="text-sm font-mono bg-secondary p-2 rounded mb-8">
                            Lifted on: <span className="font-bold">{blockedState.until}</span>
                        </p>
                        <button
                            onClick={async () => {
                                const supabase = createClient()
                                await supabase.auth.signOut()
                                window.location.href = '/'
                            }}
                            className="w-full py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                        >
                            Sign Out
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
