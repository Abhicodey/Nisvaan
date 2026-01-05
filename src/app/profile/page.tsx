import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    // Fetch profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    console.log("SERVER PROFILE FETCH:", profile)

    // Pass user email separately as it's from Auth
    const userEmail = user.email

    return <ProfileForm profile={profile} userEmail={userEmail} />
}
