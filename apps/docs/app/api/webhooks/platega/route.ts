import { NextRequest, NextResponse } from "next/server";
import { fulfillOrder } from "../../../../lib/license-store";

export async function POST(req: NextRequest) {
  try {
    const incomingSecret = req.headers.get("x-secret");
    const incomingMerchantId = req.headers.get("x-merchantid") || req.headers.get("x-merchant-id");

    const expectedSecret = process.env.PLATEGA_SECRET_KEY || process.env.PLATEGA_SECRET;
    const expectedMerchantId = process.env.PLATEGA_MERCHANT_ID || "fd531c18-70a9-437d-9582-adc858bea8ff";

    if (expectedSecret && incomingSecret && incomingSecret !== expectedSecret) {
      return NextResponse.json(
        { error: "Unauthorized: invalid X-Secret header" },
        { status: 401 }
      );
    }

    if (expectedMerchantId && incomingMerchantId && incomingMerchantId !== expectedMerchantId) {
      return NextResponse.json(
        { error: "Unauthorized: invalid X-MerchantId header" },
        { status: 401 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as {
      id?: string;
      order_id?: string;
      orderId?: string;
      payload?: string;
      status?: string;
      payment_id?: string;
      paymentId?: string;
      transaction_id?: string;
    };

    const orderId = body.payload || body.order_id || body.orderId || body.id;
    const status = (body.status || "").toLowerCase();
    const paymentId = body.id || body.payment_id || body.paymentId || body.transaction_id || "platega_payment";

    if (!orderId) {
      return NextResponse.json(
        { error: "order_id or payload missing in webhook payload" },
        { status: 400 }
      );
    }

    if (
      status === "confirmed" ||
      status === "paid" ||
      status === "success" ||
      status === "completed" ||
      !status
    ) {
      const result = await fulfillOrder(orderId, paymentId);
      if (!result) {
        return NextResponse.json(
          { error: `Order ${orderId} not found` },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        orderId: result.order?.orderId || result.license.orderId,
        licenseKey: result.license.licenseKey,
      });
    }

    return NextResponse.json({ received: true, status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook processing error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
