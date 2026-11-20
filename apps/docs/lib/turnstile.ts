export const TURNSTILE_OTP_ACTION = "auth_otp";

interface TurnstileVerifyParams {
  token: unknown;
  remoteIp?: string;
  expectedAction?: string;
}

interface TurnstileSiteverifyResponse {
  success: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
}

export interface TurnstileVerifyResult {
  ok: boolean;
  error?: string;
  errorCodes?: string[];
}

function getAllowedHostnames(): Set<string> {
  const configured = (process.env.TURNSTILE_HOSTNAMES ?? "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  const allowed = new Set<string>(configured);

  if (process.env.VERCEL_ENV === "preview") {
    for (const candidate of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]) {
      if (candidate) {
        allowed.add(candidate.replace(/^https?:\/\//i, "").trim().toLowerCase());
      }
    }
  }

  if (process.env.NODE_ENV !== "production") {
    allowed.add("localhost");
    allowed.add("127.0.0.1");
  }

  return allowed;
}

export async function verifyTurnstileToken({
  token,
  remoteIp,
  expectedAction = TURNSTILE_OTP_ACTION,
}: TurnstileVerifyParams): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET?.trim();
  const expectedHostnames = getAllowedHostnames();

  if (!secret || expectedHostnames.size === 0) {
    return {
      ok: false,
      error: "Security verification is temporarily unavailable. Please try again later.",
      errorCodes: ["missing-server-config"],
    };
  }

  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return {
      ok: false,
      error: "Please complete the security check before requesting a code.",
      errorCodes: ["missing-input-response"],
    };
  }

  let data: TurnstileSiteverifyResponse;
  try {
    const body = new URLSearchParams({
      secret,
      response: token,
    });
    if (remoteIp && remoteIp !== "unknown") {
      body.set("remoteip", remoteIp);
    }

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(10_000),
      body,
    });

    if (!response.ok) {
      return {
        ok: false,
        error: "Security verification failed. Please try again.",
        errorCodes: [`http-${response.status}`],
      };
    }

    data = (await response.json()) as TurnstileSiteverifyResponse;
  } catch {
    return {
      ok: false,
      error: "Security verification timed out. Please try again.",
      errorCodes: ["network-error"],
    };
  }

  const returnedHostname = typeof data.hostname === "string" ? data.hostname.toLowerCase() : "";
  if (
    data.success !== true ||
    data.action !== expectedAction ||
    !expectedHostnames.has(returnedHostname)
  ) {
    return {
      ok: false,
      error: "Security check could not be verified. Please retry.",
      errorCodes: data["error-codes"] ?? ["validation-mismatch"],
    };
  }

  return { ok: true };
}
