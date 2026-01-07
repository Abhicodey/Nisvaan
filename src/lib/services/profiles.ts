import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'

export async function getCurrentProfile() {
    const supabase: any = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        console.error('Error fetching profile:', error)
        return null
    }

    // Auto-Heal: Sync Auth Data to Profile if missing
    // This fixes issues where Google Auth users have empty profile fields
    const updates: any = {}
    let needsUpdate = false

    if (!profile.email && user.email) {
        updates.email = user.email
        needsUpdate = true
    }

    // Also sync name if missing and available in metadata
    if (!profile.name) {
        const metaName = user.user_metadata?.name || user.user_metadata?.full_name
        if (metaName) {
            updates.name = metaName
            needsUpdate = true
        }
    }

    // Also sync avatar if missing and available in metadata
    if (!profile.avatar_url) {
        const metaAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture
        if (metaAvatar) {
            updates.avatar_url = metaAvatar
            needsUpdate = true
        }
    }

    if (needsUpdate) {
        console.log("Auto-Healing Profile:", updates)
        // Fire and forget update (don't await to block UI)
        supabase.from('profiles').update(updates).eq('id', user.id).then(({ error }: any) => {
            if (error) console.error("Auto-heal failed:", error)
        })

        // Return the patched profile immediately for UI responsiveness
        return { ...profile, ...updates }
    }

    return profile
}

export async function updateProfile(data: Database['public']['Tables']['profiles']['Update']) {
    const supabase: any = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id)

    if (error) throw error
    return true
}

export async function updateProfileAvatar(file: File) {
    const supabase: any = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const fileExt = file.name.split('.').pop()
    const filePath = `avatars/${user.id}.${fileExt}`

    // 1. Upload to Storage
    const { error: uploadError } = await supabase.storage
        .from('profile-avatars')
        .upload(filePath, file, { upsert: true })

    if (uploadError) throw uploadError

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('profile-avatars')
        .getPublicUrl(filePath)

    // 3. Update Profile
    await updateProfile({ avatar_url: publicUrl })

    return publicUrl
}
