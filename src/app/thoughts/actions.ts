
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitThought(formData: FormData) {
    const content = formData.get('content') as string
    if (!content || content.length < 5) return

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('thoughts').insert({
        content,
        author_id: user.id,
        status: 'pending'
    })

    revalidatePath('/thoughts')
}

export async function toggleLike(thoughtId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Check if liked
    const { data: existing } = await supabase
        .from('thought_likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('thought_id', thoughtId)
        .single()

    if (existing) {
        await supabase.from('thought_likes').delete().eq('user_id', user.id).eq('thought_id', thoughtId)
    } else {
        await supabase.from('thought_likes').insert({ user_id: user.id, thought_id: thoughtId })
    }
    revalidatePath('/thoughts')
}
