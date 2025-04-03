import express from "express";

import { JobController } from "../controllers/Candidate/JobController";
import { FileUpload } from "../../utils/multerService";
import { JobApplicationController } from "../controllers/Candidate/JobApplicationController";
import { verifyToken } from "../middlewares/verifyTokenMiddleware";

const jobUploadOptions = {
  fileTypes: ["pdf", "jpg", "jpeg", "png"],
  fileSizeLimit: 5 * 1024 * 1024,
  uploadDir: `applicaitons`,
};
const router = express.Router();

const jobController = new JobController();
const jobApplicationController = new JobApplicationController();
const jobUpload = new FileUpload(jobUploadOptions);

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

export default router;
