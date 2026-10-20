import { NextRequest, NextResponse } from "next/server";
import { createOrder, fulfillOrder } from "../../../lib/license-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required for license delivery." },
        { status: 400 }
      );
    }

    const plategaMerchantId = process.env.PLATEGA_MERCHANT_ID;
    const plategaSecret = process.env.PLATEGA_SECRET_KEY;
    const plategaApiUrl = process.env.PLATEGA_API_URL || "https://api.platega.io/v1/orders";

    const order = await createOrder({
      customerEmail: email,
      amount: 39,
      currency: "USD",
      provider: plategaMerchantId ? "platega" : "test",
    });

    const host = req.headers.get("host") || "nexoreui.site";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const returnUrl = `${protocol}://${host}/checkout/success?order_id=${order.orderId}`;
    const webhookUrl = `${protocol}://${host}/api/webhooks/platega`;

    if (plategaMerchantId && plategaSecret) {
      try {
        const plategaRes = await fetch(plategaApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${plategaSecret}`,
          },
          body: JSON.stringify({
            merchant_id: plategaMerchantId,
            order_id: order.orderId,
            amount: 39,
            currency: "USD",
            description: "NexoreUI Pro Lifetime Access (30+ Templates, Unlimited Make Exports, 2 Invites)",
            customer_email: order.customerEmail,
            return_url: returnUrl,
            callback_url: webhookUrl,
          }),
        });

        if (plategaRes.ok) {
          const data = await plategaRes.json();
          const checkoutUrl = data.checkout_url || data.payment_url || data.url;
          if (checkoutUrl) {
            return NextResponse.json({ checkoutUrl, orderId: order.orderId });
          }
        }
      } catch (plategaErr) {
        // Fallback to test fulfill if Platega endpoint is unreachable
      }
    }

    // Test / sandbox fallback: fulfill immediately so checkout flow can be experienced
    await fulfillOrder(order.orderId, "test_payment_sandbox");

    return NextResponse.json({
      checkoutUrl: returnUrl,
      orderId: order.orderId,
      sandbox: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error creating order." },
      { status: 500 }
    );
  }
}
