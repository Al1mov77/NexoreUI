import { NextRequest, NextResponse } from "next/server";
import { getGoogleOAuthUrl } from "../../../../lib/google-auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state") || searchParams.get("returnTo") || "";
  const host = request.headers.get("host") || "nexoreui.site";
  const proto = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const origin = `${proto}://${host}`;

  if (!process.env.GOOGLE_CLIENT_ID) {
    return NextResponse.redirect(`${origin}/auth/login?error=missing_config&state=${encodeURIComponent(state)}`);
  }

  const authUrl = getGoogleOAuthUrl(state, origin);
  return NextResponse.redirect(authUrl);
}
