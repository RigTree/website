import { getPublicSetup } from "@/lib/setups";
import { hasSupabaseConfig } from "@/lib/supabase-admin";

export const runtime = "edge";
export const alt = "RigTree Profile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/svg+xml";

export default async function Image({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  let displayName = username;
  let setupTitle = "Hardware Setup";
  let partsCount = 0;

  if (hasSupabaseConfig()) {
    const saved = await getPublicSetup(username);
    if (saved) {
      displayName = saved.profile.display_name;
      setupTitle = saved.setup?.title ?? "Hardware Setup";
      partsCount = saved.parts.length;
    }
  }

  const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="grad1" cx="20%" cy="20%" r="60%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="grad2" cx="80%" cy="80%" r="60%">
      <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#09090b"/>
  <circle cx="200" cy="150" r="400" fill="url(#grad1)"/>
  <circle cx="1000" cy="480" r="400" fill="url(#grad2)"/>
  <g transform="translate(300, 115)">
    <rect width="600" height="400" rx="24" fill="#ffffff" fill-opacity="0.03" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5"/>
    <rect x="260" y="40" width="80" height="80" rx="16" fill="#ffffff" fill-opacity="0.1" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1.5"/>
    <text x="300" y="93" font-family="system-ui, -apple-system, sans-serif" font-size="40" font-weight="bold" fill="#38bdf8" text-anchor="middle">RT</text>
    <text x="300" y="195" font-family="system-ui, -apple-system, sans-serif" font-size="54" font-weight="800" fill="#fafafa" text-anchor="middle">${displayName}</text>
    <text x="300" y="245" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="#a1a1aa" text-anchor="middle">@${username} • ${setupTitle}</text>
    <rect x="180" y="290" width="240" height="48" rx="24" fill="#ffffff" fill-opacity="0.05" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1"/>
    <text x="300" y="322" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#d4d4d8" text-anchor="middle">${partsCount} Hardware Part${partsCount === 1 ? "" : "s"}</text>
  </g>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
