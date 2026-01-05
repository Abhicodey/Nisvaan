
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/login') &&
        !request.nextUrl.pathname.startsWith('/auth')
    ) {
        // no user, potentially redirect to login
        // url.pathname = '/login'
        // return NextResponse.redirect(url)
    }

    if (user) {
        // Enforce Suspension / Timeout
        const { data: profile } = await supabase
            .from('profiles')
            .select('account_status, timeout_until')
            .eq('id', user.id)
            .single()

        if (profile) {
            const isTimedOut = profile.timeout_until && new Date(profile.timeout_until) > new Date()
            // If timeout exists, we ignore 'suspended' status and check date. 
            // If timeout is null, we check if 'suspended'.
            const isPermanentlySuspended = profile.account_status === 'suspended' && !profile.timeout_until

            if ((isPermanentlySuspended || isTimedOut) && !request.nextUrl.pathname.startsWith('/suspended')) {
                const url = request.nextUrl.clone()
                url.pathname = '/suspended'
                return NextResponse.redirect(url)
            }

            // Redirect away from /suspended if NO LONGER suspended
            if (!isPermanentlySuspended && !isTimedOut && request.nextUrl.pathname.startsWith('/suspended')) {
                const url = request.nextUrl.clone()
                url.pathname = '/'
                return NextResponse.redirect(url)
            }
        }
    }

    return supabaseResponse
}
