import mongoose, { UpdateWriteOpResult } from "mongoose";
import { Interview } from "../../../domain/entities/Interview";
import { IInterviewRepository } from "../../../domain/repositories/IInterviewRepository";
import { InterviewModel } from "../models/interviewModel";
import { JobApplicationModel } from "../models/jobApplicationModel";

export class InterviewRepository implements IInterviewRepository {
  async schedule(
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
  ): Promise<Interview> {
    return InterviewModel.create({
      application: applicationId,
      job,
      scheduledAt,
      duration,
      time,
      round,
      timeZone,
      note,
      roomId,
      meetingLink,
    });
  }
  async ListJobInterviews(jobId: string): Promise<Interview[]> {
    return InterviewModel.find({ job: jobId, status: "scheduled" })
      .populate({
        path: "application",
        populate: { path: "candidate" },
      })
      .populate("job");
  }

  async getInterviewData(roomId: string): Promise<unknown> {
    return InterviewModel.findOne({ roomId })
      .populate({
        path: "application",
        select: "candidate",
        populate: {
          path: "candidate",
          select: "_id",
        },
      })
      .populate({
        path: "job",
        select: "company",
      });
  }

  async Evaluate(evaluation: {
    completedAt: Date;
    notes: string;
    ratings: { communication: number; cultureFit: number; technical: number };
    recommendation: string;
    roomID: string;
  }): Promise<UpdateWriteOpResult> {
    const response = await InterviewModel.updateOne(
      { roomId: evaluation.roomID },
      { $set: { evaluation: evaluation, status: "completed" } }
    );
    const result = await InterviewModel.findOne({
      roomId: evaluation.roomID,
    }).select("application -_id");

    const applicationId = result?.application;
    await JobApplicationModel.updateOne(
      { _id: applicationId },
      { $set: { status: "in-progress" } }
    );
    return response;
  }
  async ListJobHistory(candidateId: string): Promise<Interview[]> {
    return InterviewModel.find()
      .populate({
        path: "application",
        populate: { path: "candidate" },
      })
      .populate({
        path: "job",
        populate: { path: "company" },
      });
  }
  async InProgress(jobId: string): Promise<Interview[]> {
    return InterviewModel.find({
      job: jobId,
      status: { $in: ["completed", "pending", "hired"] },
    }).populate({
      path: "application",
      populate: { path: "candidate" },
    });
  }

  async Hire(interviewId: string, offerLetter: string) {
    const response = await InterviewModel.updateOne(
      {
        _id: interviewId,
      },
      {
        $set: {
          offerStatus: "pending",
          offerLetter: offerLetter,
          status: "hired",
          offerSentAt: new Date(),
        },
      }
    );
    const result = await InterviewModel.findOne({
      _id: interviewId,
    }).select("application -_id");

    const applicationId = result?.application;

    await JobApplicationModel.updateOne(
      { _id: applicationId },
      { $set: { status: "hired" } }
    );
    return response;
  }

  async Reject(interviewId: string, rejectionReason: string) {
    const response = await InterviewModel.updateOne(
      {
        _id: interviewId,
      },
      {
        $set: {
          rejectionReason: rejectionReason,
          status: "rejected",
        },
      }
    );
    const applicationId = await InterviewModel.findOne({
      _id: interviewId,
    }).select("application");
    console.log(applicationId, "application id from the repository");
    await JobApplicationModel.updateOne(
      { _id: applicationId },
      { $set: { status: "rejected" } }
    );
    return response;
  }
  async acceptOfferLetter(interviewId: string, signedOfferLetter: string) {
    return InterviewModel.updateOne(
      { _id: interviewId },
      {
        $set: { signedOfferLetter: signedOfferLetter, offerStatus: "accepted" },
      }
    );
  }
  async rejectOffer(
    interviewId: string,
    rejectionReason: string
  ): Promise<UpdateWriteOpResult> {
    return InterviewModel.updateOne(
      { _id: interviewId },
      { $set: { offerStatus: "rejected", rejectionReason: rejectionReason } }
    );
  }
}
