import express from "express";
import { verifyToken } from "../middlewares/verifyTokenMiddleware";
import { ProfileController } from "../controllers/Company/profileController";
import { FileUpload } from "../../utils/multerService";

const router = express.Router();
const profileController = new ProfileController();

const uploadOptions = {
  fileTypes: ["jpg", "jpeg", "png"],
  fileSizeLimit: 5 * 1024 * 1024,
  uploadDir: `profile`,
};
const fileUpload = new FileUpload(uploadOptions);

router.post(
  "/update-profile",
  verifyToken(),
  fileUpload.uploadFile("logo"),
  profileController.updateProfile
);

export default router;
