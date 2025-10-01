"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRazorpay = getRazorpay;
exports.verifyRazorpaySignature = verifyRazorpaySignature;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
let client = null;
function getRazorpay() {
    if (client)
        return client;
    const key_id = process.env.RAZORPAY_API_KEY;
    const key_secret = process.env.RAZORPAY_API_SECRET;
    if (!key_id || !key_secret) {
        throw new Error("Missing Razorpay env: RAZORPAY_API_KEY, RAZORPAY_API_SECRET");
    }
    client = new razorpay_1.default({ key_id, key_secret });
    return client;
}
function verifyRazorpaySignature({ orderId, paymentId, signature }) {
    const key_secret = process.env.RAZORPAY_API_SECRET;
    const body = `${orderId}|${paymentId}`;
    const expected = crypto_1.default.createHmac("sha256", key_secret).update(body).digest("hex");
    return expected === signature;
}
