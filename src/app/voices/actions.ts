'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const postSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100),
    excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(300),
    category: z.string().min(1, "Please select a category"),
    content: z.string().min(50, "Content must be at least 50 characters"),
    imageUrl: z.string().optional().nullable(),
})

export async function submitPost(prevState: any, formData: FormData) {
    const rawData = {
        title: formData.get('title'),
        excerpt: formData.get('excerpt'),
        category: formData.get('category'),
        content: formData.get('content'),
        imageUrl: formData.get('imageUrl'),
    }

    const validatedFields = postSchema.safeParse(rawData)

    if (!validatedFields.success) {
        const fieldErrors = validatedFields.error.flatten().fieldErrors
        const errorMsg = Object.entries(fieldErrors)
            .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
            .join(' | ')

        return {
            success: false,
            errors: fieldErrors,
            message: `Validation Failed: ${errorMsg}`
        }
    }

    const { title, excerpt, category, content, imageUrl } = validatedFields.data

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, message: "You must be logged in to submit a post." }
    }

    // CRITICAL FIX: Ensure Profile Exists before inserting Post
    // This prevents "Foreign Key Violation" (insert or update on table "posts" violates foreign key constraint "posts_author_id_fkey")
    const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

    if (!existingProfile) {
        // Fallback: Create missing profile on the fly
        const { error: profileError } = await supabase.from('profiles').insert({
            id: user.id,
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Member',
            role: 'user',
            account_status: 'normal'
        })

        if (profileError) {
            console.error("Auto-create profile failed:", profileError)
            return { success: false, message: "Account setup failed: " + profileError.message }
        }
    }

    // Insert new post - PUBLISH FIRST
    const { error } = await supabase.from('posts').insert({
        title,
        excerpt,
        category,
        content,
        image_url: imageUrl,
        author_id: user.id,
        moderation_state: 'normal' // Explicitly set to visible
    })

    if (error) {
        console.error("Submit Post Error:", error)
        return { success: false, message: error.message || "Failed to submit post." }
    }

    revalidatePath('/voices')
    return { success: true, message: "Voice published successfully!" }
}

export async function uploadPostImage(formData: FormData) {
    const file = formData.get('file') as File
    if (!file) return { success: false, message: "No file provided" }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, message: "Unauthorized" }

    try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        const adminSupabase = createAdminClient()
        const { error: uploadError } = await adminSupabase.storage
            .from('blog-images')
            .upload(filePath, file, {
                contentType: file.type,
                upsert: true
            })

        if (uploadError) {
            console.error("Storage upload failed:", uploadError)
            return { success: false, message: "Upload failed: " + uploadError.message }
        }

        const { data: { publicUrl } } = adminSupabase.storage
            .from('blog-images')
            .getPublicUrl(filePath)

        return { success: true, publicUrl }
    } catch (e: any) {
        console.error("Upload error:", e)
        return { success: false, message: e.message }
    }
}

export async function toggleLike(postId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, message: "Login to like" }

    // Check if liked
    const { data: existingLike } = await supabase
        .from('voice_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single()

    if (existingLike) {
        await supabase.from('voice_likes').delete().eq('id', existingLike.id)
        revalidatePath(`/voices`)
        return { success: true, liked: false }
    } else {
        await supabase.from('voice_likes').insert({ post_id: postId, user_id: user.id })
        revalidatePath(`/voices`)
        return { success: true, liked: true }
    }
}

export async function reportPost(postId: string, reason: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { success: false, message: "Login to report" }

        // Insert Report
        const { error } = await supabase.from('reports').insert({
            post_id: postId,
            reported_by: user.id,
            reason: reason as any
        })

        if (error) {
            if (error.code === '23505') return { success: false, message: "You have already reported this post." }
            console.error("Report Error:", error)
            return { success: false, message: `Report Failed: ${error.message} (${error.code})` }
        }

        // Auto-Surveillance: Check count
        // Uses Admin Client to update moderation_state if needed (bypass RLS which limits user updates)
        const adminSupabase = createAdminClient()

        // Count unique reports
        const { count } = await adminSupabase
            .from('reports')
            .select('id', { count: 'exact', head: true })
            .eq('post_id', postId)

        if (count && count >= 3) {
            await adminSupabase
                .from('posts')
                .update({ moderation_state: 'under_review', is_hidden: true }) // Auto-hide
                .eq('id', postId)

            // Notify President (Optional implementation later)
        }

        revalidatePath('/voices')
        return { success: true, message: "Report submitted. Thank you for helping keep Nisvaan safe." }
    } catch (e: any) {
        console.error("Critical Report Action Failure:", e)
        return { success: false, message: `System Error: ${e.message}` }
    }
}

export async function restorePost(postId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, message: "Unauthorized" }

    // Check President Role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'president') return { success: false, message: "Restricted to President" }

    // Clear reports so users can report again if needed (Reset Cycle)
    await supabase.from('reports').delete().eq('post_id', postId)

    const { error } = await supabase
        .from('posts')
        .update({ moderation_state: 'normal' })
        .eq('id', postId)

    if (error) return { success: false, message: "Failed to restore." }

    revalidatePath('/voices')
    revalidatePath('/dashboard/president')
    return { success: true, message: "Voice restored and reports cleared." }
}

export async function removePost(postId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, message: "Unauthorized" }

    // Fetch Post to check Author and get Image URL
    const { data: post } = await supabase.from('posts').select('author_id, image_url').eq('id', postId).single()
    if (!post) return { success: false, message: "Post not found." }

    // Check Permissions (President OR Author)
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const isPresident = profile?.role === 'president'
    const isAuthor = post.author_id === user.id

    if (!isPresident && !isAuthor) {
        return { success: false, message: "Unauthorized." }
    }

    // [NEW] Storage Cleanup
    if (post.image_url) {
        const parts = post.image_url.split('/blog-images/')
        const filePath = parts.length > 1 ? parts[1] : null

        if (filePath) {
            const adminSupabase = createAdminClient() // Use admin client for storage delete if needed
            const { error: storageError } = await adminSupabase.storage.from('blog-images').remove([filePath])
            if (storageError) console.error("Storage cleanup failed:", storageError)
        }
    }

    // [NEW] Hard Delete
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

    if (error) return { success: false, message: "Failed to delete post." }

    revalidatePath('/voices')
    revalidatePath('/dashboard/president')
    revalidatePath('/dashboard/media') // Also update media dashboard just in case
    return { success: true, message: "Voice permanently deleted." }
}
