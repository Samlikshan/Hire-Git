import { IJobRepository } from "../../../repositories/IJobRepository";

export class SaveJobUseCase {
  constructor(private jobReopository: IJobRepository) { }
  async execute(userId: string, jobId: string) {
    const isSaved = await this.jobReopository.isSavedJob(userId, jobId);
    if (!isSaved) {
      await this.jobReopository.saveJob(userId, jobId)
    } else {
      await this.jobReopository.removeJob(userId, jobId)
    }

    return { message: `Job ${isSaved ? `removed from` : `added to`} saved list` };
  }
}


