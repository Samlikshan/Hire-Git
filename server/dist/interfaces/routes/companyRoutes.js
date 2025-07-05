"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyTokenMiddleware_1 = require("../middlewares/verifyTokenMiddleware");
const profileController_1 = require("../controllers/Company/profileController");
const JobController_1 = require("../controllers/Company/JobController");
const multerService_1 = require("../../utils/multerService");
const JobApplicationController_1 = require("../controllers/Company/JobApplicationController");
const companyMiddleware_1 = require("../middlewares/companyMiddleware");
const DashboardController_1 = require("../controllers/Company/DashboardController");
const router = express_1.default.Router();
const profileController = new profileController_1.ProfileController();
const jobController = new JobController_1.JobController();
const jobApplicationController = new JobApplicationController_1.JobApplicationController();
const dashboardController = new DashboardController_1.DashboardController();
const uploadOptions = {
    fileTypes: ["jpg", "jpeg", "png"],
    fileSizeLimit: 5 * 1024 * 1024,
    uploadDir: `profile`,
};
const fileUpload = new multerService_1.FileUpload(uploadOptions);
router.post("/update-profile", (0, verifyTokenMiddleware_1.verifyToken)(), (0, companyMiddleware_1.companyMiddleware)(), fileUpload.uploadFile("logo"), profileController.updateProfile);
router.get("/jobs/:companyId", (0, verifyTokenMiddleware_1.verifyToken)(), (0, companyMiddleware_1.companyMiddleware)(), jobController.listJobs);
router.post("/job", (0, verifyTokenMiddleware_1.verifyToken)(), (0, companyMiddleware_1.companyMiddleware)(), jobController.createJob);
router.get("/job/:jobId", (0, verifyTokenMiddleware_1.verifyToken)(), jobController.getJob);
router.put("/job", (0, verifyTokenMiddleware_1.verifyToken)(), (0, companyMiddleware_1.companyMiddleware)(), jobController.updateJob);
router.delete("/job/:jobId", (0, verifyTokenMiddleware_1.verifyToken)(), (0, companyMiddleware_1.companyMiddleware)(), jobController.deleteJob);
router.get("/job/applicants/:jobId", (0, verifyTokenMiddleware_1.verifyToken)(), (0, companyMiddleware_1.companyMiddleware)(), jobApplicationController.listApplicants);
router.patch("/job/shortlist/:applicationId", (0, verifyTokenMiddleware_1.verifyToken)(), (0, companyMiddleware_1.companyMiddleware)(), jobApplicationController.shortlistApplicant);
router.post("/job/schedule-interview/", (0, verifyTokenMiddleware_1.verifyToken)(), (0, companyMiddleware_1.companyMiddleware)(), jobApplicationController.scheduleInterview);
router.get("/dashboard", (0, verifyTokenMiddleware_1.verifyToken)(), dashboardController.getStats);
exports.default = router;
