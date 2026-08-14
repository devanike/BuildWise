import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          gap: 16,
          background: "#151419",
        }}
      >
        <div style={{ width: 112, height: 26, borderRadius: 8, background: "#f56e0f" }} />
        <div style={{ width: 112, height: 26, borderRadius: 8, background: "#a6a6ad" }} />
        <div style={{ width: 74, height: 26, borderRadius: 8, background: "#4a4a52" }} />
      </div>
    ),
    size,
  );
}
