import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";

// Generate at request-time — avoids a Windows-local build prerender bug in
// @vercel/og; on Vercel it renders on-demand and is cached.
export const dynamic = "force-dynamic";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 90px",
          background:
            "radial-gradient(ellipse at 70% 30%, #0c1226 0%, #070a18 45%, #020308 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* glow orb */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(90,169,255,0.35) 0%, rgba(255,106,61,0.12) 50%, transparent 72%)",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#8aa0c0",
            marginBottom: 28,
          }}
        >
          <div style={{ width: 46, height: 2, background: "#5aa9ff", display: "flex" }} />
          AI Engineer · Researcher
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 132,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: -4,
            color: "#7cc0ff",
          }}
        >
          PRASIDDHA
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 46,
            fontWeight: 300,
            color: "rgba(255,255,255,0.82)",
            marginTop: 14,
          }}
        >
          {profile.role}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#9fb0c8",
            marginTop: 40,
            maxWidth: 820,
          }}
        >
          Building NLP systems for low-resource Nepali · RAG · LLaMA · PyTorch
        </div>
      </div>
    ),
    { ...size }
  );
}
