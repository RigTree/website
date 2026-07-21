import { ImageResponse } from "next/og";
import { getPublicSetup } from "@/lib/setups";
import { hasSupabaseConfig } from "@/lib/supabase-admin";

export const runtime = "edge";
export const alt = "RigTree Profile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b", // background
          color: "#fafafa", // foreground
          position: "relative",
        }}
      >
        {/* Ambient orbs */}
        <div
          style={{
            position: "absolute",
            left: "-10%",
            top: "-10%",
            width: "800px",
            height: "800px",
            background: "radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(0,0,0,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "-10%",
            bottom: "-10%",
            width: "800px",
            height: "800px",
            background: "radial-gradient(circle, rgba(167,139,250,0.15) 0%, rgba(0,0,0,0) 70%)",
          }}
        />

        {/* Profile Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "24px",
            padding: "48px 64px",
            background: "rgba(255, 255, 255, 0.03)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.1)",
              marginBottom: "24px",
              fontSize: "40px",
              fontWeight: "bold",
              color: "#38bdf8", // sky-400
            }}
          >
            RT
          </div>
          
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "800",
              margin: "0 0 16px 0",
              letterSpacing: "-0.02em",
            }}
          >
            {displayName}
          </h1>
          
          <p
            style={{
              fontSize: "32px",
              color: "rgba(255, 255, 255, 0.6)",
              margin: "0 0 32px 0",
            }}
          >
            @{username} • {setupTitle}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 24px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "9999px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <span style={{ fontSize: "24px", color: "rgba(255, 255, 255, 0.7)" }}>
              {partsCount} Hardware Part{partsCount === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
