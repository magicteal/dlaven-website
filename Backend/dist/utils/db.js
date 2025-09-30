"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB() {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dlaven";
    if (!uri)
        throw new Error("MONGODB_URI not set");
    mongoose_1.default.set("strictQuery", true);
    await mongoose_1.default.connect(uri);
    return mongoose_1.default.connection;
}
