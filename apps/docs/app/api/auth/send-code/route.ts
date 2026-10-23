import { NextRequest, NextResponse } from "next/server";
import { createAndSaveOtp } from "../../../../lib/otp-store";
import { sendVerificationCodeEmail } from "../../../../lib/email-service";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const cleanEmail = (email || "").toLowerCase().trim();

    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const { code, cooldownRemaining } = await createAndSaveOtp(cleanEmail);

    if (cooldownRemaining && cooldownRemaining > 0) {
      return NextResponse.json(
        {
          error: `Please wait ${cooldownRemaining} seconds before requesting another code.`,
          cooldownRemaining,
        },
        { status: 429 }
      );
    }

    const result = await sendVerificationCodeEmail({
      toEmail: cleanEmail,
      code,
    });

    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully.",
      email: cleanEmail,
      warning: result.error,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error while sending verification code." },
      { status: 500 }
    );
  }
}
