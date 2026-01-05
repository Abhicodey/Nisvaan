import { createClient } from '@/lib/supabase/server'

export async function getNotifications() {
    const supabase: any = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

    if (error) {
        console.error("Error fetching notifications:", error)
        return []
    }
    return data
}

export async function markNotificationRead(notificationId: string) {
    const supabase: any = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id) // Security: only own notifications

    if (error) throw error
    return true
}

export async function submitFeedback(message: string) {
    const supabase: any = await createClient()

    // Feedback can be anonymous or authenticated, usually.
    // The table schema doesn't specify a user_id foreign key request, 
    // but we can log it if we wanted. Schema says only 'message' and 'created_at'.

    const { error } = await supabase
        .from('feedback')
        .insert({ message })

    if (error) throw error
    return true
}
