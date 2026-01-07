'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { healProfile } from '@/app/profile/actions'

export interface Profile {
    id: string
    name: string | null
    role: "user" | "media_manager" | "president"
    avatar_url: string | null
    age: number | null
    bio: string | null
    moderation_state?: string
    email?: string // joined from auth potentially, or we fetch it
}

export function useProfile() {
    const supabase = createClient()
    const router = useRouter()
    const queryClient = useQueryClient()

    const { data, isLoading, error } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            // 1. Get Session (Fast, Local)
            const { data: { session }, error: sessionError } = await supabase.auth.getSession()

            if (sessionError || !session?.user) {
                return null
            }

            // 2. Fetch Profile (Single Query)
            // We select specific fields as requested
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('id, name, role, avatar_url, age, bio, moderation_state, email') // Added email for UI consistency
                .eq('id', session.user.id)
                .single()

            if (profileError) {
                console.error('Profile fetch error:', profileError)
                return null
            }

            // TRIGGER AUTO-HEAL (Fire and Forget)
            // We dynamically import the server action to avoid bundling issues if possible, 
            // or just call it if allowed in client components. 
            // Since it's a server action, it's fine.
            // TRIGGER AUTO-HEAL (Fire and Forget)
            const user = session.user
            if (!profile.email || !profile.name || !profile.avatar_url) {
                console.log("Triggering Auto-Heal for:", user.email)
                healProfile(user.id, user.user_metadata, user.email || '')
                    .catch(err => console.error("Auto-heal trigger failed:", err))
            }

            return {
                ...profile,
                // Optimistically apply auth data for UI if profile is missing it
                email: profile.email || session.user.email,
                name: profile.name || session.user.user_metadata?.name || session.user.user_metadata?.full_name,
                avatar_url: profile.avatar_url || session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture
            } as Profile
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000,   // 10 minutes
        retry: 1,
    })

    // Listen for Auth Changes to clear/invalidate cache
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_OUT') {
                queryClient.setQueryData(['profile'], null)
                queryClient.cancelQueries({ queryKey: ['profile'] })
            } else if (event === 'SIGNED_IN') {
                queryClient.invalidateQueries({ queryKey: ['profile'] })
            }
        })
        return () => subscription.unsubscribe()
    }, [supabase, queryClient])

    const signOut = async () => {
        await supabase.auth.signOut()
        queryClient.setQueryData(['profile'], null)
        router.push('/login')
        router.refresh()
    }

    return {
        profile: data,
        user: data ? { id: data.id, email: data.email } : null, // Backwards compat for checks
        isLoading,
        error,
        signOut
    }
}
