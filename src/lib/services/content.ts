import { createClient } from '@/lib/supabase/server'

export async function getThoughtFeed() {
    const supabase: any = await createClient()

    // Joins thoughts with author (profiles)
    const { data, error } = await supabase
        .from('thoughts')
        .select(`
      *,
      author:profiles(*)
    `)
        .order('created_at', { ascending: false })
        .limit(20)

    if (error) {
        console.error("Error fetching thoughts:", error)
        return []
    }
    return data
}

export async function createThought(content: string) {
    const supabase: any = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('thoughts')
        .insert({
            content,
            author_id: user.id,
            status: 'published'
        })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function likeThought(thoughtId: string) {
    const supabase: any = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
        .from('thought_likes')
        .insert({
            thought_id: thoughtId,
            user_id: user.id
        })

    if (error) {
        if (error.code === '23505') { // Unique violation (already liked)
            return false
        }
        throw error
    }
    return true
}

export async function getApprovedPosts() {
    const supabase: any = await createClient()

    const { data, error } = await supabase
        .from('posts')
        .select(`
        *,
        approved_by:profiles(*)
    `)
        .eq('status', 'published')
        .eq('moderation_status', 'approved')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}
