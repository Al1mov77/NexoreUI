import { NextRequest, NextResponse } from "next/server";
import { exchangeGoogleCode, signSession, AUTH_COOKIE_NAME } from "../../../../../lib/google-auth";
import { redeemInviteToken } from "../../../../../lib/license-store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state") || "";

  const siteUrl = "https://nexoreui.site";

  if (!code) {
    return NextResponse.redirect(`${siteUrl}/pricing?error=missing_code`);
  }

  try {
    const user = await exchangeGoogleCode(code);
    if (!user) {
      return NextResponse.redirect(`${siteUrl}/pricing?error=auth_failed`);
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

    // Set secure cookie
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.redirect(`${siteUrl}/pricing?error=server_error`);
  }
}
