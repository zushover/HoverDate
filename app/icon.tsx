import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fda4af, #f472b6, #fb7185)",
          borderRadius: "50%",
          fontSize: 22,
          fontWeight: 900,
          color: "white",
        }}
      >
        H
      </div>
    ),
    { ...size }
  );
}
