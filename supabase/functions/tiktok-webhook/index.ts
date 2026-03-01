import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
    const { method } = req

    if (method === 'POST') {
        const body = await req.json()
        // Process TikTok specific events

        return new Response(JSON.stringify({ status: 'ok' }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        })
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        headers: { "Content-Type": "application/json" },
        status: 405,
    })
})
