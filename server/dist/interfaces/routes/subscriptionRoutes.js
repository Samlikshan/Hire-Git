"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subscriptionController_1 = require("../controllers/Admin/subscriptionController");
const router = express_1.default.Router();
const subscriptionController = new subscriptionController_1.SubscriptionController();
// router.use(verifyToken());
router.get("/subscriptions", subscriptionController.list);
router.post("/subscription", subscriptionController.create);
router.patch("/subscription", subscriptionController.update);
router.delete("/subscription/:planId", subscriptionController.delete);
router.get("/subscription/dasbaord", subscriptionController.dashboard);
exports.default = router;
