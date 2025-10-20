// src/lib/mongodb.ts

// src/lib/mongodb.ts
import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "⚠️ Please define the MONGODB_URI environment variable in Vercel or .env.local"
  );
}

// Extend the NodeJS global type to include mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  } | undefined;
}

// Initialize cache if it doesn't exist
if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null };
}

// Non-null assertion tells TypeScript it definitely exists now
const cached = global.mongooseCache!;

export async function connectDB(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}


// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI as string;

// if (!MONGODB_URI) {
//   throw new Error("⚠️ Please define the MONGODB_URI in .env.local");
// }

// let isConnected = false; // track connection

// export async function connectDB() {
//   if (isConnected) return;

//   try {
//     await mongoose.connect(MONGODB_URI);
//     isConnected = true;
//     console.log("✅ MongoDB connected");
//   } catch (error) {
//     console.error("❌ MongoDB connection error:", error);
//     throw error;
//   }
// }
