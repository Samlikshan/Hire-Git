"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const InterviewController_1 = require("../controllers/Company/InterviewController");
const multerService_1 = require("../../utils/multerService");
const verifyTokenMiddleware_1 = require("../middlewares/verifyTokenMiddleware");
const router = express_1.default.Router();
const interviewController = new InterviewController_1.InterviewController();
const offerLetter = new multerService_1.FileUpload({
    fileTypes: ["pdf", "doc"],
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    uploadDir: "offer_letters",
});
const signedOfferLetter = new multerService_1.FileUpload({
    fileTypes: ["pdf", "doc"],
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    uploadDir: "signed_offer_letters",
});
router.get("/list-interviews/:jobId", interviewController.listInterviews);
router.get("/validate/:roomId", (0, verifyTokenMiddleware_1.verifyToken)(), interviewController.validateRoomAccess);
router.put("/evaluate-candidate", (0, verifyTokenMiddleware_1.verifyToken)(), interviewController.evaluate);
router.get("/job-history/:candidateId", (0, verifyTokenMiddleware_1.verifyToken)(), interviewController.listJobHistory);
router.get("/in-progress/:jobId", (0, verifyTokenMiddleware_1.verifyToken)(), interviewController.listInProgress);
router.post("/:interviewId/hire", (0, verifyTokenMiddleware_1.verifyToken)(), offerLetter.uploadFile("offerLetter"), interviewController.hire);
router.post("/:interviewId/reject", (0, verifyTokenMiddleware_1.verifyToken)(), interviewController.reject);
router.post("/:interviewId/accept-offer", (0, verifyTokenMiddleware_1.verifyToken)(), signedOfferLetter.uploadFile("signedOfferLetter"), interviewController.acceptOfferLetter);
router.post("/:interviewId/reject-offer", (0, verifyTokenMiddleware_1.verifyToken)(), interviewController.rejectOfferLetter);
exports.default = router;
