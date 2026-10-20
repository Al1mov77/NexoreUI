import { NextRequest, NextResponse } from "next/server";
import { getGoogleOAuthUrl } from "../../../../lib/google-auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state") || searchParams.get("returnTo") || "";

  if (!process.env.GOOGLE_CLIENT_ID) {
    const host = request.headers.get("host") || "localhost:3000";
    const proto = host.includes("localhost") ? "http" : "https";
    return NextResponse.redirect(`${proto}://${host}/auth/login?state=${encodeURIComponent(state)}`);
  }

  const authUrl = getGoogleOAuthUrl(state);
  return NextResponse.redirect(authUrl);
}
