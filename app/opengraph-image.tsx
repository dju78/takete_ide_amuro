import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "linear-gradient(135deg, #321357 0%, #4a2178 60%, #a9840f 100%)",
          color: "#FFF9EF",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700 }}>Takete-Ide Amuro</div>
        <div style={{ fontSize: 32, color: "#D4A72C", marginTop: 16, letterSpacing: 4 }}>
          HERITAGE &bull; UNITY &bull; PROGRESS
        </div>
      </div>
    ),
    { ...size },
  );
}
