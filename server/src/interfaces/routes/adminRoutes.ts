import express from "express";
import { AdminController } from "../controllers/Admin/adminController";
import { verifyToken } from "../middlewares/verifyTokenMiddleware";
import { adminMiddleWare } from "../middlewares/adminMiddleware";

const router = express.Router();
const adminController = new AdminController();

router.get(
  "/list-companies",
  verifyToken(),
  adminMiddleWare(),
  adminController.listCompanies
);
router.post(
  "/review-company",
  verifyToken(),
  adminMiddleWare(),
  adminController.reveiwCompany
);
export default router;
