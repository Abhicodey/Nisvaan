'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const profileSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    age: z.coerce.number().min(13, "You must be at least 13").max(120, "Invalid age").nullable().optional(),
    bio: z.string().max(1000, "Bio must be less than 1000 characters").optional(),
    avatarUrl: z.string().nullable().optional(),
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

    // Prepare data payload
    const profileData: any = {
        name: fullName,
        age: age,
        bio: bio,
    }

    if (avatarUrl) {
        profileData.avatar_url = avatarUrl
    }

    let error
    let updatedProfile

    // STRATEGY: Try UPDATE first. If it fails due to missing row, then INSERT.
    // This avoids race conditions and RLS issues with "Select then Update".

    const { data: updateResult, error: updateError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single()

    if (!updateError) {
        updatedProfile = updateResult
    } else {
        // Check if error is "No rows found" (PGRST116)
        if (updateError.code === 'PGRST116') {
            console.log("Profile not found locally, attempting to create new profile...")

            // Fallback: Create profile
            try {
                // Try Admin Client first (bypasses RLS)
                const adminSupabase = createAdminClient()
                const { data: insertResult, error: insertError } = await adminSupabase
                    .from('profiles')
                    .insert({ id: user.id, ...profileData })
                    .select()
                    .single()

                if (insertError) throw insertError
                updatedProfile = insertResult

            } catch (e: any) {
                console.error("Admin insert failed, falling back to standard client:", e)

                // Fallback to Standard Client
                const { data: retryResult, error: retryError } = await supabase
                    .from('profiles')
                    .insert({ id: user.id, ...profileData })
                    .select()
                    .single()

                if (retryError) {
                    error = retryError
                } else {
                    updatedProfile = retryResult
                }
            }
        } else {
            // Genuine Update Error
            error = updateError
        }
    }

    if (error) {
        console.error("Profile update FAILED. Details:", JSON.stringify(error, null, 2))
        return {
            success: false,
            message: `Update failed: ${error.message || error.code || "Unknown error"}`
        }
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
