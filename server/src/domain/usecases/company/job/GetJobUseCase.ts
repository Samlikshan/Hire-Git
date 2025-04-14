import { Job } from "../../../entities/Job";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { IJobRepository } from "../../../repositories/IJobRepository";

export class GetJobUseCase {
  constructor(private jobReopository: IJobRepository) { }
  async execute(jobId: string, userId: string, role: string) {
    let job = await this.jobReopository.findById(jobId);
    if (role == 'candidate') {
      const response = await this.jobReopository.getSavedJobs(userId)
      const savedJobsIds = new Set()
      response?.savedJobs.map((job) => {
        savedJobsIds.add(job._id?.toString())
      })
      if (savedJobsIds.has(jobId)) {
        const updatedJob = { ...job, isSaved: true } as Job
        job = updatedJob
      }
    }
    if (!job) {
      throw new HttpException(
        "Error finding job details. Please try again",
        HttpStatus.NOT_FOUND
      );
    }

    return { message: "Job details fetched successfully", job: job };
  }
}
