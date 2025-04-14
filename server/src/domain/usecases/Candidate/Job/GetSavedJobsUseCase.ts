import { IJobRepository } from "../../../repositories/IJobRepository";

export class GetSavedJobsUseCase {
  constructor(private jobReopository: IJobRepository) { }
  async execute(userId: string) {
    const response = await this.jobReopository.getSavedJobs(userId)
    const savedJobs = response?.savedJobs.map((job) => {
      return { ...job, isSaved: true }
    })
    return savedJobs
  }
}


