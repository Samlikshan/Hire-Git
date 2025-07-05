"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const campanySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNumber: { type: String, required: true },
    registrationDocument: { type: String, required: true },
    headquarters: { type: String, required: true },
    website: { type: String },
    description: { type: String },
    logo: { type: String },
    socialLinks: { linkedIn: { type: String }, twitter: { type: String } },
    about: { type: String },
    founded: { type: String },
    companySize: { type: String },
    industry: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    accountStatus: {
        status: {
            type: String,
            enum: ["Accepted", "Rejected", "Pending"],
            default: "Pending",
        },
        description: { type: String },
        verifiedBy: { type: mongoose_1.default.Schema.ObjectId },
    },
    isProfileCompleted: { type: Boolean, default: false },
}, { timestamps: true });
exports.CompanyModel = mongoose_1.default.model("Companies", campanySchema);
