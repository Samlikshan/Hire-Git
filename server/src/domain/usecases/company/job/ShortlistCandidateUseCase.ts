import { IJobApplicationRepository } from "../../../repositories/IJobApplicatonRepository";
import { NotificationService } from "../../../../infrastructure/services/NotificationService";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { Job } from "../../../entities/Job";
import { Company } from "../../../entities/Company";
import { INotificationRepository } from "../../../repositories/INotificationRepository";

export class ShortListCandidateUseCase {
  constructor(
    private jobApplicationRepository: IJobApplicationRepository,
    private notificationRepository: INotificationRepository,
    private notificationService: NotificationService
  ) {}

  async execute(applicationId: string) {
    const application = await this.jobApplicationRepository.getApplication(
      applicationId
    );

    if (!application) {
      throw new HttpException("Application not found", HttpStatus.NOT_FOUND);
    }

    const response = await this.jobApplicationRepository.shortlistApplicant(
      applicationId
    );

    if (!response.modifiedCount) {
      throw new HttpException(
        "Shortlisting candidate falied",
        HttpStatus.BAD_REQUEST
      );
    }
    const notification = {
      type: "job",
      title: "Application Shortlisted",
      message: `Congratulations! Your application for the ${
        (application.job as Job).title
      } at ${
        ((application?.job as Job).company as Company).name
      } has been shortlisted. Our team was impressed with your qualifications.`,
      read: false,
      job: (application.job as Job)._id!,
      candidate: application.candidate,
      action: {
        type: "view",
        label: "View Application",
        url: "/applications/meta",
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

    return { message: "Shortlisted candidate successfully" };
  }
}
