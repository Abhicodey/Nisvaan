'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const profileSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    age: z.coerce.number().min(13, "You must be at least 13").max(120, "Invalid age").nullable().optional(),
    bio: z.string().max(1000, "Bio must be less than 1000 characters").optional(),
    avatarUrl: z.string().optional(),
})

export async function updateProfile(prevState: any, formData: FormData) {
    const rawData = {
        fullName: formData.get('fullName'),
        age: formData.get('age'),
        bio: formData.get('bio'),
        avatarUrl: formData.get('avatarUrl'),
    }

    const validatedFields = profileSchema.safeParse(rawData)

    console.log("Update Profile Request:", {
        rawData,
        success: validatedFields.success,
        errors: validatedFields.success ? null : validatedFields.error.flatten()
    })

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please check your inputs."
        }
    }

    const { fullName, age, bio, avatarUrl } = validatedFields.data

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, message: "User not authenticated" }
    }

    // Check if profile exists
    const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single()

    const updateData: any = {
        name: fullName,
        age: age,
        bio: bio,
    }

    if (avatarUrl) {
        updateData.avatar_url = avatarUrl
    }

    let error
    let updatedProfile

    if (profile) {
        // MANDATORY: Use .select().single() to force Supabase to return the updated row
        const { data, error: updateError } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', user.id)
            .select()
            .single()

        error = updateError
        updatedProfile = data
    } else {
        // Fallback: Create profile if missing
        try {
            const adminSupabase = createAdminClient()
            const { data, error: insertError } = await adminSupabase.from('profiles').insert({
                id: user.id,
                ...updateData
            })
                .select()
                .single()

            error = insertError
            updatedProfile = data
        } catch (e: any) {
            console.error("Admin client creation failed:", e)
            const { data, error: retryError } = await supabase.from('profiles').insert({
                id: user.id,
                ...updateData
            })
                .select()
                .single()

            error = retryError
            updatedProfile = data
        }
    }

    if (error) {
        console.error("Profile update error:", error)
        return { success: false, message: "Failed to update profile. Please try again." }
    }

    revalidatePath('/profile')
    return { success: true, message: "Profile updated successfully!", data: updatedProfile }
}

export async function uploadAvatar(formData: FormData) {
    const file = formData.get('file') as File
    if (!file) return { success: false, message: "No file provided" }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, message: "Unauthorized" }

    try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${fileName}`

        // Use Admin Client to bypass Storage RLS
        const adminSupabase = createAdminClient()

        const { error: uploadError } = await adminSupabase.storage
            .from('profile-avatars')
            .upload(filePath, file, {
                contentType: file.type,
                upsert: true
            })

        if (uploadError) {
            console.error("Storage upload failed:", uploadError)
            return { success: false, message: "Upload failed" }
        }

        const { data: { publicUrl } } = adminSupabase.storage
            .from('profile-avatars')
            .getPublicUrl(filePath)

        return { success: true, publicUrl }
    } catch (e: any) {
        console.error("Upload error:", e)
        return { success: false, message: e.message }
    }
}
