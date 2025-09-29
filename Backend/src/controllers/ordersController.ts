import { type Request, type Response } from "express";
import { Cart } from "../models/Cart";
import { Order } from "../models/Order";
import { User } from "../models/User";
import { getRazorpay, verifyRazorpaySignature } from "../utils/razorpay";

export async function createOrder(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // Load default address
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    const addresses: any[] = (user as any).addresses || [];
    const defaultAddr = addresses.find((a) => a?.isDefault) || addresses[0] || (user as any).address || {};
    if (!defaultAddr || !defaultAddr.line1) return res.status(400).json({ error: "No default address set" });

    // Load cart
    const cart = await Cart.findOne({ userId }).lean();
    const items = cart?.items || [];
    if (!items.length) return res.status(400).json({ error: "Cart is empty" });

    const currency = items[0].currency || "INR";
    const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

    // Create Razorpay order (amount in paise)
    const rp = getRazorpay();
    const rpOrder = await rp.orders.create({ amount: Math.round(subtotal * 100), currency, receipt: `rcpt_${userId}_${Date.now()}` });

    // Persist order with status created
    const order = await Order.create({
      userId,
      items,
      address: defaultAddr,
      subtotal,
      currency,
      status: "created",
      razorpay: { orderId: rpOrder.id },
    });

    return res.status(201).json({ order, razorpayOrder: rpOrder, key: process.env.RAZORPAY_API_KEY });
  } catch (e: any) {
    console.error("[orders:create] error", e);
    return res.status(400).json({ error: e?.message || "Failed to create order" });
  }
}

export async function verifyPayment(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { orderId, paymentId, signature } = req.body as { orderId?: string; paymentId?: string; signature?: string };
    if (!orderId || !paymentId || !signature) return res.status(400).json({ error: "Missing payment parameters" });

    // Verify signature
    const ok = verifyRazorpaySignature({ orderId, paymentId, signature });
    if (!ok) return res.status(400).json({ error: "Invalid payment signature" });

    const order = await Order.findOneAndUpdate(
      { userId, "razorpay.orderId": orderId },
      { status: "paid", razorpay: { orderId, paymentId, signature } },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Optionally clear cart on success
    await Cart.updateOne({ userId }, { $set: { items: [] } });

    return res.json({ order });
  } catch (e: any) {
    console.error("[orders:verify] error", e);
    return res.status(400).json({ error: e?.message || "Failed to verify payment" });
  }
}

export async function myOrders(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
    return res.json({ items: orders });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || "Failed to list orders" });
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    const order = await Order.findOne({ _id: id, userId }).lean();
    if (!order) return res.status(404).json({ error: "Order not found" });
    return res.json({ item: order });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || "Failed to get order" });
  }
}

// Admin
export async function adminListOrders(_req: Request, res: Response) {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    return res.json({ items: orders });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || "Failed to list orders" });
  }
}

export async function adminGetOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).lean();
    if (!order) return res.status(404).json({ error: "Order not found" });
    return res.json({ item: order });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || "Failed to get order" });
  }
}

export async function adminUpdateStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body as { status?: string };
    if (!status) return res.status(400).json({ error: "Missing status" });
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: "Order not found" });
    return res.json({ item: order });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || "Failed to update status" });
  }
}
