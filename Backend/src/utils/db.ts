import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dlaven";
  if (!uri) throw new Error("MONGODB_URI not set");
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
