
"use client"

import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"

export default function ConnectionTest() {
    const [status, setStatus] = useState<string>("Testing connection...")
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function check() {
            try {
                const supabase = createClient()
                // Try to fetch something simple. If auth works, getUser is fine.
                // Or fetch a public table if exists.
                const { data, error } = await supabase.from('posts').select('count', { count: 'exact', head: true })

                if (error) {
                    setError(error.message)
                    setStatus("Connected to Supabase, but query failed (Expected if table is empty or RLS blocks). Error details below.")
                } else {
                    setStatus("✅ SUCCESS: Connected to Supabase perfectly!")
                }
            } catch (e: any) {
                setError(e.message)
                setStatus("❌ FAILURE: Client could not initialize or reach URL.")
            }
        }
        check()
    }, [])

    return (
        <div className="p-8 font-mono">
            <h1 className="text-xl font-bold mb-4">Supabase Connection Test</h1>
            <div className={`p-4 rounded border ${error ? 'bg-red-100 border-red-300 text-red-800' : 'bg-green-100 border-green-300 text-green-800'}`}>
                {status}
            </div>
            {error && (
                <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
                    {JSON.stringify(error, null, 2)}
                </pre>
            )}

            <div className="mt-8 text-sm text-gray-500">
                <p>Configured URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
                <p>Anon Key Loaded: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Yes' : 'No'}</p>
                <p>Key Prefix: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10)}...</p>
            </div>
        </div>
    )
}
