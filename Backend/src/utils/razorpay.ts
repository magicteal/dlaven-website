import Razorpay from "razorpay";
import crypto from "crypto";

let client: Razorpay | null = null;

export function getRazorpay() {
  if (client) return client;
  const key_id = process.env.RAZORPAY_API_KEY;
  const key_secret = process.env.RAZORPAY_API_SECRET;
  if (!key_id || !key_secret) {
    throw new Error("Missing Razorpay env: RAZORPAY_API_KEY, RAZORPAY_API_SECRET");
  }
  client = new Razorpay({ key_id, key_secret });
  return client;
}

export function verifyRazorpaySignature({ orderId, paymentId, signature }: { orderId: string; paymentId: string; signature: string; }) {
  const key_secret = process.env.RAZORPAY_API_SECRET as string;
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", key_secret).update(body).digest("hex");
  return expected === signature;
}
