import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.warn("⚠️ MongoDB offline (" + err.message + "). In-memory fallback mode active.");
  }
};

export default connectDB;
