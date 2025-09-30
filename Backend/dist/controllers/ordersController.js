"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.verifyPayment = verifyPayment;
exports.myOrders = myOrders;
exports.getOrderById = getOrderById;
exports.adminListOrders = adminListOrders;
exports.adminGetOrder = adminGetOrder;
exports.adminUpdateStatus = adminUpdateStatus;
const Cart_1 = require("../models/Cart");
const Order_1 = require("../models/Order");
const User_1 = require("../models/User");
const razorpay_1 = require("../utils/razorpay");
const email_1 = require("../utils/email");
async function createOrder(req, res) {
    try {
        const userId = req.user?.sub;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        // Load default address
        const user = await User_1.User.findById(userId).lean();
        if (!user)
            return res.status(404).json({ error: "User not found" });
        const addresses = user.addresses || [];
        const defaultAddr = addresses.find((a) => a?.isDefault) || addresses[0] || user.address || {};
        if (!defaultAddr || !defaultAddr.line1)
            return res.status(400).json({ error: "No default address set" });
        // Load cart for authenticated user; if empty, attempt guest cart migration
        let userCartDoc = await Cart_1.Cart.findOne({ userId }).exec();
        let items = userCartDoc?.items || [];
        if (!items.length) {
            const guestId = req.cookies?.["cartId"] || undefined;
            if (guestId) {
                const guestCart = await Cart_1.Cart.findOne({ guestId }).exec();
                if (guestCart && guestCart.items && guestCart.items.length) {
                    // Migrate items into user's cart
                    if (!userCartDoc) {
                        userCartDoc = await Cart_1.Cart.create({ userId, items: guestCart.items });
                    }
                    else {
                        userCartDoc.items = guestCart.items;
                        await userCartDoc.save();
                    }
                    items = userCartDoc.items || [];
                    // Clear guest cart
                    await Cart_1.Cart.deleteOne({ _id: guestCart._id });
                    // Best-effort clear cookie
                    try {
                        res.clearCookie("cartId", { httpOnly: true, sameSite: "lax", secure: false, path: "/" });
                    }
                    catch { }
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
        const rp = (0, razorpay_1.getRazorpay)();
        // Razorpay requires receipt length <= 40 chars
        const shortSub = String(userId).slice(-8);
        const shortTs = Date.now().toString().slice(-6);
        const receipt = `r_${shortSub}_${shortTs}`; // e.g. r_abcdef12_345678 (<= 40)
        const rpOrder = await rp.orders.create({ amount: Math.round(subtotal * 100), currency, receipt });
        // Persist order with status created
        const order = await Order_1.Order.create({
            userId,
            items,
            address: defaultAddr,
            subtotal,
            currency,
            status: "created",
            razorpay: { orderId: rpOrder.id },
        });
        return res.status(201).json({ order, razorpayOrder: rpOrder, key: process.env.RAZORPAY_API_KEY });
    }
    catch (e) {
        console.error("[orders:create] error", e);
        const msg = e?.error?.description
            || e?.message
            || "Failed to create order";
        return res.status(400).json({ error: msg });
    }
}
async function verifyPayment(req, res) {
    try {
        const userId = req.user?.sub;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const { orderId, paymentId, signature } = req.body;
        if (!orderId || !paymentId || !signature)
            return res.status(400).json({ error: "Missing payment parameters" });
        // Verify signature
        const ok = (0, razorpay_1.verifyRazorpaySignature)({ orderId, paymentId, signature });
        if (!ok)
            return res.status(400).json({ error: "Invalid payment signature" });
        const order = await Order_1.Order.findOneAndUpdate({ userId, "razorpay.orderId": orderId }, { status: "paid", razorpay: { orderId, paymentId, signature } }, { new: true });
        if (!order)
            return res.status(404).json({ error: "Order not found" });
        // Optionally clear cart on success
        await Cart_1.Cart.updateOne({ userId }, { $set: { items: [] } });
        // Send payment confirmation email (best-effort)
        try {
            const u = await User_1.User.findById(userId).lean();
            const to = u?.email;
            if (to) {
                await (0, email_1.sendEmail)({
                    to,
                    subject: `Order paid: ${String(order._id)}`,
                    text: `Thank you! Your order ${String(order._id)} has been paid successfully. Total: ${order.currency} ${order.subtotal}.`,
                    html: `<p>Thank you! Your order <strong>${String(order._id)}</strong> has been paid successfully.</p><p>Total: <strong>${order.currency} ${order.subtotal}</strong></p>`,
                });
            }
        }
        catch (e) {
            console.warn("[orders:verify] email send failed", e);
        }
        return res.json({ order });
    }
    catch (e) {
        console.error("[orders:verify] error", e);
        return res.status(400).json({ error: e?.message || "Failed to verify payment" });
    }
}
async function myOrders(req, res) {
    try {
        const userId = req.user?.sub;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const orders = await Order_1.Order.find({ userId }).sort({ createdAt: -1 }).lean();
        return res.json({ items: orders });
    }
    catch (e) {
        return res.status(400).json({ error: e?.message || "Failed to list orders" });
    }
}
async function getOrderById(req, res) {
    try {
        const userId = req.user?.sub;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const { id } = req.params;
        const order = await Order_1.Order.findOne({ _id: id, userId }).lean();
        if (!order)
            return res.status(404).json({ error: "Order not found" });
        return res.json({ item: order });
    }
    catch (e) {
        return res.status(400).json({ error: e?.message || "Failed to get order" });
    }
}
// Admin
async function adminListOrders(_req, res) {
    try {
        const orders = await Order_1.Order.find({}).sort({ createdAt: -1 }).lean();
        return res.json({ items: orders });
    }
    catch (e) {
        return res.status(400).json({ error: e?.message || "Failed to list orders" });
    }
}
async function adminGetOrder(req, res) {
    try {
        const { id } = req.params;
        const order = await Order_1.Order.findById(id).lean();
        if (!order)
            return res.status(404).json({ error: "Order not found" });
        return res.json({ item: order });
    }
    catch (e) {
        return res.status(400).json({ error: e?.message || "Failed to get order" });
    }
}
async function adminUpdateStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status)
            return res.status(400).json({ error: "Missing status" });
        const order = await Order_1.Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!order)
            return res.status(404).json({ error: "Order not found" });
        // Notify user of status change (best-effort)
        try {
            const u = await User_1.User.findById(order.userId).lean();
            const to = u?.email;
            if (to) {
                const subjectMap = {
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
                await (0, email_1.sendEmail)({
                    to,
                    subject,
                    text: `Update for order ${String(order._id)}: status changed to ${statusText}.`,
                    html: `<p>Update for order <strong>${String(order._id)}</strong>:</p><p>Status changed to <strong>${statusText}</strong>.</p>`,
                });
            }
        }
        catch (e) {
            console.warn("[orders:adminUpdateStatus] email send failed", e);
        }
        return res.json({ item: order });
    }
    catch (e) {
        return res.status(400).json({ error: e?.message || "Failed to update status" });
    }
}
