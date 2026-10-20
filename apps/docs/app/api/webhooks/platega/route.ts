import { NextRequest, NextResponse } from "next/server";
import { fulfillOrder } from "../../../../lib/license-store";

export async function POST(req: NextRequest) {
  try {
    const incomingSecret = req.headers.get("x-secret");
    const incomingMerchantId = req.headers.get("x-merchantid") || req.headers.get("x-merchant-id");

    const expectedSecret = process.env.PLATEGA_SECRET;
    const expectedMerchantId = process.env.PLATEGA_MERCHANT_ID;

    if (expectedSecret && incomingSecret !== expectedSecret) {
      return NextResponse.json(
        { error: "Unauthorized: invalid X-Secret header" },
        { status: 401 }
      );
    }

    if (expectedMerchantId && incomingMerchantId !== expectedMerchantId) {
      return NextResponse.json(
        { error: "Unauthorized: invalid X-MerchantId header" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));

    const orderId = body.order_id || body.orderId || body.id;
    const status = (body.status || "").toLowerCase();
    const paymentId = body.payment_id || body.paymentId || body.transaction_id;

    if (!orderId) {
      return NextResponse.json(
        { error: "order_id missing in webhook payload" },
        { status: 400 }
      );
    }

    if (status === "paid" || status === "success" || status === "completed" || !status) {
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
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Webhook processing error" },
      { status: 500 }
    );
  }
}
