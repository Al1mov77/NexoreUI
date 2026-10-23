import { NextRequest, NextResponse } from "next/server";
import { verifyLicense } from "../../../../lib/license-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key") || searchParams.get("token");
    const deviceId = searchParams.get("device_id") || undefined;
    const deviceName = searchParams.get("device_name") || undefined;

    if (!key) {
      return NextResponse.json(
        { valid: false, error: "License key is required" },
        { status: 400 }
      );
    }

    const result = await verifyLicense(key, deviceId, deviceName);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { valid: false, error: err?.message || "Verification error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const body = await req.json().catch(() => ({}));
    const key = body.key || body.token || body.licenseKey || searchParams.get("key");
    const deviceId = body.deviceId || body.device_id || searchParams.get("device_id") || undefined;
    const deviceName = body.deviceName || body.device_name || searchParams.get("device_name") || undefined;

    if (!key) {
      return NextResponse.json(
        { valid: false, error: "License key is required" },
        { status: 400 }
      );
    }

    const result = await verifyLicense(key, deviceId, deviceName);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { valid: false, error: err?.message || "Verification error" },
      { status: 500 }
    );
  }
}
