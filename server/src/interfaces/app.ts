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
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app = express();
export const server = http.createServer(app);
socketProvider.initialize(server);

app.use(cors({ origin: config.env.clientUrl, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/candidate", userRouter);
app.use("/api/company", companyRouter);
app.use("/api/chat", chatRouter);

app.use(errorMiddleware);
