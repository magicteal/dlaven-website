import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dlaven";
  if (!uri) throw new Error("MONGODB_URI not set");
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  return mongoose.connection;
}
