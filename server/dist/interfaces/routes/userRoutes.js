"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JobController_1 = require("../controllers/Candidate/JobController");
const multerService_1 = require("../../utils/multerService");
const JobApplicationController_1 = require("../controllers/Candidate/JobApplicationController");
const verifyTokenMiddleware_1 = require("../middlewares/verifyTokenMiddleware");
const profileController_1 = require("../controllers/Candidate/profileController");
const NotificationController_1 = require("../controllers/Candidate/NotificationController");
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
const router = express_1.default.Router();
const jobController = new JobController_1.JobController();
const jobApplicationController = new JobApplicationController_1.JobApplicationController();
const profileController = new profileController_1.ProfileController();
const jobUpload = new multerService_1.FileUpload(jobUploadOptions);
const prpfileUpload = new multerService_1.FileUpload(profileuploadOptions);
const notificationsController = new NotificationController_1.NotificationController();
router.get("/jobs", (0, verifyTokenMiddleware_1.verifyToken)(), jobController.listJobs);
router.post("/job/apply/:jobId", (0, verifyTokenMiddleware_1.verifyToken)(), jobUpload.uploadFields([
    { name: "resume", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
]), jobApplicationController.applyJob);
router.get("/job/applied/:jobId/:candidateId", (0, verifyTokenMiddleware_1.verifyToken)(), jobApplicationController.isApplied);
router.get("/job/related/:jobId", jobController.getRelatedJobs);
router.get("/job/trending", jobController.getTrendingJobs);
router.put("/profile", (0, verifyTokenMiddleware_1.verifyToken)(), prpfileUpload.uploadFields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 },
]), profileController.updateProfile);
router.put("/experience", (0, verifyTokenMiddleware_1.verifyToken)(), profileController.addExperience);
//Notification
router.get("/unread-notifications/:candidateId", (0, verifyTokenMiddleware_1.verifyToken)(), notificationsController.getUnreadNotifications);
router.get("/notifications/:candidateId", (0, verifyTokenMiddleware_1.verifyToken)(), notificationsController.getNotifications);
router.patch("/notifications/:notificationId/read", notificationsController.markAsRead);
router.patch("/notifications/mark-all-as-read/:userId", notificationsController.markAllAsRead);
router.get("/job/applied/:candidateId", (0, verifyTokenMiddleware_1.verifyToken)(), jobApplicationController.getAppliedjobs);
router.post("/save-job/:jobId", (0, verifyTokenMiddleware_1.verifyToken)(), jobController.saveJob);
router.get("/saved-jobs", (0, verifyTokenMiddleware_1.verifyToken)(), jobController.getSavedJobs);
exports.default = router;
