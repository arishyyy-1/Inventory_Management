import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log("MONGO CHECK:", process.env.MONGO_URI);

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required. Add it to your server .env file.");
  }

  const connection = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${connection.connection.host}`);
};

export default connectDB;