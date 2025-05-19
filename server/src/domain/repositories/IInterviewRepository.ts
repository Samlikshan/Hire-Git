import { Interview } from "../entities/Interview";

export interface IInterviewRepository {
  schedule(
    applicationId: string,
    scheduledAt: Date,
    time: string,
    duration: string,
    timeZone: string,
    round: string,
    note: string | null,
    roomId: string,
    meetingLink: string
  ): Promise<Interview>;
}
