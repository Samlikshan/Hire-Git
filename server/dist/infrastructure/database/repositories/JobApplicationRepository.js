"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationRepository = void 0;
const jobApplicationModel_1 = require("../models/jobApplicationModel");
const jobModel_1 = require("../models/jobModel");
class JobApplicationRepository {
    createJobApplication(applicationData) {
        return __awaiter(this, void 0, void 0, function* () {
            return jobApplicationModel_1.JobApplicationModel.create(Object.assign({}, applicationData));
        });
    }
    isApplied(jobId, candidate) {
        return __awaiter(this, void 0, void 0, function* () {
            return jobApplicationModel_1.JobApplicationModel.findOne({ job: jobId, candidate: candidate });
        });
    }
    getTrendingJobsIds() {
        return jobApplicationModel_1.JobApplicationModel.aggregate([
            {
                $group: {
                    _id: "$job",
                    applicationCount: { $sum: 1 },
                },
            },
            {
                $sort: { applicationCount: -1 },
            },
            {
                $limit: 3,
            },
            {
                $project: {
                    _id: "$_id",
                },
            },
        ]);
    }
    listApplicants(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return jobApplicationModel_1.JobApplicationModel.find({ job: jobId }).populate("candidate");
        });
    }
    getApplication(applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return jobApplicationModel_1.JobApplicationModel.findById(applicationId).populate({
                path: "job",
                populate: { path: "company" },
            });
        });
    }
    shortlistApplicant(applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return jobApplicationModel_1.JobApplicationModel.updateOne({ _id: applicationId }, { $set: { status: "shortlisted" } });
        });
    }
    getAppliedJobs(candidateId) {
        return jobApplicationModel_1.JobApplicationModel.find({ candidate: candidateId }).populate({
            path: "job",
            populate: {
                path: "company",
            },
        });
    }
    schedule(applicationId) {
        return jobApplicationModel_1.JobApplicationModel.updateOne({ _id: applicationId }, { $set: { status: "scheduled" } });
    }
    countTotalApplicants(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const jobIds = yield jobModel_1.JobModel.find({ company: companyId }).distinct("_id");
            return jobApplicationModel_1.JobApplicationModel.countDocuments({ job: { $in: jobIds } });
        });
    }
    getApplicantsPerJob(companyId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const jobs = yield jobModel_1.JobModel.find(Object.assign({ company: companyId }, (status === "active" && { status: "active" })));
            return jobModel_1.JobModel.aggregate([
                {
                    $match: {
                        _id: { $in: jobs.map((j) => j._id) },
                    },
                },
                {
                    $lookup: {
                        from: "applications",
                        localField: "_id",
                        foreignField: "job",
                        as: "applications",
                    },
                },
                {
                    $project: {
                        jobId: "$_id",
                        title: 1,
                        status: 1,
                        applicants: { $size: "$applications" },
                    },
                },
                {
                    $sort: { applicants: -1 },
                },
            ]);
        });
    }
}
exports.JobApplicationRepository = JobApplicationRepository;
