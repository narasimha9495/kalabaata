import mongoose from "mongoose";

export async function connectDB() {
  const url = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017";
  const dbName = process.env.DB_NAME || "baata";
  mongoose.set("strictQuery", true);
  await mongoose.connect(url, { dbName });
  console.log(`MongoDB connected → ${url}/${dbName}`);
}
