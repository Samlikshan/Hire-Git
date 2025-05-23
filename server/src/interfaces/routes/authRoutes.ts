import express from "express";
import { AuthController } from "../controllers/authController";
import { FileUpload } from "../../utils/multerService";
import { validate } from "../middlewares/validate";
import {
  createCandidateSchema,
  createCompanySchema,
  loginSchema,
  resetPasswordSchema,
} from "../validators/authValidators";

const router = express.Router();
const authController = new AuthController();

const uploadOptions = {
  fileTypes: ["pdf", "doc", "docx", "jpg", "jpeg", "png"],
  fileSizeLimit: 5 * 1024 * 1024,
  uploadDir: `registrationDocuments`,
};

const fileUpload = new FileUpload(uploadOptions);

//admin
router.post("/admin/login", validate(loginSchema), authController.loginAdmin);

//candidate
router.post(
  "/register/candidate",
  validate(createCandidateSchema),
  authController.registerCandidate
);
router.post("/verify-email/candidate", authController.verifyCandidate);
router.post(
  "/login/candidate",
  validate(loginSchema),
  authController.loginCandidate
);
router.post("/google-auth", authController.loginWithGoogle);

router.post(
  "/generate-reset-password",
  // validate(resetPasswordSchema),
  authController.sendResetPasswordLinkCandidate
);
router.post("/reset-password/candidate", authController.resetPasswordCandidate);

//company
router.post(
  "/register/company",
  // validate(createCompanySchema),
  fileUpload.uploadFile("registrationDocument"),
  authController.registerCompany
);

router.post("/verify/company", authController.verifyCompany);
router.post(
  "/login/company",
  validate(loginSchema),
  authController.loginCompany
);
router.post(
  "/company/generate-reset-password",
  authController.sendResendPasswordCompany
);
router.post("/company/reset-password", authController.resetPasswordCompany);

router.get("/refresh-token", authController.refreshToken);
router.get("/logout", authController.logout);
export default router;
