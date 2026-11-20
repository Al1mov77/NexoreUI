import nodemailer from "nodemailer";

interface SendOtpEmailParams {
  toEmail: string;
  code: string;
}

const DEFAULT_SUPPORT_EMAIL = "support@nexoreui.com";

function buildVerificationEmailContent(code: string) {
  const supportEmail = process.env.EMAIL_REPLY_TO || DEFAULT_SUPPORT_EMAIL;
  const subject = `${code} is your NexoreUI verification code`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NexoreUI Verification Code</title>
</head>
<body style="margin:0;padding:0;background-color:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#fafafa;">
  <div style="width:100%;background-color:#09090b;padding:40px 16px;box-sizing:border-box;">
    <div style="max-width:460px;margin:0 auto;background-color:#111113;border:1px solid #27272a;border-radius:12px;overflow:hidden;">
      <div style="padding:24px 28px;border-bottom:1px solid #27272a;">
        <span style="font-size:16px;font-weight:600;letter-spacing:-0.02em;color:#fafafa;">NexoreUI</span>
      </div>
      <div style="padding:28px;">
        <h1 style="font-size:20px;font-weight:600;letter-spacing:-0.02em;margin:0 0 8px;color:#fafafa;">Verification code</h1>
        <p style="font-size:14px;line-height:1.55;color:#a1a1aa;margin:0 0 24px;">
          Enter this one-time code to sign in to your NexoreUI account.
        </p>
        <div style="background-color:#09090b;border:1px solid #27272a;border-radius:10px;padding:18px 16px;text-align:center;margin-bottom:20px;">
          <div style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:32px;font-weight:700;letter-spacing:10px;color:#fafafa;padding-left:10px;">${code}</div>
        </div>
        <p style="font-size:12px;line-height:1.5;color:#a1a1aa;margin:0 0 16px;">
          This code expires in 15 minutes and can only be used once. If you did not request this email, you can ignore it.
        </p>
      </div>
      <div style="padding:18px 28px;border-top:1px solid #27272a;background-color:#0d0d0f;font-size:11px;color:#71717a;line-height:1.5;">
        NexoreUI Support &middot; <a href="mailto:${supportEmail}" style="color:#e4e4e7;text-decoration:none;">${supportEmail}</a> &middot; <a href="https://www.nexoreui.com" style="color:#e4e4e7;text-decoration:none;">nexoreui.com</a>
      </div>
    </div>
  </div>
</body>
</html>`;

  const text = `Your NexoreUI verification code is: ${code}\n\nThis code expires in 15 minutes and can only be used once.\n\nSupport: ${supportEmail}\nhttps://www.nexoreui.com`;

  return { subject, html, text, supportEmail };
}

export async function sendVerificationCodeEmail({
  toEmail,
  code,
}: SendOtpEmailParams): Promise<{ success: boolean; error?: string }> {
  const fromAddress = process.env.EMAIL_FROM || DEFAULT_SUPPORT_EMAIL;
  const fromName = process.env.EMAIL_FROM_NAME || "NexoreUI";
  const { subject, html, text, supportEmail } = buildVerificationEmailContent(code);

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${fromName} <${fromAddress}>`,
          to: [toEmail],
          reply_to: supportEmail,
          subject,
          html,
          text,
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => null);
        const message =
          errBody?.message || errBody?.error || `Resend returned HTTP ${response.status}`;
        return { success: false, error: message };
      }

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send email via Resend.";
      return { success: false, error: msg };
    }
  }

  const cfEmailToken = process.env.CLOUDFLARE_EMAIL_API_TOKEN;
  const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (cfEmailToken && cfAccountId) {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/email/sending/send`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cfEmailToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: toEmail,
            from: { address: fromAddress, name: fromName },
            reply_to: supportEmail,
            subject,
            html,
            text,
          }),
        }
      );

      if (!response.ok) {
        const errBody = await response.json().catch(() => null);
        const message =
          errBody?.errors?.[0]?.message ||
          `Cloudflare Email Sending returned HTTP ${response.status}`;
        return { success: false, error: message };
      }

      return { success: true };
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to send email via Cloudflare Email Sending.";
      return { success: false, error: msg };
    }
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER || process.env.MAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.MAIL_PASS || process.env.MAIL_PASSWORD;

  if (!host || !user || !pass) {
    console.warn(
      `[NexoreUI Auth] Email provider not configured. Verification code for ${toEmail}: ${code}`
    );
    return {
      success: false,
      error: "Email delivery is not configured. Set RESEND_API_KEY, CLOUDFLARE_EMAIL_API_TOKEN, or SMTP credentials.",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const smtpFrom =
      process.env.SMTP_FROM ||
      (host.toLowerCase().includes("mail.ru") ? user : fromAddress);

    await transporter.sendMail({
      from: `"${fromName}" <${smtpFrom}>`,
      replyTo: supportEmail,
      to: toEmail,
      subject,
      text,
      html,
    });

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to send verification email via SMTP.";
    console.error("[NexoreUI Email Service] SMTP error:", err);
    return { success: false, error: msg };
  }
}
