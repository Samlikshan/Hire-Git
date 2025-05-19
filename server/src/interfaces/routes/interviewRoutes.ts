import express from "express";
import { InterviewController } from "../controllers/Company/InterviewController";
import { FileUpload } from "../../utils/multerService";
import { verifyToken } from "../middlewares/verifyTokenMiddleware";

const router = express.Router();
const interviewController = new InterviewController();
const offerLetter = new FileUpload({
  fileTypes: ["pdf", "doc"],
  fileSizeLimit: 5 * 1024 * 1024, // 5MB
  uploadDir: "offer_letters",
});
const signedOfferLetter = new FileUpload({
  fileTypes: ["pdf", "doc"],
  fileSizeLimit: 5 * 1024 * 1024, // 5MB
  uploadDir: "signed_offer_letters",
});
router.get("/list-interviews/:jobId", interviewController.listInterviews);
router.get(
  "/validate/:roomId",
  verifyToken(),
  interviewController.validateRoomAccess
);
router.put("/evaluate-candidate", verifyToken(), interviewController.evaluate);
router.get(
  "/job-history/:candidateId",
  verifyToken(),
  interviewController.listJobHistory
);
router.get(
  "/in-progress/:jobId",
  verifyToken(),
  interviewController.listInProgress
);
router.post(
  "/:interviewId/hire",
  verifyToken(),
  offerLetter.uploadFile("offerLetter"),
  interviewController.hire
);
router.post("/:interviewId/reject", verifyToken(), interviewController.reject);
router.post(
  "/:interviewId/accept-offer",
  verifyToken(),
  signedOfferLetter.uploadFile("signedOfferLetter"),
  interviewController.acceptOfferLetter
);
router.post(
  "/:interviewId/reject-offer",
  verifyToken(),
  interviewController.rejectOfferLetter
);

export default router;
