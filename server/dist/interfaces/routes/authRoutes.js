"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const multerService_1 = require("../../utils/multerService");
const validate_1 = require("../middlewares/validate");
const authValidators_1 = require("../validators/authValidators");
const router = express_1.default.Router();
const authController = new authController_1.AuthController();
const uploadOptions = {
    fileTypes: ["pdf", "doc", "docx", "jpg", "jpeg", "png"],
    fileSizeLimit: 5 * 1024 * 1024,
    uploadDir: `registrationDocuments`,
};
const fileUpload = new multerService_1.FileUpload(uploadOptions);
//admin
router.post("/admin/login", (0, validate_1.validate)(authValidators_1.loginSchema), authController.loginAdmin);
//candidate
router.post("/register/candidate", (0, validate_1.validate)(authValidators_1.createCandidateSchema), authController.registerCandidate);
router.post("/verify-email/candidate", authController.verifyCandidate);
router.post("/login/candidate", (0, validate_1.validate)(authValidators_1.loginSchema), authController.loginCandidate);
router.post("/google-auth", authController.loginWithGoogle);
router.post("/generate-reset-password", 
// validate(resetPasswordSchema),
authController.sendResetPasswordLinkCandidate);
router.post("/reset-password/candidate", authController.resetPasswordCandidate);
//company
router.post("/register/company", 
// validate(createCompanySchema),
fileUpload.uploadFile("registrationDocument"), authController.registerCompany);
router.post("/verify/company", authController.verifyCompany);
router.post("/login/company", (0, validate_1.validate)(authValidators_1.loginSchema), authController.loginCompany);
router.post("/company/generate-reset-password", authController.sendResendPasswordCompany);
router.post("/company/reset-password", authController.resetPasswordCompany);
router.get("/refresh-token", authController.refreshToken);
router.get("/logout", authController.logout);
exports.default = router;
