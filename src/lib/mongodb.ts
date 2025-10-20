// src/lib/mongodb.ts

// src/lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Only validate MONGODB_URI in development
if (!MONGODB_URI && process.env.NODE_ENV === 'development') {
  throw new Error("⚠️ Please define the MONGODB_URI in .env.local");
}

let isConnected = false; // track connection

export async function connectDB() {
  // If MONGODB_URI is not defined, throw a specific error
  if (!MONGODB_URI) {
    throw new Error("⚠️ MONGODB_URI is not defined. Please add it to your environment variables.");
  }

  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
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
