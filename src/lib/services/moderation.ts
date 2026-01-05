import { createClient } from '@/lib/supabase/server'

export async function reportContent(
    targetType: 'post' | 'thought' | 'profile' | 'comment',
    targetId: string,
    reason: string
) {
    const supabase: any = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
        .from('reports')
        .insert({
            target_type: targetType,
            target_id: targetId,
            reported_by: user.id,
            reason: reason
        })

    if (error) throw error
    return true
}
