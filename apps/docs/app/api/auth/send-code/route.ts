import { NextRequest, NextResponse } from "next/server";
import { createAndSaveOtp } from "../../../../lib/otp-store";
import { sendVerificationCodeEmail } from "../../../../lib/email-service";
import {
  checkOtpSendRateLimit,
  getClientIp,
  recordAuthEvent,
  validateAuthEmail,
} from "../../../../lib/auth-rate-limit";
import { TURNSTILE_OTP_ACTION, verifyTurnstileToken } from "../../../../lib/turnstile";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as {
      email?: unknown;
      turnstileToken?: unknown;
      "cf-turnstile-response"?: unknown;
    } | null;

    const emailCheck = validateAuthEmail(body?.email);
    if (!emailCheck.valid) {
      return NextResponse.json(
        { error: emailCheck.error || "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const clientIp = getClientIp(req);
    const turnstileToken = body?.turnstileToken ?? body?.["cf-turnstile-response"];
    const turnstileCheck = await verifyTurnstileToken({
      token: turnstileToken,
      remoteIp: clientIp,
      expectedAction: TURNSTILE_OTP_ACTION,
    });

    if (!turnstileCheck.ok) {
      return NextResponse.json(
        { error: turnstileCheck.error || "Security verification failed. Please retry." },
        { status: 403 }
      );
    }

    const rateDecision = await checkOtpSendRateLimit(clientIp, emailCheck.email);
    if (!rateDecision.allowed) {
      const headers = new Headers();
      if (rateDecision.retryAfterSeconds) {
        headers.set("Retry-After", String(rateDecision.retryAfterSeconds));
      }
      return NextResponse.json(
        {
          error: rateDecision.error || "Too many requests. Please wait before trying again.",
          cooldownRemaining: rateDecision.retryAfterSeconds,
        },
        { status: 429, headers }
      );
    }

    const { code, cooldownRemaining } = await createAndSaveOtp(emailCheck.email);
    if (cooldownRemaining && cooldownRemaining > 0) {
      return NextResponse.json(
        {
          error: `Please wait ${cooldownRemaining} seconds before requesting another code.`,
          cooldownRemaining,
        },
        {
          status: 429,
          headers: { "Retry-After": String(cooldownRemaining) },
        }
      );
    }

    await recordAuthEvent("otp_send", clientIp, emailCheck.email);

    const result = await sendVerificationCodeEmail({
      toEmail: emailCheck.email,
      code,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error:
            "Unable to deliver the verification email right now. Please try again shortly or sign in with Google.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully.",
      email: emailCheck.email,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error while sending verification code.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
