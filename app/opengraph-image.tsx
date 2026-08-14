import { ImageResponse } from "next/og";

export const alt =
  "BuildWise AI - an AI-powered backend mentor for beginner developers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#151419";
const BORDER = "#2e2e33";
const TEXT = "#fbfbfb";
const MUTED = "#a6a6ad";
const ACCENT = "#f56e0f";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: "72px 80px",
        }}
      >
        {/* Wordmark, using the same three-bar mark as the app */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ width: 44, height: 10, borderRadius: 3, background: ACCENT }} />
            <div style={{ width: 44, height: 10, borderRadius: 3, background: MUTED }} />
            <div style={{ width: 29, height: 10, borderRadius: 3, background: BORDER }} />
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, color: TEXT, letterSpacing: -0.5 }}>
            BuildWise AI
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              fontSize: 82,
              fontWeight: 700,
              color: TEXT,
              letterSpacing: -2.5,
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            Plan your backend with confidence
          </div>
          <div style={{ fontSize: 30, color: MUTED, lineHeight: 1.4, maxWidth: 820 }}>
            Turn your project idea into a structured backend plan, and understand
            the reasoning behind every recommendation.
          </div>
        </div>

        {/* The differentiator, stated plainly */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              borderRadius: 999,
              background: "rgba(245,110,15,0.12)",
              border: `1px solid rgba(245,110,15,0.35)`,
              color: ACCENT,
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            Two ways to build it
          </div>
          <div style={{ fontSize: 24, color: MUTED }}>
            with the trade-offs explained
          </div>
        </div>
      </div>
    ),
    size,
  );
}
