import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "4px",
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Bar */}
          <path
            d="M4 5C4 4.44772 4.44772 4 5 4H7C7.55228 4 8 4.44772 8 5V19C8 19.5523 7.55228 20 7 20H5C4.44772 20 4 19.5523 4 19V5Z"
            fill="#ffffff"
          />
          {/* Right Bar */}
          <path
            d="M16 5C16 4.44772 16.4477 4 17 4H19C19.5523 4 20 4.44772 20 5V19C20 19.5523 19.5523 20 19 20H17C16.4477 20 16 19.5523 16 19V5Z"
            fill="#ffffff"
          />
          {/* Slanted Connecting Ribbon with a gap */}
          <path
            d="M8.5 6.5L15.5 17.5"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
