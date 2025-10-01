import { type Request, type Response } from "express";
import { Cart } from "../models/Cart";
import { Order } from "../models/Order";
import { User } from "../models/User";
import { getRazorpay, verifyRazorpaySignature } from "../utils/razorpay";
import { sendEmail } from "../utils/email";

export async function createOrder(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.sub;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // Load default address
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    const addresses: any[] = (user as any).addresses || [];
    const defaultAddr = addresses.find((a) => a?.isDefault) || addresses[0] || (user as any).address || {};
    if (!defaultAddr || !defaultAddr.line1) return res.status(400).json({ error: "No default address set" });

    // Load cart for authenticated user; if empty, attempt guest cart migration
    let userCartDoc = await Cart.findOne({ userId }).exec();
    let items = userCartDoc?.items || [];
    if (!items.length) {
      const guestId = (req.cookies?.["cartId"] as string | undefined) || undefined;
      if (guestId) {
        const guestCart = await Cart.findOne({ guestId }).exec();
        if (guestCart && guestCart.items && guestCart.items.length) {
          // Migrate items into user's cart
          if (!userCartDoc) {
            userCartDoc = await Cart.create({ userId, items: guestCart.items });
          } else {
            userCartDoc.items = guestCart.items as any;
            await userCartDoc.save();
          }
          items = userCartDoc.items || [];
          // Clear guest cart
          await Cart.deleteOne({ _id: guestCart._id });
          // Best-effort clear cookie
          try { res.clearCookie("cartId", { httpOnly: true, sameSite: "lax", secure: false, path: "/" }); } catch {}
        }
      }
    }
    if (!items.length) {
      console.warn("[orders:create] Empty cart for user", { userId });
      return res.status(400).json({ error: "Cart is empty" });
    }

  const currency = items[0].currency || "INR";
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  // Create Razorpay order (amount in paise)
  const rp = getRazorpay();
  // Razorpay requires receipt length <= 40 chars
  const shortSub = String(userId).slice(-8);
  const shortTs = Date.now().toString().slice(-6);
  const receipt = `r_${shortSub}_${shortTs}`; // e.g. r_abcdef12_345678 (<= 40)
  const rpOrder = await rp.orders.create({ amount: Math.round(subtotal * 100), currency, receipt });

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
    const msg = (e?.error?.description as string | undefined)
      || (e?.message as string | undefined)
      || "Failed to create order";
    return res.status(400).json({ error: msg });
  }
}

export async function verifyPayment(req: Request, res: Response) {
  try {
  const userId = (req as any).user?.sub;
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

    // Send payment confirmation email (best-effort)
    try {
      const u = await User.findById(userId).lean();
      const to = (u as any)?.email as string | undefined;
      if (to) {
        await sendEmail({
          to,
          subject: `Order paid: ${String(order._id)}`,
          text: `Thank you! Your order ${String(order._id)} has been paid successfully. Total: ${order.currency} ${order.subtotal}.`,
          html: `<p>Thank you! Your order <strong>${String(order._id)}</strong> has been paid successfully.</p><p>Total: <strong>${order.currency} ${order.subtotal}</strong></p>`,
        });
      }
    } catch (e) {
      console.warn("[orders:verify] email send failed", e);
    }

    return res.json({ order });
  } catch (e: any) {
    console.error("[orders:verify] error", e);
    return res.status(400).json({ error: e?.message || "Failed to verify payment" });
  }
}

export async function myOrders(req: Request, res: Response) {
  try {
  const userId = (req as any).user?.sub;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
    return res.json({ items: orders });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || "Failed to list orders" });
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
  const userId = (req as any).user?.sub;
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

    // Notify user of status change (best-effort)
    try {
      const u = await User.findById(order.userId).lean();
      const to = (u as any)?.email as string | undefined;
      if (to) {
        const subjectMap: Record<string, string> = {
          shipped: "Your order has shipped",
          delivered: "Your order has been delivered",
          cancelled: "Your order has been cancelled",
          refunded: "Your order has been refunded",
          failed: "Your order payment failed",
          paid: "Your order is paid",
          created: "Your order was created",
        };
        const subject = subjectMap[status] || `Order update: ${status}`;
        const statusText = String(status).toUpperCase();
        await sendEmail({
          to,
          subject,
          text: `Update for order ${String(order._id)}: status changed to ${statusText}.`,
          html: `<p>Update for order <strong>${String(order._id)}</strong>:</p><p>Status changed to <strong>${statusText}</strong>.</p>`,
        });
      }
    } catch (e) {
      console.warn("[orders:adminUpdateStatus] email send failed", e);
    }
    return res.json({ item: order });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || "Failed to update status" });
  }
}
