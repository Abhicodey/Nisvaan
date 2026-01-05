'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

/**
 * Suspend a user (Legacy/Simple Suspend)
 * Sets account_status to 'suspended' without specific timeout
 */
// ... imports

const ORIGINAL_PRESIDENT_EMAIL = "nisvaanthegenderdialogueofbhu@gmail.com"

/**
 * Suspend a user (Legacy/Simple Suspend)
 */
export async function suspendUser(userId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Authorization Check
    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
    if (adminProfile?.role !== 'president') {
        return { success: false, message: "Unauthorized. President access required." }
    }

    // Protection Check
    const { data: target } = await supabase.from('profiles').select('email').eq('id', userId).single()
    if (target?.email === ORIGINAL_PRESIDENT_EMAIL) {
        return { success: false, message: "Action Denied: The Original President cannot be modified." }
    }

    const { error } = await supabase
        .from('profiles')
        .update({ account_status: 'suspended', timeout_until: null })
        .eq('id', userId)

    if (error) return { success: false, message: error.message }

    revalidatePath('/dashboard/president')
    return { success: true, message: "User suspended." }
}

/**
 * Timeout (Mask) a user
 */
export async function timeoutUser(userId: string, minutes: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Authorization Check
    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
    if (adminProfile?.role !== 'president') {
        return { success: false, message: "Unauthorized. President access required." }
    }

    // Protection Check
    const { data: target } = await supabase.from('profiles').select('email').eq('id', userId).single()
    if (target?.email === ORIGINAL_PRESIDENT_EMAIL) {
        return { success: false, message: "Action Denied: The Original President cannot be modified." }
    }

    const timeoutDate = new Date(Date.now() + minutes * 60000).toISOString()

    const { error } = await supabase
        .from('profiles')
        .update({ timeout_until: timeoutDate, account_status: 'suspended' })
        .eq('id', userId)

    if (error) return { success: false, message: error.message }

    revalidatePath('/dashboard/president')
    return { success: true, message: `User masked for ${minutes} minutes.` }
}

/**
 * Restore a user
 */
export async function restoreUser(userId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Authorization Check
    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
    if (adminProfile?.role !== 'president') {
        return { success: false, message: "Unauthorized. President access required." }
    }

    // Protection Check (Though restoring is usually fine, we keep consistency)
    const { data: target } = await supabase.from('profiles').select('email').eq('id', userId).single()
    if (target?.email === ORIGINAL_PRESIDENT_EMAIL) {
        // It shouldn't be suspended anyway, but let's allow restore if it miraculously was? 
        // Actually, if it's protected, it can't be suspended. So restore is redundant or fixing a bug.
        // Let's safe guard it to be sure no state changes happen via this route.
        // Wait, if manual DB edit suspended it, we might WANT to restore.
        // But the user said "cannot be modified". I will block it for consistency, 
        // assuming Developer fixes DB directly if needed.
        return { success: false, message: "Action Denied: The Original President cannot be modified." }
    }

    const { error } = await supabase
        .from('profiles')
        .update({ account_status: 'normal', timeout_until: null })
        .eq('id', userId)

    if (error) return { success: false, message: error.message }

    revalidatePath('/dashboard/president')
    return { success: true, message: "User account restored." }
}

/**
 * PERMANENTLY Delete a User
 */
export async function deleteUser(targetUserId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Authorization Check
    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
    if (adminProfile?.role !== 'president') {
        return { success: false, message: "Unauthorized. President access required." }
    }

    // Protection Check
    const { data: target } = await supabase.from('profiles').select('email').eq('id', targetUserId).single()
    if (target?.email === ORIGINAL_PRESIDENT_EMAIL) {
        return { success: false, message: "Action Denied: The Original President CANNOT be deleted." }
    }

    // Use Service Role to delete from Auth
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) {
        return { success: false, message: "Server configuration error: Missing Service Key." }
    }

    const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Ban Email
    // Fetch email if we didn't get it from profile check (we did)
    const targetEmail = target?.email

    if (targetEmail) {
        const { error: banError } = await supabaseAdmin
            .from('banned_emails')
            .insert({
                email: targetEmail,
                reason: 'Permanently Banned by Admin',
                banned_by: user.id
            })
        if (banError) {
            console.error("Failed to ban email:", banError)
        }
    }

    // Delete from Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(targetUserId)

    if (authError) {
        console.error("Auth delete error:", authError)
        return { success: false, message: `Auth error: ${authError.message}` }
    }

    // Explicitly delete profile (if no cascade)
    await supabaseAdmin.from('profiles').delete().eq('id', targetUserId)

    revalidatePath('/dashboard/president')
    return { success: true, message: "User permanently deleted and email banned." }
}

