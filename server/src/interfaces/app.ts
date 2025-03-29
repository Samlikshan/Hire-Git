import express from "express";
import morgan from "morgan";

import cors from "cors";
import cookieParser from "cookie-parser";
import config from "../config";
export const app = express();

//routes
import authRouter from "../interfaces/routes/authRoutes";
import { errorMiddleware } from "./middlewares/errorMiddleware";

app.use(cors({ origin: config.env.clientUrl, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);

app.use(errorMiddleware);
