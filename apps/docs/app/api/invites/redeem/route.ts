import { NextRequest, NextResponse } from "next/server";
import { redeemInviteToken } from "../../../../lib/license-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const token = body.token;
    const email = body.email;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Invite token is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required to claim your seat." },
        { status: 400 }
      );
    }

    const result = await redeemInviteToken(token, email);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to redeem invite token." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Permanent team seat claimed successfully.",
      licenseKey: result.license?.licenseKey,
      ownerEmail: result.license?.ownerEmail,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error redeeming invite." },
      { status: 500 }
    );
  }
}
