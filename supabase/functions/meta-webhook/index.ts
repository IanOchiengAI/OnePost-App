import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
    const { method } = req

    // Meta Webhook Verification (GET)
    if (method === 'GET') {
        const url = new URL(req.url)
        const mode = url.searchParams.get('hub.mode')
        const token = url.searchParams.get('hub.verify_token')
        const challenge = url.searchParams.get('hub.challenge')

        if (mode && token) {
            if (mode === 'subscribe' && token === 'MY_VERIFY_TOKEN') {
                return new Response(challenge, { status: 200 })
            } else {
                return new Response(null, { status: 403 })
            }
        }
    }

    // Meta Event Handling (POST)
    if (method === 'POST') {
        const body = await req.json()
        // Process post status updates (Success/Failure)

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
