import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: "#321357",
          border: "3px solid #D4A72C",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#D4A72C",
          fontSize: 34,
          fontWeight: 700,
          fontFamily: "serif",
        }}
      >
        T
      </div>
    ),
    { ...size },
  );
}
