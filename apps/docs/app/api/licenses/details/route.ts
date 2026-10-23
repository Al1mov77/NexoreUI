import { NextRequest, NextResponse } from "next/server";
import {
  getLicenseDetailsByOrderId,
  getLicenseDetailsByKey,
  getLicensesByEmail,
} from "../../../../lib/license-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");
    const key = searchParams.get("key");
    const email = searchParams.get("email");

    if (orderId) {
      const details = await getLicenseDetailsByOrderId(orderId);
      if (!details) {
        return NextResponse.json(
          { error: "Order not found or not yet fulfilled" },
          { status: 404 }
        );
      }
      return NextResponse.json(details);
    }

    if (key) {
      const details = await getLicenseDetailsByKey(key);
      if (!details) {
        return NextResponse.json(
          { error: "License key not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(details);
    }

    if (email) {
      const licenses = await getLicensesByEmail(email);
      return NextResponse.json({ licenses });
    }

    return NextResponse.json(
      { error: "Provide order_id, key, or email" },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch license details" },
      { status: 500 }
    );
  }
}
