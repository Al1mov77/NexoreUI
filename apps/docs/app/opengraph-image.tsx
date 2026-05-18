import { ImageResponse } from "next/og"

export const runtime = "edge"
export const size = { width: 1200, height: 630 }

export default function OGImage() {
  return new ImageResponse(
    <div style={{ background: "#09090b", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ fontSize: 80, fontWeight: 700, color: "white" }}>NexoreUI</div>
      <div style={{ fontSize: 32, color: "#a1a1aa", marginTop: 20 }}>Beautiful React Components</div>
    </div>
  )
}
