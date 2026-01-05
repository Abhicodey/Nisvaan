import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'

export async function getCurrentProfile() {
    const supabase: any = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        console.error('Error fetching profile:', error)
        return null
    }

    return data
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
