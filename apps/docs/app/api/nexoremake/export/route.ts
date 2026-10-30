import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getUserProStatus } from "../../../../lib/google-auth";
import { getUserExportStatus, recordUserExport } from "../../../../lib/export-limit-store";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          authenticated: false,
          requiresAuth: true,
          isPro: false,
          allowed: false,
          message: "Sign in with Google to export code.",
        },
        { status: 200 }
      );
    }

    const proStatus = await getUserProStatus(user);
    const exportStatus = await getUserExportStatus(user.email, proStatus.isPro);

    return NextResponse.json({
      authenticated: true,
      requiresAuth: false,
      user: {
        email: user.email,
        name: user.name,
      },
      ...exportStatus,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Authentication required. Please sign in with Google to export code.",
          requiresAuth: true,
        },
        { status: 401 }
      );
    }

    const proStatus = await getUserProStatus(user);
    const result = await recordUserExport(user.email, proStatus.isPro);

    if (!result.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Daily export limit reached (2/2). Upgrade to Pro for unlimited exports or wait for the cooldown timer.",
          ...result,
        },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
