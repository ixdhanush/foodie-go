import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    const shasum = crypto.createHmac("sha256", key_secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    // Payment is verified
    return NextResponse.json({ success: true, message: "Payment verified" }, { status: 200 });
  } catch (error: any) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json({ message: error.message || "Verification failed" }, { status: 500 });
  }
}
