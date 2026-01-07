import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Manual Profile Creation (Self-Healing)
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('id')
                        .eq('id', user.id)
                        .single()

                    if (!profile) {
                        const metadata = user.user_metadata
                        const name = metadata.name || metadata.full_name || user.email?.split('@')[0] || 'User'
                        const avatarUrl = metadata.avatar_url || metadata.picture || null

                        // Try normal upsert first to handle race conditions or existing rows
                        const { error: insertError } = await supabase.from('profiles').upsert({
                            id: user.id,
                            name: name,
                            email: user.email,
                            avatar_url: avatarUrl,
                            role: 'user',
                            status: 'active'
                        })

                        if (insertError) {
                            // If normal upsert fails (e.g. RLS), try admin
                            // Verify user is still defined (TS check)
                            if (user) {
                                try {
                                    // Dynamically import to avoid circular dependencies
                                    const { createAdminClient } = await import('@/utils/supabase/server')
                                    const adminSupabase = createAdminClient()
                                    await adminSupabase.from('profiles').upsert({
                                        id: user.id,
                                        name: name,
                                        email: user.email,
                                        avatar_url: avatarUrl,
                                        role: 'user',
                                        status: 'active'
                                    })
                                } catch (adminErr) {
                                    console.error("Admin profile creation failed:", adminErr)
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                console.error("Profile check failed:", e)
            }

            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                // we can be sure that is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
