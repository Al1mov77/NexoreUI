import { NextRequest, NextResponse } from "next/server";
import { getGoogleOAuthUrl } from "../../../../lib/google-auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state") || searchParams.get("returnTo") || "";
  const authUrl = getGoogleOAuthUrl(state);
  return NextResponse.redirect(authUrl);
}
