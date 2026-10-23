import { NextRequest, NextResponse } from "next/server";
import { exchangeGoogleCode, signSession, AUTH_COOKIE_NAME } from "../../../../../lib/google-auth";
import { redeemInviteToken } from "../../../../../lib/license-store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state") || "";

  const host = request.headers.get("host") || "nexoreui.site";
  const proto = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const siteUrl = `${proto}://${host}`;

  if (!code) {
    return NextResponse.redirect(`${siteUrl}/auth/login?error=missing_code`);
  }

  try {
    const user = await exchangeGoogleCode(code, siteUrl);
    if (!user) {
      return NextResponse.redirect(`${siteUrl}/auth/login?error=auth_failed`);
    }

    // If state contains an invite token (e.g. "invite:INV-...")
    if (state.startsWith("invite:")) {
      const inviteToken = state.replace("invite:", "").trim();
      if (inviteToken) {
        await redeemInviteToken(inviteToken, user.email);
      }
    }

    // Create session token
    const token = signSession(user);

    // Determine redirect destination
    let redirectPath = "/pricing";
    if (state.startsWith("invite:")) {
      redirectPath = "/pricing?claimed=true";
    } else if (state.startsWith("/")) {
      redirectPath = state;
    }

    const response = NextResponse.redirect(`${siteUrl}${redirectPath}`);

    // Set secure cookie for 1 year
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.redirect(`${siteUrl}/auth/login?error=server_error`);
  }
}
