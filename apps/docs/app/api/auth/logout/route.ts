import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "../../../../lib/google-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}
