/**
 * Cloudflare Worker — GitHub OAuth Token Exchange Proxy
 *
 * Deploy this as a Cloudflare Worker and set the following secrets:
 *   wrangler secret put GITHUB_CLIENT_ID
 *   wrangler secret put GITHUB_CLIENT_SECRET
 *
 * Allowed origins should be set via the ALLOWED_ORIGIN env var.
 */

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });
    }

    try {
      const { code } = await request.json();
      if (!code) {
        return Response.json({ error: 'Missing code parameter' }, { status: 400, headers: corsHeaders });
      }

      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const data = await tokenRes.json();

      if (data.error) {
        return Response.json({ error: data.error_description || data.error }, { status: 400, headers: corsHeaders });
      }

      return Response.json({ access_token: data.access_token }, { headers: corsHeaders });
    } catch (err) {
      return Response.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
    }
  },
};
