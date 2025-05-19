import mongoose from "mongoose";
import { Job } from "../../../entities/Job";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { IJobRepository } from "../../../repositories/IJobRepository";
import { SubscriptionGuard } from "../../../services/SubscriptionGaurd";

export class CreateJobUseCase {
  constructor(
    private jobRepository: IJobRepository,
    private subscriptionGuard: SubscriptionGuard
  ) {}
  async execute(jobData: Job) {
    const haveSubscription = await this.subscriptionGuard.haveSubscripton(
      jobData.company.toString()
    );
    if (!haveSubscription) {
      throw new HttpException(
        "You don't have any active plan, Please try to purchase a subscription",
        HttpStatus.FORBIDDEN
      );
    }
    const canPost = await this.subscriptionGuard.checkLimit(
      jobData.company.toString(),
      "jobpost"
    );

    if (!canPost) {
      throw new HttpException(
        "Job post limit reached for this plan",
        HttpStatus.FORBIDDEN
      );
    }

    const job = await this.jobRepository.createJob(jobData);

    if (!job) {
      throw new HttpException(
        "Error creating job post. please try again.",
        HttpStatus.BAD_REQUEST
      );
    }

    await this.subscriptionGuard.incrementUsage(
      jobData.company.toString(),
      "jobpost"
    );

    return { message: "Job post created Successfully", job: job };
  }
}
