import { ImageResponse } from "next/og";

// 1200 x 630 — standard OG / Twitter summary_large_image size
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "DJS CodeAI — AI & ML Club of DJ Sanghvi College of Engineering, Mumbai";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          background:
            "radial-gradient(circle at 20% 20%, #1a1b21 0%, #08090C 55%, #000000 100%)",
          color: "#F6F7FB",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row — brand label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#EEF0F6",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "#EEF0F6",
              boxShadow: "0 0 24px #EEF0F6",
            }}
          />
          DJ Sanghvi College of Engineering
        </div>

        {/* Headline — chrome gradient */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 200,
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: -6,
              textTransform: "uppercase",
              backgroundImage:
                "linear-gradient(135deg, #41434D 0%, #C3C7D4 25%, #F6F7FB 50%, #C3C7D4 75%, #41434D 100%)",
              backgroundClip: "text",
              color: "transparent",
              display: "flex",
            }}
          >
            DJS CodeAI
          </div>
          <div
            style={{
              fontSize: 36,
              color: "#CFD2DB",
              lineHeight: 1.3,
              maxWidth: 900,
              display: "flex",
            }}
          >
            The AI &amp; ML club fostering innovation through hands-on projects,
            hackathons, and mentorship.
          </div>
        </div>

        {/* Bottom row — domain + tagline */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "#7F8391",
          }}
        >
          <div style={{ display: "flex", color: "#F6F7FB" }}>djscodeai.in</div>
          <div
            style={{
              display: "flex",
              gap: 16,
              letterSpacing: 3,
              textTransform: "uppercase",
              fontSize: 20,
            }}
          >
            Learn · Create · Innovate
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
