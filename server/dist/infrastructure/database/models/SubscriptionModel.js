"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const SubscriptionSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Companies",
        required: true,
    },
    plan: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Plan",
        required: true,
    },
    stripeSubscriptionId: { type: String, required: true },
    stripeSubscriptionItemId: { type: String, required: true },
    stripeCustomerId: { type: String, required: true },
    status: {
        type: String,
        enum: ["active", "canceled"],
        default: "active",
    },
    startedAt: { type: Date, required: true },
    nextBillingDate: { type: Date },
    invoiceId: { type: String },
    invoice: { type: String },
    jobsPostedThisMonth: { type: Number, default: 0 },
}, { timestamps: true });
exports.SubscriptionModel = mongoose_1.default.model("Subscriptions", SubscriptionSchema);
