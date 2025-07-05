"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlanModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const subscriptionPlanSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    monthlyPrice: { type: Number, required: true },
    features: {
        type: Map,
        of: mongoose_1.default.Schema.Types.Mixed,
        default: {},
    },
    stripePriceId: { type: String, required: true },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
exports.SubscriptionPlanModel = mongoose_1.default.model("Plan", subscriptionPlanSchema);
