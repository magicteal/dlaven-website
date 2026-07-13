import mongoose from "mongoose";

export async function connectDB() {
  const isProd = process.env.NODE_ENV === "production";
  // Environment-based DB selection:
  //   production -> Atlas (MONGODB_URI_ATLAS), local/dev -> local MongoDB (MONGODB_URI_LOCAL).
  // Falls back to MONGODB_URI (legacy single var) for backward compatibility.
  const uri = isProd
    ? process.env.MONGODB_URI_ATLAS || process.env.MONGODB_URI
    : process.env.MONGODB_URI_LOCAL ||
      process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/dlavenDB";
  if (!uri) throw new Error("No MongoDB URI set (MONGODB_URI_ATLAS/MONGODB_URI_LOCAL/MONGODB_URI)");
  console.log(`Connecting to MongoDB (${isProd ? "Atlas/production" : "local/development"})`);
  mongoose.set("strictQuery", true);
  try {
    const data = await mongoose.connect(uri);
    console.log(`MongoDB connected with server: ${data.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
  return mongoose.connection;
}
