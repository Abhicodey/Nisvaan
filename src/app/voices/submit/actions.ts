
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function submitPost(formData: FormData) {
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    // For image upload, we'd handle the file here or ideally upload client-side and pass URL.
    // For this prototype, let's assume client-side upload or just text for now. (or no image)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get author profile ID (which is same as user ID)
    const authorId = user.id

    const { error } = await supabase.from('posts').insert({
        title,
        category,
        content,
        excerpt,
        author_id: authorId,
        status: 'pending' // Enforce pending
    })

    if (error) {
        console.error('Submission error:', error)
        // could return error state
        redirect('/voices/submit?error=Failed to submit post')
    }

    revalidatePath('/dashboard/user')
    redirect('/dashboard/user?success=Post submitted for review')
}
