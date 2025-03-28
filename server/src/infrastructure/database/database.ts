import mongoose from "mongoose";
import config from "../../config";

const connectDB = async () => {
  try {
    await mongoose.connect(config.env.mongoURI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
