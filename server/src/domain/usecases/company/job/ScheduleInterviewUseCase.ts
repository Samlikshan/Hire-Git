import { NotificationService } from "../../../../infrastructure/services/NotificationService";
import { Company } from "../../../entities/Company";
import { Job } from "../../../entities/Job";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { IInterviewRepository } from "../../../repositories/IInterviewRepository";
import { IJobApplicationRepository } from "../../../repositories/IJobApplicatonRepository";
import { INotificationRepository } from "../../../repositories/INotificationRepository";
import { v4 as uuidv4 } from "uuid";

export class ScheduleInterviewUseCase {
  constructor(
    private jobApplicationRepository: IJobApplicationRepository,
    private interviewRepository: IInterviewRepository,
    private notificationRepository: INotificationRepository,
    private notificationService: NotificationService
  ) {}

  async execute(
    applicationId: string,
    scheduledAt: Date,
    time: string,
    duration: string,
    timeZone: string,
    round: string,
    note: string
  ) {
    const application = await this.jobApplicationRepository.getApplication(
      applicationId
    );

    if (!application) {
      throw new HttpException("Application not found", HttpStatus.NOT_FOUND);
    }

    const roomId = uuidv4();
    const meetingLink = `/interview/${roomId}`;

    const schedule = await this.interviewRepository.schedule(
      applicationId,
      scheduledAt,
      time,
      duration,
      timeZone,
      round,
      note,
      roomId,
      meetingLink
    );

    if (!schedule) {
      throw new HttpException(
        "Scheduling interview falied",
        HttpStatus.BAD_REQUEST
      );
    }

    const response = await this.jobApplicationRepository.schedule(
      applicationId
    );

    if (!response.modifiedCount) {
      throw new HttpException(
        "Scheduling interview falied",
        HttpStatus.BAD_REQUEST
      );
    }

    const notification = {
      type: "interview",
      title: "Interview Scheduled",
      message: `Good news! Your interview for the position of ${
        (application.job as Job).title
      } at ${
        ((application?.job as Job).company as Company).name
      } has been scheduled. Please check the interview details and be prepared.`,
      read: false,
      job: (application.job as Job)._id!,
      candidate: application.candidate,
      action: {
        type: "view",
        label: "Join Interview",
        url: meetingLink,
      },
    };

    const newNotification = await this.notificationRepository.createNotificaton(
      notification
    );

    if (newNotification) {
      await this.notificationService.sendNotification(
        application.candidate,
        newNotification
      );
    }

    return { message: "Interview Scheduled successfully" };
  }
}
