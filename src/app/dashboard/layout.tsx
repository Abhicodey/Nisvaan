
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // We could fetch the role here to do strict RBAC redirecting (e.g. if user matches strict paths), 
    // but individual page components often handle their specific logic best. 
    // However, for /dashboard root, we might want to redirect.
    // For now, this layout just ensures "Authenticated".

    return (
        <div className="min-h-screen bg-background pt-8 pb-16">
            {/* We can add a dashboard-specific sidebar or sub-nav here if desired */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </div>
    )
}
