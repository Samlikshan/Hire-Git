import { Document } from "mongoose";
import { Candidate } from "../../../server/src/domain/entities/Candidate";

// ==================== UTILITY TYPES ====================

// ==================== INTERVIEW TYPES ====================
type InterviewStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "pending"
  | "hired"
  | "rejected";

type InterviewMode = "video" | "phone" | "in-person";
type OfferStatus = "pending" | "accepted" | "rejected" | null;
type Recommendation = "hire" | "hold" | "reject";

interface EvaluationRatings {
  communication: number; // 1-5
  technical: number; // 1-5
  cultureFit: number; // 1-5
}

interface Evaluation {
  completedAt: Date;
  ratings: EvaluationRatings;
  notes: string;
  recommendation?: Recommendation;
}

export interface Interview extends Document {
  _id: string;
  application: string; // ObjectId as string
  job: string; // ObjectId as string
  scheduledAt: Date;
  duration: string;
  time: string;
  timeZone: string;
  roomId: string;
  meetingLink: string;
  round: string;
  mode: InterviewMode;
  cancelReason?: string;
  status: InterviewStatus;
  offerLetter?: string;
  offerStatus?: OfferStatus;
  signedOfferLetter?: string;
  offerSentAt?: Date;
  offerAcceptedAt?: Date;
  offerRejectedAt?: Date;
  candidateFeedback?: string;
  rejectionReason?: string;
  feedback?: string;
  evaluation?: Evaluation;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== JOB APPLICATION TYPES ====================
type ApplicationStatus =
  | "applied"
  | "shortlisted"
  | "in-progress"
  | "hired"
  | "rejected";

export interface JobApplication extends Document {
  _id: string;
  candidate: string; // ObjectId as string
  job: string; // ObjectId as string
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  education: string;
  currentTitle: string;
  experience: string;
  expectedSalary: string;
  resume: string;
  coverLetter?: string;
  status: ApplicationStatus;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== JOB TYPES ====================
type JobStatus = "draft" | "active" | "closed";

export interface Job extends Document {
  _id: string;
  company: string; // ObjectId as string
  title: string;
  type: string;
  location: string;
  department: string;
  description: string;
  salary: string;
  experienceLevel: string;
  requirements?: string[];
  responsibilities?: string[];
  requiredSkills: string[];
  tags: string[];
  status: JobStatus;
  deadline: Date;
  deleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== COMPANY TYPES ====================
interface SocialLinks {
  linkedIn?: string;
  twitter?: string;
}

type AccountStatusState = "Accepted" | "Rejected" | "Pending";

interface AccountStatus {
  status: AccountStatusState;
  description?: string;
  verifiedBy?: string; // ObjectId as string
}

export interface Company extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  registrationDocument: string;
  headquarters: string;
  website?: string;
  description?: string;
  logo?: string;
  socialLinks?: SocialLinks;
  about?: string;
  founded?: string;
  companySize?: string;
  industry: string;
  isEmailVerified?: boolean;
  accountStatus?: AccountStatus;
  isProfileCompleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== POPULATED TYPES ====================
export interface PopulatedInterview
  extends Omit<Interview, "application" | "job"> {
  application: JobApplication;
  job: Job;
}

export interface PopulatedJobApplication
  extends Omit<JobApplication, "candidate" | "job"> {
  candidate: Candidate; // Define Candidate type if available
  job: Job;
}

// ==================== TYPE GUARDS ====================
export function isInterviewStatus(status: string): status is InterviewStatus {
  return [
    "scheduled",
    "completed",
    "cancelled",
    "pending",
    "hired",
    "rejected",
  ].includes(status);
}

export function isValidRating(rating: number): rating is 1 | 2 | 3 | 4 | 5 {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

// ==================== CREATE DTOS ====================
export type InterviewCreate = Omit<
  Interview,
  "_id" | "createdAt" | "updatedAt" | "evaluation" | "offerStatus"
>;

export type JobApplicationCreate = Omit<
  JobApplication,
  "_id" | "createdAt" | "updatedAt" | "status"
>;
