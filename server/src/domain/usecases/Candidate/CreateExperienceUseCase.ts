import { ICandidateRepository } from "../../repositories/ICandidateRepository";

export class CreateExperienceUseCase {
  constructor(private candidateRepository: ICandidateRepository) {}
  async execute(
    candidateId: string,
    experience: {
      jobTitle: string;
      company: string;
      startDate: Date;
      endDate: Date;
      description: string;
      location: string;
    }
  ) {
    const response = await this.candidateRepository.findAndCreateExperience(
      candidateId,
      experience.jobTitle,
      experience.company,
      experience.startDate,
      experience.endDate,
      experience.description,
      experience.location
    );

    if (!response.modifiedCount) {
      return { message: "Failed adding experience, please try again." };
    }

    return { message: "Experience addedd successfully" };
  }
}
