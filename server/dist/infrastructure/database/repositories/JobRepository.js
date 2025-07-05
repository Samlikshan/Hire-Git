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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRepository = void 0;
const jobModel_1 = require("../models/jobModel");
const candidateModel_1 = require("../models/candidateModel");
const mongoose_1 = __importDefault(require("mongoose"));
const date_fns_1 = require("date-fns");
class JobRepository {
    createJob(jobData) {
        return __awaiter(this, void 0, void 0, function* () {
            return jobModel_1.JobModel.create(Object.assign({}, jobData));
        });
    }
    findJobsByCompany(companyId, page, limit, filters, search) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const query = {
                company: companyId,
                deleted: false,
            };
            if (filters.status) {
                query.status = filters.status;
            }
            if ((_a = filters.department) === null || _a === void 0 ? void 0 : _a.length) {
                query.department = { $in: filters.department };
            }
            if ((_b = filters.location) === null || _b === void 0 ? void 0 : _b.length) {
                query.location = { $in: filters.location };
            }
            if ((_c = filters.type) === null || _c === void 0 ? void 0 : _c.length) {
                query.type = { $in: filters.type };
            }
            if ((_d = filters.experience) === null || _d === void 0 ? void 0 : _d.length) {
                query.experienceLevel = { $in: filters.experience };
            }
            if (search) {
                query.$text = { $search: search };
            }
            const total = yield jobModel_1.JobModel.countDocuments(query);
            const jobs = yield jobModel_1.JobModel.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();
            return { jobs, total };
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return jobModel_1.JobModel.findOne({ _id: id }).populate("company").lean();
        });
    }
    updateJob(updatedDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            return jobModel_1.JobModel.updateOne({ _id: updatedDetails._id }, { $set: Object.assign({}, updatedDetails) });
        });
    }
    deleteJobById(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return jobModel_1.JobModel.updateOne({ _id: jobId }, { $set: { deleted: true } });
        });
    }
    listAllJobs(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                status: "active",
                deleted: false,
            };
            // Search filter
            if (params.search) {
                query.$or = [
                    { title: { $regex: params.search, $options: "i" } },
                    { description: { $regex: params.search, $options: "i" } },
                    { tags: { $regex: params.search, $options: "i" } },
                ];
            }
            // Add other filters
            const filterMapping = {
                type: params.filters.types,
                department: params.filters.departments,
                location: params.filters.locations,
                experienceLevel: params.filters.experience,
            };
            Object.entries(filterMapping).forEach(([key, values]) => {
                if (values && values.length > 0) {
                    query[key] = { $in: values };
                }
            });
            // Handle tags filter
            if (params.filters.tags.length > 0) {
                query.tags = { $all: params.filters.tags };
            }
            const skip = (params.page - 1) * params.limit;
            const [jobs, total] = yield Promise.all([
                jobModel_1.JobModel.find(query)
                    .populate("company")
                    .skip(skip)
                    .limit(params.limit)
                    .lean()
                    .exec(),
                jobModel_1.JobModel.countDocuments(query),
            ]);
            return { jobs, total };
        });
    }
    findTagsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return jobModel_1.JobModel.findOne({ _id: id }).select("tags");
        });
    }
    findRelatedJobsByTags(tags, currentJobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return jobModel_1.JobModel.find({ _id: { $ne: currentJobId }, tags: { $in: tags } });
        });
    }
    getTrendingJobs(jobIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return jobModel_1.JobModel.find({ _id: { $in: jobIds } }).populate("company", "_id name logo");
        });
    }
    isSavedJob(userId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return candidateModel_1.CandidateModel.findOne({ _id: userId, savedJobs: { $in: [jobId] } });
        });
    }
    saveJob(userId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return candidateModel_1.CandidateModel.updateOne({ _id: userId }, { $addToSet: { savedJobs: jobId } });
        });
    }
    removeJob(userId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return candidateModel_1.CandidateModel.updateOne({ _id: userId }, { $pull: { savedJobs: jobId } });
        });
    }
    getSavedJobs(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return candidateModel_1.CandidateModel.findOne({ _id: userId })
                .populate({ path: "savedJobs", populate: "company" })
                .select("savedJobs")
                .lean();
        });
    }
    countActiveJobs(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return jobModel_1.JobModel.countDocuments({
                company: companyId,
                status: "active",
                deleted: false,
            });
        });
    }
    countJobs(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return jobModel_1.JobModel.countDocuments({
                company: companyId,
                deleted: false,
            });
        });
    }
    countMonthlyJobs(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = (0, date_fns_1.startOfMonth)(new Date());
            const end = (0, date_fns_1.endOfMonth)(new Date());
            return jobModel_1.JobModel.countDocuments({
                company: companyId,
                createdAt: { $gte: start, $lte: end },
            });
        });
    }
    listCompanyJobs(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { companyId, page = 1, limit = 5, status } = params;
            const skip = (page - 1) * limit;
            const query = {
                company: companyId,
                deleted: false,
            };
            if (status === "active") {
                query.status = "active";
            }
            const [jobs, total] = yield Promise.all([
                jobModel_1.JobModel.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                jobModel_1.JobModel.countDocuments(query),
            ]);
            return {
                jobs,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        });
    }
    // infrastructure/repositories/JobRepository.ts
    getJobTrends(companyId, timeframe) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupFormat = timeframe === "weekly" ? "%Y-%U" : "%Y-%m";
            return jobModel_1.JobModel.aggregate([
                {
                    $match: {
                        company: new mongoose_1.default.Types.ObjectId(companyId),
                        createdAt: { $exists: true },
                    },
                },
                {
                    $group: {
                        _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
                {
                    $project: {
                        label: "$_id",
                        value: "$count",
                        _id: 0,
                    },
                },
            ]);
        });
    }
}
exports.JobRepository = JobRepository;
