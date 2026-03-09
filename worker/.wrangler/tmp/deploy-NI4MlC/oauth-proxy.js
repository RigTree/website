// oauth-proxy.js
var SESSION_TTL = 600;
var oauth_proxy_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (url.pathname === "/session" && request.method === "POST") {
      const id = crypto.randomUUID().slice(0, 8);
      await env.SESSIONS.put(
        `session:${id}`,
        JSON.stringify({ status: "waiting" }),
        { expirationTtl: SESSION_TTL }
      );
      return Response.json({ session_id: id }, { headers: corsHeaders });
    }
    const sessionMatch = url.pathname.match(/^\/session\/([\w-]+)$/);
    if (sessionMatch) {
      const id = sessionMatch[1];
      if (request.method === "GET") {
        const raw = await env.SESSIONS.get(`session:${id}`);
        if (!raw) {
          return Response.json(
            { error: "Session not found or expired" },
            { status: 404, headers: corsHeaders }
          );
        }
        return new Response(raw, {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      if (request.method === "POST") {
        const raw = await env.SESSIONS.get(`session:${id}`);
        if (!raw) {
          return Response.json(
            { error: "Session not found or expired" },
            { status: 404, headers: corsHeaders }
          );
        }
        try {
          const body = await request.json();
          await env.SESSIONS.put(
            `session:${id}`,
            JSON.stringify({ status: "received", data: body }),
            { expirationTtl: SESSION_TTL }
          );
          return Response.json({ success: true }, { headers: corsHeaders });
        } catch {
          return Response.json(
            { error: "Invalid JSON body" },
            { status: 400, headers: corsHeaders }
          );
        }
      }
    }
    if (request.method !== "POST") {
      return Response.json(
        { error: "Not found" },
        { status: 404, headers: corsHeaders }
      );
    }
    try {
      const { code } = await request.json();
      if (!code) {
        return Response.json(
          { error: "Missing code parameter" },
          { status: 400, headers: corsHeaders }
        );
      }
      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code
        })
      });
      const data = await tokenRes.json();
      if (data.error) {
        return Response.json(
          { error: data.error_description || data.error },
          { status: 400, headers: corsHeaders }
        );
      }
      return Response.json(
        { access_token: data.access_token },
        { headers: corsHeaders }
      );
    } catch {
      return Response.json(
        { error: "Internal server error" },
        { status: 500, headers: corsHeaders }
      );
    }
  }
};
export {
  oauth_proxy_default as default
};
//# sourceMappingURL=oauth-proxy.js.map
