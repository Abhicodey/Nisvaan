
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient as createAdminClient } from '@supabase/supabase-js'

import { createClient } from '@/utils/supabase/server'

async function isBanned(email: string) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) return false // Fail open if config missing? Or fail closed? 
    // If key is missing, we can't check, so we assume not banned to prevent bricking the app.

    const adminClient = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
        auth: { persistSession: false }
    })
    const { data } = await adminClient.from('banned_emails').select('email').eq('email', email).single()
    return !!data
}

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (await isBanned(email)) {
        return { success: false, error: "This account has been permanently banned due to violations of our policies." }
    }

    const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { success: false, error: error.message }
    }

    if (user) {
        // Check Suspension Status
        const { data: profile } = await supabase
            .from('profiles')
            .select('account_status, timeout_until')
            .eq('id', user.id)
            .single()

        if (profile) {
            const isTimedOut = profile.timeout_until && new Date(profile.timeout_until) > new Date()
            const isPermanentlySuspended = profile.account_status === 'suspended' && !profile.timeout_until

            if (isPermanentlySuspended || isTimedOut) {
                await supabase.auth.signOut()

                if (isTimedOut) {
                    const until = new Date(profile.timeout_until).toLocaleString()
                    return { success: false, error: `Account timed out until ${until}.` }
                }
                return { success: false, error: "Account suspended. Contact administration." }
            }
        }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const age = formData.get('age') as string

    // Check Ban
    if (await isBanned(email)) {
        return { success: false, error: "This email is permanently prohibited from creating an account." }
    }

    // 1. Sign Up
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name: fullName,
                age: parseInt(age),
            }
        }
    })

    if (error) {
        console.error("Signup auth error:", error)
        return { success: false, error: error.message }
    }

    // 2. Manual Backup: Insert Profile if trigger failed
    // We try this just to be absolutely sure the profile exists
    if (data.user) {
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: data.user.id,
                name: fullName,
                age: parseInt(age),
                role: 'user', // Default
            })

        if (profileError) {
            console.error("Manual profile creation failed:", profileError)
            // We don't fail the whole request because the trigger might have worked, 
            // or RLS might be blocking update but insert worked.
        }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}
