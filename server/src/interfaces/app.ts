import express from "express";
import morgan from "morgan";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "../config";
import { socketProvider } from "../config/socket";
//routes
import authRouter from "../interfaces/routes/authRoutes";
import adminRouter from "../interfaces/routes/adminRoutes";
import userRouter from "../interfaces/routes/userRoutes";
import companyRouter from "../interfaces/routes/companyRoutes";
import chatRouter from "../interfaces/routes/chatRoutes";
import interviewRouter from "../interfaces/routes/interviewRoutes";
import subscriptionRouter from "../interfaces/routes/subscriptionRoutes";
import { errorMiddleware } from "./middlewares/errorMiddleware";

import paymentRouter from "../interfaces/routes/paymentRoutes";
import { handleWebhook } from "./webhooks/stripeWebhook";

const app = express();
export const server = http.createServer(app);
socketProvider.initialize(server);

app.use(cors({ origin: config.env.clientUrl, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin", subscriptionRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/candidate", userRouter);
app.use("/api/company", companyRouter);
app.use("/api/chat", chatRouter);
app.use("/api/interview", interviewRouter);

app.use(errorMiddleware);
