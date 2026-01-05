import { createClient } from '@/lib/supabase/server'

export async function getEvents() {
    const supabase: any = await createClient()

    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .gte('date', new Date().toISOString()) // Future events only by default?
        .order('date', { ascending: true })

    if (error) {
        console.error("Error fetching events:", error)
        return []
    }
    return data
}

export async function registerForEvent(eventId: string) {
    const supabase: any = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
        .from('event_registrations')
        .insert({
            event_id: eventId,
            user_id: user.id
        })

    if (error) {
        if (error.code === '23505') return false // Already registered
        throw error
    }
    return true
}
