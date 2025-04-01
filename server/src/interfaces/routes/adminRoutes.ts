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
router.get(
  "/pending-companies",
  verifyToken(),
  adminMiddleWare(),
  adminController.listPendingCompanies
);
router.get(
  "/list-candidates",
  verifyToken(),
  adminMiddleWare(),
  adminController.listCandidates
);
router.post(
  "/block-candidates",
  verifyToken(),
  adminMiddleWare(),
  adminController.blockCandidate
);
export default router;
