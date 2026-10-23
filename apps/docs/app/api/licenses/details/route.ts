import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/google-auth";
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
      const cleanEmail = email.toLowerCase().trim();
      const user = await getCurrentUser();
      const host = req.headers.get("host") || "";
      const isLocalDev =
        process.env.NODE_ENV === "development" ||
        host.includes("localhost") ||
        host.includes("127.0.0.1");

      const isAuthorized =
        (user && user.email.toLowerCase().trim() === cleanEmail) ||
        (isLocalDev && cleanEmail === "alimovumar707@gmail.com");

      if (!isAuthorized) {
        return NextResponse.json(
          {
            error:
              "Authentication required. To view license details, please enter your License Key directly or sign in with the owner email.",
          },
          { status: 401 }
        );
      }

      const licenses = await getLicensesByEmail(cleanEmail);
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
