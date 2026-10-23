import { NextRequest, NextResponse } from "next/server";
import { createOrder, fulfillOrder } from "../../../lib/license-store";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { email?: string };
    const email = body.email;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required for license delivery." },
        { status: 400 }
      );
    }

    const plategaMerchantId = process.env.PLATEGA_MERCHANT_ID || "fd531c18-70a9-437d-9582-adc858bea8ff";
    const plategaSecret = process.env.PLATEGA_SECRET_KEY || process.env.PLATEGA_SECRET;
    const plategaApiUrl = process.env.PLATEGA_API_URL || "https://app.platega.io/v2/transaction/process";

    const order = await createOrder({
      customerEmail: email,
      amount: 39,
      currency: "USD",
      provider: plategaSecret ? "platega" : "test",
    });

    const host = req.headers.get("host") || "www.nexoreui.site";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const returnUrl = `${protocol}://${host}/checkout/success?order_id=${order.orderId}`;
    const failedUrl = `${protocol}://${host}/pricing?canceled=true`;

    if (plategaSecret) {
      try {
        const plategaRes = await fetch(plategaApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-MerchantId": plategaMerchantId,
            "X-Secret": plategaSecret,
          },
          body: JSON.stringify({
            paymentDetails: {
              amount: 39,
              currency: "USD",
            },
            description: "NexoreUI Pro Lifetime Access (30+ Templates, Unlimited Make Exports, 2 Invites)",
            return: returnUrl,
            failedUrl,
            payload: order.orderId,
          }),
        });

        if (plategaRes.ok) {
          const data = (await plategaRes.json()) as {
            transactionId?: string;
            url?: string;
            checkout_url?: string;
            payment_url?: string;
          };
          const checkoutUrl = data.url || data.checkout_url || data.payment_url;
          if (checkoutUrl) {
            return NextResponse.json({ checkoutUrl, orderId: order.orderId });
          }
        }
      } catch {
      }
    }

    await fulfillOrder(order.orderId, "test_payment_sandbox");

    return NextResponse.json({
      checkoutUrl: returnUrl,
      orderId: order.orderId,
      sandbox: true,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error creating order.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
