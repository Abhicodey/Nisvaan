'use client'

import { useProfile } from '@/hooks/useProfile'
import ProfileForm from './ProfileForm'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ProfileSkeleton } from '@/components/ui/skeletons'

export default function ProfilePage() {
    const { profile, user, isLoading } = useProfile()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login')
        }
    }, [isLoading, user, router])

    if (isLoading) {
        return <ProfileSkeleton />
    }

    if (!user) return null // Will redirect via effect

    // Pass profile (even if null/empty row, we pass the user info)
    return <ProfileForm profile={profile || null} userEmail={user.email} />
}
