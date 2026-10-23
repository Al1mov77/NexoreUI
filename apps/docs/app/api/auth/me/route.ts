import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getUserProStatus } from "../../../../lib/google-auth";
import { getLicensesByEmail, getLicenseDetailsByKey } from "../../../../lib/license-store";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (user) {
    const status = await getUserProStatus(user);
    return NextResponse.json({
      authenticated: true,
      ...status,
    });
  }

  const { searchParams } = new URL(req.url);
  const authHeader = req.headers.get("authorization") || "";
  const bearerKey = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const keyToCheck = searchParams.get("key") || bearerKey;

  if (keyToCheck) {
    try {
      const details = await getLicenseDetailsByKey(keyToCheck);
      if (details && details.license.status === "active") {
        return NextResponse.json({
          authenticated: true,
          isPro: true,
          role: "owner",
          licenseKey: details.license.licenseKey,
          user: {
            email: details.license.ownerEmail,
            name: "Pro Member",
          },
          invites: details.invites,
        });
      }
    } catch {}
  }

  const host = req.headers.get("host") || "";
  const isLocalDev =
    process.env.NODE_ENV === "development" ||
    host.includes("localhost") ||
    host.includes("127.0.0.1");

  if (isLocalDev) {
    const ownerEmail = "alimovumar707@gmail.com";
    try {
      const licenses = await getLicensesByEmail(ownerEmail);
      const active = licenses.find((l) => l.license.status === "active");
      if (active) {
        return NextResponse.json({
          authenticated: true,
          isPro: true,
          role: "owner",
          licenseKey: active.license.licenseKey,
          user: {
            email: ownerEmail,
            name: "Al1mov (Owner)",
          },
          invites: active.invites,
        });
      }
    } catch {}
  }

  return NextResponse.json({ authenticated: false, isPro: false }, { status: 200 });
}
