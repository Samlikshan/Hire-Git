import express from "express";
import { AuthController } from "../controllers/authController";

const router = express.Router();
const authController = new AuthController();

router.post("/admin/login", authController.loginAdmin);

router.get("/logout", authController.logout);
export default router;
