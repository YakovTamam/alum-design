import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME} - ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          background: "linear-gradient(135deg, #1a1308 0%, #2a1c0c 50%, #1a1308 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: 12,
            color: "#ffffff",
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 32,
            letterSpacing: 4,
            background: "linear-gradient(135deg, #b8882e 0%, #cfa15c 55%, #e8c896 100%)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {SITE_TAGLINE}
        </div>
      </div>
    ),
    { ...size },
  );
}
