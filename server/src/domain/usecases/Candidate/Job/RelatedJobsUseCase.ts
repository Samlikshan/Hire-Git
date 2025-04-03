import { HttpException } from "../../../enums/http-exception";
import { HttpMessage, HttpStatus } from "../../../enums/http-status.enum";
import { IJobRepository } from "../../../repositories/IJobRepository";

export class RelatedJobsUseCase {
  constructor(private jobRepository: IJobRepository) {}
  async execute(currentJobId: string) {
    const currentJob = await this.jobRepository.findTagsById(currentJobId);
    if (!currentJob) {
      {
        throw new HttpException(
          "Oops something heppened, can't find related jobs;",
          HttpStatus.BAD_REQUEST
        );
      }
    }
    let relatedJobs;
    const tags = currentJob.tags!;

    relatedJobs = await this.jobRepository.findRelatedJobsByTags(
      tags,
      currentJobId
    );
    // if (relatedJobs.length == 0) {
    //   relatedJobs = await this.jobRepository.listAllJobs();
    // }

    return { message: "Related jobs fetched successfully", relatedJobs };
  }
}
