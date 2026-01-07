'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export default function TestConnectionPage() {
    const [status, setStatus] = useState<string>('Testing...')
    const [envCheck, setEnvCheck] = useState<any>({})
    const [queryResult, setQueryResult] = useState<any>(null)

    useEffect(() => {
        const testSupabase = async () => {
            const envs = {
                url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Defined' : 'MISSING',
                key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Defined' : 'MISSING'
            }
            setEnvCheck(envs)

            if (envs.url === 'MISSING' || envs.key === 'MISSING') {
                setStatus('FAILED: Missing Environment Variables')
                return
            }

            try {
                const supabase = createClient()

                // 1. Test basic connectivity via Auth (usually strictly public/safe)
                const { data: authData, error: authError } = await supabase.auth.getSession()

                if (authError) {
                    throw new Error(`Auth Check Failed: ${authError.message}`)
                }

                // 2. Test Data Access (Read Events - usually public)
                const { data: tableData, error: tableError } = await supabase
                    .from('events')
                    .select('count')
                    .limit(1)

                if (tableError) {
                    // Ignore 406 for count, but real errors matter. 
                    // If code is 'PGRST116' it often means result format, but basic select should work.
                    // Actually, let's just do a simple select
                    console.log("Table check error (might be RLS):", tableError)
                }

                setQueryResult({
                    auth: 'OK',
                    table: tableError ? `Error: ${tableError.message}` : 'OK (Read success)',
                    session: authData.session ? 'Active Session' : 'No Session'
                })

                setStatus('SUCCESS: Connected to Supabase')

            } catch (e: any) {
                console.error(e)
                setStatus(`FAILED: ${e.message}`)
            }
        }

        testSupabase()
    }, [])

    return (
        <div className="p-8 max-w-2xl mx-auto font-mono text-sm">
            <h1 className="text-xl font-bold mb-4">Supabase Connection Test</h1>

            <div className={`p-4 rounded-lg mb-6 ${status.startsWith('SUCCESS') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {status}
            </div>

            <div className="space-y-4">
                <div className="border p-4 rounded">
                    <h2 className="font-bold mb-2">Environment Variables</h2>
                    <pre>{JSON.stringify(envCheck, null, 2)}</pre>
                </div>

                {queryResult && (
                    <div className="border p-4 rounded">
                        <h2 className="font-bold mb-2">Connectivity Details</h2>
                        <pre>{JSON.stringify(queryResult, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    )
}
