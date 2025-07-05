"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    type: { type: String },
    title: { type: String },
    job: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Jobs" },
    // company: { type: mongoose.Schema.Types.ObjectId, ref: "Companies" },
    candidate: { type: mongoose_1.default.Schema.Types.ObjectId, res: "Cadidates" },
    message: { type: String },
    read: { type: Boolean, default: false },
    action: { type: { type: String }, label: String, url: String },
}, { timestamps: true });
exports.NotificationModel = mongoose_1.default.model("Notifications", notificationSchema);
