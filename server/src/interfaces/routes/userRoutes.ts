import express from "express";

import { JobController } from "../controllers/Candidate/JobController";

const router = express.Router();

const jobController = new JobController();

router.get("/jobs", jobController.listJobs);

export default router;