/**
 * Toggle Event Visibility (Hide/Unhide)
 */
export async function toggleEventVisibility(eventId: string, isHidden: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // ... existing logic ...
    // Authorization Check
    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
    if (!adminProfile || (adminProfile.role !== 'president' && adminProfile.role !== 'media_manager')) {
        return { success: false, message: "Unauthorized." }
    }

    const { error } = await supabase
        .from('events')
        .update({ is_hidden: isHidden })
        .eq('id', eventId)

    if (error) return { success: false, message: "Failed to update visibility." }

    revalidatePath('/events')
    revalidatePath('/dashboard/president')
    revalidatePath('/dashboard/media')
    return { success: true, message: isHidden ? "Event hidden from public." : "Event is now visible." }
}

/**
 * Toggle Voice Visibility (Hide/Unhide)
 */
export async function toggleVoiceVisibility(postId: string, isHidden: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Authorization Check
    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
    if (!adminProfile || (adminProfile.role !== 'president' && adminProfile.role !== 'media_manager')) {
        return { success: false, message: "Unauthorized." }
    }

    const { error } = await supabase
        .from('posts')
        .update({ is_hidden: isHidden })
        .eq('id', postId)

    if (error) return { success: false, message: "Failed to update visibility: " + error.message }

    revalidatePath('/voices')
    revalidatePath('/dashboard/president')
    revalidatePath('/dashboard/media')
    return { success: true, message: isHidden ? "Voice hidden from public." : "Voice is now visible." }
}

/**
 * Delete an Event
 */
export async function deleteEvent(eventId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Authorization Check
    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
    if (!adminProfile || (adminProfile.role !== 'president' && adminProfile.role !== 'media_manager')) {
        return { success: false, message: "Unauthorized." }
    }

    // Storage Cleanup
    const { data: eventData } = await supabase.from('events').select('image_urls').eq('id', eventId).single()

    if (eventData?.image_urls && eventData.image_urls.length > 0) {
        // Extract paths from URLs
        const pathsToDelete = eventData.image_urls.map((url: string) => {
            // URL format: .../storage/v1/object/public/event-media/filename.ext
            // We need just 'filename.ext'
            const parts = url.split('/event-media/')
            return parts.length > 1 ? parts[1] : null
        }).filter(Boolean) as string[]

        if (pathsToDelete.length > 0) {
            const { error: storageError } = await supabase.storage.from('event-media').remove(pathsToDelete)
            if (storageError) console.error("Storage cleanup failed:", storageError)
        }
    }

    const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

    if (error) return { success: false, message: "Failed to delete event." }

    revalidatePath('/dashboard/president')
    revalidatePath('/dashboard/media')
    return { success: true, message: "Event and files deleted." }
}

/**
 * Update User Role
 */
export async function updateUserRole(targetUserId: string, newRole: 'president' | 'media_manager' | 'user') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, message: "Not authenticated" }

    // 1. Authorization Check (Requester must be President)
    const { data: adminProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (adminProfile?.role !== 'president') {
        return { success: false, message: "Unauthorized. President access required." }
    }

    // 2. Fetch Target User to check for "Original President" status
    const { data: targetProfile } = await supabase
        .from('profiles')
        .select('email, role')
        .eq('id', targetUserId)
        .single()

    if (!targetProfile) return { success: false, message: "User not found." }

    // CRITICAL: Protect the Original President
    if (targetProfile.email === ORIGINAL_PRESIDENT_EMAIL) {
        return { success: false, message: "Action Denied: The Original President cannot be modified." }
    }

    // 3. Update Role
    const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', targetUserId)

    if (error) return { success: false, message: error.message }

    revalidatePath('/dashboard/president')
    return { success: true, message: `User role updated to ${newRole}.` }
}
