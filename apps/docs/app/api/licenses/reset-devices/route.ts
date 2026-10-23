import { NextRequest, NextResponse } from "next/server";
import { resetLicenseActivations, getLicenseDetailsByKey } from "../../../../lib/license-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const key = body.key || body.licenseKey;

    if (!key) {
      return NextResponse.json(
        { success: false, error: "License key is required" },
        { status: 400 }
      );
    }

    const details = await getLicenseDetailsByKey(key);
    if (!details) {
      return NextResponse.json(
        { success: false, error: "License key not found" },
        { status: 404 }
      );
    }

    const result = await resetLicenseActivations(key);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Device reset not allowed at this time",
          nextResetAt: result.nextResetAt,
        },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      clearedCount: result.clearedCount,
      nextResetAt: result.nextResetAt,
      message: "All active devices have been detached. You can now re-authenticate your current machines.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to reset devices" },
      { status: 500 }
    );
  }
}
