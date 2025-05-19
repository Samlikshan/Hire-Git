import express from "express";
import { SubscriptionController } from "../controllers/Admin/subscriptionController";
import { verifyToken } from "../middlewares/verifyTokenMiddleware";

const router = express.Router();
const subscriptionController = new SubscriptionController();

// router.use(verifyToken());
router.get("/subscriptions", subscriptionController.list);
router.post("/subscription", subscriptionController.create);
router.patch("/subscription", subscriptionController.update);
router.delete("/subscription/:planId", subscriptionController.delete);
router.get("/subscription/dasbaord", subscriptionController.dashboard);

export default router;
