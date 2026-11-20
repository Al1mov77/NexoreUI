import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "../../../../lib/otp-store";
import { signSession, AUTH_COOKIE_NAME } from "../../../../lib/google-auth";
import { redeemInviteToken } from "../../../../lib/license-store";
import {
  checkOtpVerifyRateLimit,
  getClientIp,
  recordAuthEvent,
  validateAuthEmail,
} from "../../../../lib/auth-rate-limit";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const verifyLimit = await checkOtpVerifyRateLimit(clientIp);
    if (!verifyLimit.allowed) {
      const headers = new Headers();
      if (verifyLimit.retryAfterSeconds) {
        headers.set("Retry-After", String(verifyLimit.retryAfterSeconds));
      }
      return NextResponse.json(
        { error: verifyLimit.error || "Too many failed verification attempts. Please wait." },
        { status: 429, headers }
      );
    }

    const body = (await req.json().catch(() => null)) as {
      email?: unknown;
      code?: unknown;
      state?: unknown;
    } | null;

    const emailCheck = validateAuthEmail(body?.email);
    const cleanCode = typeof body?.code === "string" ? body.code.trim() : "";

    if (!emailCheck.valid || !/^\d{6}$/.test(cleanCode)) {
      return NextResponse.json(
        { error: "Valid email and 6-digit verification code are required." },
        { status: 400 }
      );
    }

    const verification = await verifyOtp(emailCheck.email, cleanCode);
    if (!verification.valid) {
      await recordAuthEvent("otp_verify_fail", clientIp, emailCheck.email);
      return NextResponse.json(
        { error: verification.error || "Invalid verification code." },
        { status: 400 }
      );
    }

    const user = {
      email: emailCheck.email,
      name: emailCheck.email.split("@")[0] || "Developer",
      sub: `user_${Buffer.from(emailCheck.email).toString("hex").slice(0, 16)}`,
    };

    const state = body?.state;
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

    const host = req.headers.get("host") || "";
    const isProdNexore = host.includes("nexoreui.com");

    const res = NextResponse.json({ success: true, redirectUrl });
    res.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      ...(isProdNexore ? { domain: ".nexoreui.com" } : {}),
    });

    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
