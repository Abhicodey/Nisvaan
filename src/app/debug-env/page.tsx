export const dynamic = 'force-dynamic'

export default function DebugEnvPage() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    return (
        <div className="p-8 font-mono text-sm">
            <h1 className="text-xl font-bold mb-4">Environment Check</h1>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded">
                NEXT_PUBLIC_SUPABASE_URL: {url ? "✅ Defined" : "❌ Undefined"} <br />
                NEXT_PUBLIC_SUPABASE_ANON_KEY: {key ? "✅ Defined" : "❌ Undefined"}
            </pre>
        </div>
    )
}
