import express from "express";

import { JobController } from "../controllers/Candidate/JobController";
import { FileUpload } from "../../utils/multerService";
import { JobApplicationController } from "../controllers/Candidate/JobApplicationController";
import { verifyToken } from "../middlewares/verifyTokenMiddleware";
import { ProfileController } from "../controllers/Candidate/profileController";

const jobUploadOptions = {
  fileTypes: ["pdf", "jpg", "jpeg", "png"],
  fileSizeLimit: 5 * 1024 * 1024,
  uploadDir: `applicaitons`,
};

const profileuploadOptions = {
  fileTypes: ["jpg", "jpeg", "png", "pdf"],
  fileSizeLimit: 5 * 1024 * 1024,
  uploadDir: "profile",
};
const router = express.Router();

const jobController = new JobController();
const jobApplicationController = new JobApplicationController();
const profileController = new ProfileController();

const jobUpload = new FileUpload(jobUploadOptions);
const prpfileUpload = new FileUpload(profileuploadOptions);

router.get("/jobs", jobController.listJobs);
router.post(
  "/job/apply/:jobId",
  verifyToken(),
  jobUpload.uploadFields([
    { name: "resume", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
  ]),
  jobApplicationController.applyJob
);
router.get(
  "/job/applied/:jobId/:candidateId",
  verifyToken(),
  jobApplicationController.isApplied
);

router.get("/job/related/:jobId", jobController.getRelatedJobs);
router.get("/job/trending", jobController.getTrendingJobs);

router.put(
  "/profile",
  verifyToken(),
  prpfileUpload.uploadFields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  profileController.updateProfile
);

export default router;
