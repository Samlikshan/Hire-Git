import { Router } from "express";
import { verifyToken } from "../middlewares/verifyTokenMiddleware";
import { SubscriptionController } from "../controllers/subscriptionController";

const router = Router();

const subscriptionController = new SubscriptionController();

router.post(
  "/create-session",
  verifyToken(),
  subscriptionController.createCheckoutSession
);

router.get(
  "/verify/:sessionId",
  verifyToken(),
  subscriptionController.verifyPayment
);
router.get(
  "/my-subscriptions",
  verifyToken(),
  subscriptionController.mySubscriptions
);

export default router;
