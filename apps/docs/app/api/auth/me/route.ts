import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getUserProStatus } from "../../../../lib/google-auth";
import { getLicenseDetailsByKey } from "../../../../lib/license-store";

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

  return NextResponse.json({ authenticated: false, isPro: false }, { status: 200 });
}
