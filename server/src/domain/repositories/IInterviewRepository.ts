import { UpdateWriteOpResult } from "mongoose";
import { Interview } from "../entities/Interview";

export interface IInterviewRepository {
  schedule(
    applicationId: string,
    job: string,
    scheduledAt: Date,
    time: string,
    duration: string,
    timeZone: string,
    round: string,
    note: string | null,
    roomId: string,
    meetingLink: string
  ): Promise<Interview>;
  ListJobInterviews(jobId: string): Promise<Interview[]>;
  getInterviewData(roomId: string): Promise<unknown>;
  Evaluate(evaluation: {
    completedAt: Date;
    notes: string;
    ratings: { communication: number; cultureFit: number; technical: number };
    recommendation: string;
    roomID: string;
  }): Promise<UpdateWriteOpResult>;
  ListJobHistory(candidateId: string): Promise<Interview[]>;
  InProgress(jobId: string): Promise<Interview[]>;
  Hire(interviewId: string, offerLetter: string): Promise<UpdateWriteOpResult>;
  Reject(
    interviewId: string,
    rejectionReason: string
  ): Promise<UpdateWriteOpResult>;
  acceptOfferLetter(
    interviewId: string,
    signedOfferLetter: string
  ): Promise<UpdateWriteOpResult>;
  rejectOffer(
    interviewId: string,
    rejectionReason: string
  ): Promise<UpdateWriteOpResult>;
}
