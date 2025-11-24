import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  console.log("🔌 connectDB called. Current State:", mongoose.connection.readyState);

  if (cached.conn) {
    console.log("🚀 Using existing connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10, // Limit connections
      serverSelectionTimeoutMS: 5000, // Give up after 5 seconds (Prevents infinite hang)
      socketTimeoutMS: 45000, // Close socket after 45 seconds of inactivity
    };

    console.log("⏳ Creating new connection promise...");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ New MongoDB connection established");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ Connection Failed:", e);
    throw e;
  }

  return cached.conn;
};