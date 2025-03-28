import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/Hire",
  jwtSecret: process.env.JWT_SECRET || "supersecretkey",
  clientUrl: process.env.CLIENT_URL || "http://localhost:4000",
};
