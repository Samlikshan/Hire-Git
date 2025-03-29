import express from "express";
import { AuthController } from "../controllers/authController";
import { FileUpload } from "../../utils/multerService";

const router = express.Router();
const authController = new AuthController();

const uploadOptions = {
  fileTypes: ["pdf", "doc", "docx", "jpg", "jpeg", "png"],
  fileSizeLimit: 5 * 1024 * 1024,
  uploadDir: `registrationDocuments`,
};

const fileUpload = new FileUpload(uploadOptions);

//admin
router.post("/admin/login", authController.loginAdmin);

//candidate
router.post("/register/candidate", authController.registerCandidate);
router.post("/verify-email/candidate", authController.verifyCandidate);
router.post("/login/candidate", authController.loginCandidate);
router.post("/google-auth", authController.loginWithGoogle);

//company
router.post(
  "/register/company",
  fileUpload.uploadFile("registrationDocument"),
  authController.registerCompany
);

router.post("/verify/company", authController.verifyCompany);
router.post("/login/company", authController.loginCompany);
router.post(
  "/company/generate-reset-password",
  authController.sendResendPasswordCompany
);
router.post("/company/reset-password", authController.resetPasswordCompany);

router.get("/logout", authController.logout);
export default router;
