import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "../../../../lib/otp-store";
import { signSession, AUTH_COOKIE_NAME } from "../../../../lib/google-auth";
import { redeemInviteToken } from "../../../../lib/license-store";

export async function POST(req: NextRequest) {
  try {
    const { email, code, state } = await req.json();
    const cleanEmail = (email || "").toLowerCase().trim();
    const cleanCode = (code || "").trim();

    if (!cleanEmail || !cleanCode) {
      return NextResponse.json({ error: "Email and verification code are required." }, { status: 400 });
    }

    const verification = await verifyOtp(cleanEmail, cleanCode);
    if (!verification.valid) {
      return NextResponse.json({ error: verification.error || "Invalid verification code." }, { status: 400 });
    }

    const user = {
      email: cleanEmail,
      name: cleanEmail.split("@")[0] || "Developer",
      sub: `user_${Buffer.from(cleanEmail).toString("hex").slice(0, 16)}`,
    };

    if (state && typeof state === "string" && state.startsWith("invite:")) {
      const inviteToken = state.replace("invite:", "").trim();
      if (inviteToken) {
        await redeemInviteToken(inviteToken, user.email);
      }
    }

    const token = signSession(user);

    let redirectUrl = "/pricing";
    if (state && typeof state === "string") {
      if (state.startsWith("invite:")) {
        redirectUrl = "/pricing?claimed=true";
      } else if (state.startsWith("/")) {
        redirectUrl = state;
      }
    }

    const res = NextResponse.json({ success: true, redirectUrl });
    res.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Authentication error." }, { status: 500 });
  }
}
