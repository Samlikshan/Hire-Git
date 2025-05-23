import express from "express";

import { JobController } from "../controllers/Candidate/JobController";
import { FileUpload } from "../../utils/multerService";
import { JobApplicationController } from "../controllers/Candidate/JobApplicationController";
import { verifyToken } from "../middlewares/verifyTokenMiddleware";
import { ProfileController } from "../controllers/Candidate/profileController";
import { NotificationController } from "../controllers/Candidate/NotificationController";

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
const notificationsController = new NotificationController();

router.get("/jobs", verifyToken(), jobController.listJobs);
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

router.put("/experience", verifyToken(), profileController.addExperience);

//Notification
router.get(
  "/unread-notifications/:candidateId",
  verifyToken(),
  notificationsController.getUnreadNotifications
);
router.get(
  "/notifications/:candidateId",
  verifyToken(),
  notificationsController.getNotifications
);
router.patch(
  "/notifications/:notificationId/read",
  notificationsController.markAsRead
);
router.patch(
  "/notifications/mark-all-as-read/:userId",
  notificationsController.markAllAsRead
);

router.get(
  "/job/applied/:candidateId",
  verifyToken(),
  jobApplicationController.getAppliedjobs
);
router.post("/save-job/:jobId", verifyToken(), jobController.saveJob);
router.get("/saved-jobs", verifyToken(), jobController.getSavedJobs);

export default router;
