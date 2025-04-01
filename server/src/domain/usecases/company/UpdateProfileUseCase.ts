import { HttpException } from "../../enums/http-exception";
import { HttpStatus } from "../../enums/http-status.enum";
import { ICompanyRepository } from "../../repositories/ICompanyRepository";

export class UpdateProfileUseCase {
  constructor(private companyRepository: ICompanyRepository) {}
  async execute(
    id: string,
    logo: string,
    name: string,
    description: string,
    industry: string,
    companySize: string,
    founded: string,
    website: string,
    headquarters: string,
    linkedIn: string,
    twitter: string,
    about: string
  ) {
    const response = await this.companyRepository.findByIdAndUpdateProfile(
      id,
      logo,
      name,
      description,
      industry,
      companySize,
      founded,
      website,
      headquarters,
      linkedIn,
      twitter,
      about
    );

    if (response.modifiedCount) {
      return { message: "Profile Updated Successfully" };
    }
    throw new HttpException("Profile update failed", HttpStatus.BAD_REQUEST);
  }
}
