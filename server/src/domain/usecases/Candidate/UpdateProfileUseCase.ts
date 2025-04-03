import { HttpException } from "../../enums/http-exception";
import { HttpStatus } from "../../enums/http-status.enum";
import { ICandidateRepository } from "../../repositories/ICandidateRepository";

export class UpdateProfileUseCase {
  constructor(private candidateRepository: ICandidateRepository) {}
  async execute(
    id: string,
    name: string,
    profession: string,
    bio: string,
    profileImage: string,
    skill: string[],
    resume: string,
    gitHub: string,
    linkedIn: string
  ) {
    const response = await this.candidateRepository.findAndUpdateProfile(
      id,
      name,
      profession,
      bio,
      profileImage,
      skill,
      resume,
      gitHub,
      linkedIn
    );
    if (response.modifiedCount) {
      return { message: "Profile Updated Successfully" };
    }
    throw new HttpException("Profile update failed", HttpStatus.BAD_REQUEST);
  }
}
