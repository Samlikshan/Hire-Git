import express from "express";
import { verifyToken } from "../middlewares/verifyTokenMiddleware";
import { ProfileController } from "../controllers/Company/profileController";
import { JobController } from "../controllers/Company/JobController";
import { FileUpload } from "../../utils/multerService";
import { JobApplicationController } from "../controllers/Company/JobApplicationController";
import { companyMiddleware } from "../middlewares/companyMiddleware";

const router = express.Router();
const profileController = new ProfileController();
const jobController = new JobController();
const jobApplicationController = new JobApplicationController();

const uploadOptions = {
  fileTypes: ["jpg", "jpeg", "png"],
  fileSizeLimit: 5 * 1024 * 1024,
  uploadDir: `profile`,
};
const fileUpload = new FileUpload(uploadOptions);

router.post(
  "/update-profile",
  verifyToken(),
  companyMiddleware(),
  fileUpload.uploadFile("logo"),
  profileController.updateProfile
);

router.get(
  "/jobs/:companyId",
  verifyToken(),
  companyMiddleware(),
  jobController.listJobs
);
router.post(
  "/job",
  verifyToken(),
  companyMiddleware(),
  jobController.createJob
);
router.get("/job/:jobId", verifyToken(), jobController.getJob);
router.put("/job", verifyToken(), companyMiddleware(), jobController.updateJob);
router.delete(
  "/job/:jobId",
  verifyToken(),
  companyMiddleware(),
  jobController.deleteJob
);
router.get(
  "/job/applicants/:jobId",
  verifyToken(),
  companyMiddleware(),
  jobApplicationController.listApplicants
);

router.patch(
  "/job/shortlist/:applicationId",
  verifyToken(),
  companyMiddleware(),
  jobApplicationController.shortlistApplicant
);

router.post(
  "/job/schedule-interview/",
  verifyToken(),
  companyMiddleware(),
  jobApplicationController.scheduleInterview
);

export default router;
