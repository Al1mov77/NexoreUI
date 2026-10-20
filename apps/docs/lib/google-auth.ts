import crypto from "crypto";
import { cookies } from "next/headers";
import { getLicensesByEmail, redeemInviteToken, getLicenseDetailsByKey } from "./license-store";

export interface AuthUser {
  email: string;
  name: string;
  avatar?: string;
  sub: string;
}

export interface UserProStatus {
  user: AuthUser;
  isPro: boolean;
  role: "owner" | "member" | "free";
  licenseKey?: string;
  invites?: Array<{
    token: string;
    status: "available" | "redeemed" | "revoked";
    redeemedByEmail?: string;
    inviteUrl: string;
  }>;
}

const AUTH_COOKIE_NAME = "nexore_session";
const SESSION_SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "nexore-secure-session-secret-key-32b";

export function signSession(payload: AuthUser): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(data)
    .digest("base64url");
  return `${data}.${signature}`;
}

export function verifySession(token: string): AuthUser | null {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) return null;
    const expected = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(data)
      .digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return null;
    }
    return JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as AuthUser;
  } catch {
    return null;
  }
}

export function getGoogleOAuthUrl(state?: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL 
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` 
    : "https://nexoreui.site";
  const redirectUri = `${siteUrl}/api/auth/callback/google`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    state: state || "",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleCode(code: string): Promise<AuthUser | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL 
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` 
    : "https://nexoreui.site";
  const redirectUri = `${siteUrl}/api/auth/callback/google`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) return null;
  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!userRes.ok) return null;
  const googleUser = await userRes.json();

  return {
    email: (googleUser.email || "").toLowerCase().trim(),
    name: googleUser.name || googleUser.given_name || "Nexore Developer",
    avatar: googleUser.picture,
    sub: googleUser.sub,
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;
  return verifySession(sessionCookie);
}

export async function getUserProStatus(user: AuthUser): Promise<UserProStatus> {
  const email = user.email.toLowerCase().trim();
  const siteUrl = "https://nexoreui.site";

  // Check 1: Owner of Pro license
  const licenses = await getLicensesByEmail(email);
  const activeLicense = licenses.find((l) => l.license.status === "active");

  if (activeLicense) {
    return {
      user,
      isPro: true,
      role: "owner",
      licenseKey: activeLicense.license.licenseKey,
      invites: (activeLicense.invites || []).map((inv) => ({
        token: inv.token,
        status: inv.status,
        redeemedByEmail: inv.redeemedByEmail,
        inviteUrl: `${siteUrl}/invite/${inv.token}`,
      })),
    };
  }

  return {
    user,
    isPro: false,
    role: "free",
  };
}

export { AUTH_COOKIE_NAME };
