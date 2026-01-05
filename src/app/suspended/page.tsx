'use client'

import Link from 'next/link'
import { ShieldAlert, BookOpen } from 'lucide-react'

export default function SuspendedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="max-w-md w-full bg-card border border-destructive/20 rounded-2xl p-8 shadow-2xl text-center space-y-6">
                <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert className="w-10 h-10 text-destructive" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-serif font-bold text-foreground">Account Suspended</h1>
                    <p className="text-muted-foreground">
                        Your access to Nisvaan has been temporarily restricted due to a violation of our community guidelines.
                    </p>
                </div>

                <div className="bg-secondary/50 p-4 rounded-xl text-sm text-left space-y-2">
                    <p className="font-medium text-foreground">What this means:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-1">
                        <li>You cannot post new content.</li>
                        <li>Your existing posts may be hidden.</li>
                        <li>You cannot interact with other members.</li>
                    </ul>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                    <Link
                        href="/stand-for"
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary hover:bg-secondary/80 text-foreground font-medium rounded-xl transition-colors"
                    >
                        <BookOpen className="w-4 h-4" />
                        Review Community Guidelines
                    </Link>

                    <form action="/auth/signout" method="post">
                        <button
                            type="submit"
                            className="w-full px-4 py-3 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl transition-colors"
                        >
                            Log Out
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
