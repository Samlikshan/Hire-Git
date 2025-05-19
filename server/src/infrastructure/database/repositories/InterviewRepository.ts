import { Interview } from "../../../domain/entities/Interview";
import { IInterviewRepository } from "../../../domain/repositories/IInterviewRepository";
import { InterviewModel } from "../models/interviewModel";

export class InterviewRepository implements IInterviewRepository {
  async schedule(
    applicationId: string,
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
}
