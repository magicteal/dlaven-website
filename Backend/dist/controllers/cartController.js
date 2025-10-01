"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCart = getCart;
exports.addItem = addItem;
exports.updateItem = updateItem;
exports.removeItem = removeItem;
const Cart_1 = require("../models/Cart");
const Product_1 = require("../models/Product");
const crypto_1 = __importDefault(require("crypto"));
function getAuthUser(req) {
    return req.user;
}
async function getOrCreateCart(req, res) {
    const auth = getAuthUser(req);
    if (auth) {
        let cartDoc = await Cart_1.Cart.findOne({ userId: auth.sub }).exec();
        if (!cartDoc) {
            cartDoc = await Cart_1.Cart.create({ userId: auth.sub, items: [] });
        }
        return cartDoc;
    }
    // Guest via cookie
    let cartId = req.cookies["cartId"];
    if (!cartId) {
        cartId = crypto_1.default.randomUUID();
        const secure = false; // set true behind HTTPS/prod
        res.cookie("cartId", cartId, { httpOnly: true, sameSite: "lax", secure, maxAge: 30 * 24 * 60 * 60 * 1000, path: "/" });
    }
    let cartDoc = await Cart_1.Cart.findOne({ guestId: cartId }).exec();
    if (!cartDoc) {
        cartDoc = await Cart_1.Cart.create({ guestId: cartId, items: [] });
    }
    return cartDoc;
}
async function getCart(req, res) {
    const cart = await getOrCreateCart(req, res);
    return res.json({ cart: cart.toObject() });
}
async function addItem(req, res) {
    const { productSlug, quantity = 1, size } = req.body;
    if (!productSlug)
        return res.status(400).json({ error: "productSlug is required" });
    const qty = Math.max(1, parseInt(String(quantity)) || 1);
    const product = await Product_1.Product.findOne({ slug: productSlug }).lean();
    if (!product)
        return res.status(404).json({ error: "Product not found" });
    const current = await getOrCreateCart(req, res);
    const items = (current.items ?? []);
    const itemIndex = items.findIndex((i) => i.productSlug === productSlug && ((i.size ?? null) === (size ?? null)));
    if (itemIndex >= 0) {
        items[itemIndex].quantity += qty;
    }
    else {
        items.push({
            productSlug: product.slug,
            name: product.name,
            price: product.price,
            currency: product.currency,
            image: product.images[0],
            quantity: qty,
            size: size,
        });
    }
    current.items = items;
    await current.save();
    return res.status(201).json({ cart: current.toObject() });
}
async function updateItem(req, res) {
    const { productSlug } = req.params;
    const { quantity, size } = req.body;
    if (!productSlug)
        return res.status(400).json({ error: "productSlug is required" });
    const qty = Math.max(0, parseInt(String(quantity)) || 0);
    const current = await getOrCreateCart(req, res);
    const items = ([...(current.items ?? [])]);
    const idx = items.findIndex((i) => i.productSlug === productSlug && ((i.size ?? null) === (size ?? null)));
    if (idx < 0)
        return res.status(404).json({ error: "Item not in cart" });
    if (qty <= 0) {
        items.splice(idx, 1);
    }
    else {
        items[idx].quantity = qty;
    }
    current.items = items;
    await current.save();
    return res.json({ cart: current.toObject() });
}
async function removeItem(req, res) {
    const { productSlug } = req.params;
    const size = req.query.size ?? req.body?.size;
    const current = await getOrCreateCart(req, res);
    const items = (current.items ?? []).filter((i) => {
        if (i.productSlug !== productSlug)
            return true;
        if (size == null)
            return false; // remove all sizes of this product
        return (i.size ?? null) !== (size ?? null);
    });
    current.items = items;
    await current.save();
    return res.json({ cart: current.toObject() });
}
