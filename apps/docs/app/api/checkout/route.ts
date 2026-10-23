import { NextRequest, NextResponse } from "next/server";
import { createOrder, fulfillOrder } from "../../../lib/license-store";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      email?: string;
      currency?: string;
      amount?: number;
    };
    const email = body.email;
    const requestedCurrency = body.currency === "RUB" ? "RUB" : "USD";
    const requestedAmount = requestedCurrency === "RUB" ? Number(body.amount || 3850) : 39;

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
      amount: requestedAmount,
      currency: requestedCurrency,
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
              amount: requestedAmount,
              currency: requestedCurrency,
            },
            description: "NexoreUI Pro Lifetime Access (32+ Templates, Unlimited Make Exports, 2 Invites)",
            return: returnUrl,
            failedUrl,
            payload: order.orderId,
          }),
        });

        const plategaData = await plategaRes.json();
        const checkoutUrl =
          plategaData.redirectUrl ||
          plategaData.url ||
          plategaData.paymentUrl ||
          plategaData.checkoutUrl ||
          plategaData.link;

        if (plategaRes.ok && checkoutUrl) {
          return NextResponse.json({
            success: true,
            orderId: order.orderId,
            checkoutUrl,
          });
        }

        console.error("Platega payment creation error:", plategaData);
        return NextResponse.json(
          { error: plategaData.message || "Failed to initialize payment gateway." },
          { status: 502 }
        );
      } catch (err) {
        console.error("Platega network error:", err);
        return NextResponse.json(
          { error: "Payment gateway network unreachable." },
          { status: 502 }
        );
      }
    }

    // Local Test Mode auto-fulfillment if no secret configured
    const fulfilled = await fulfillOrder(order.orderId);
    return NextResponse.json({
      success: true,
      testMode: true,
      orderId: order.orderId,
      checkoutUrl: returnUrl,
      licenseKey: fulfilled?.license.licenseKey,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
