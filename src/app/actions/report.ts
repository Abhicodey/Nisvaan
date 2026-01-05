
'use server'

import { createClient } from '@/utils/supabase/server'

export async function reportContent(prevState: any, formData: FormData) {
    const targetId = formData.get('targetId') as string
    const targetType = formData.get('targetType') as string
    const reason = formData.get('reason') as string
    const notes = formData.get('notes') as string

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { message: 'Must be logged in' }

    const { error } = await supabase.from('reports').insert({
        reporter_id: user.id,
        target_id: targetId,
        target_type: targetType,
        reason: reason + (notes ? `: ${notes}` : ''),
        status: 'pending'
    })

    if (error) {
        console.error('Report error:', error)
        return { message: 'Failed to submit report' }
    }

    // Auto-hide logic check (optional, can be DB trigger)
    // For now we just insert.

    return { message: 'Report submitted. Thank you for keeping the community safe.', success: true }
}
