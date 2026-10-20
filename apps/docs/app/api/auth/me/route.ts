import { NextResponse } from "next/server";
import { getCurrentUser, getUserProStatus } from "../../../../lib/google-auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ authenticated: false, isPro: false }, { status: 200 });
  }

  const status = await getUserProStatus(user);
  return NextResponse.json({
    authenticated: true,
    ...status,
  });
}
