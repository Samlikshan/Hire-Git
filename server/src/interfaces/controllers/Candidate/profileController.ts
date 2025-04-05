import { NextFunction, Request, Response } from "express";
import { CandidateRepository } from "../../../infrastructure/database/repositories/CandidateRepository";
import { UpdateProfileUseCase } from "../../../domain/usecases/Candidate/UpdateProfileUseCase";
import { CreateExperienceUseCase } from "../../../domain/usecases/Candidate/CreateExperienceUseCase";

export class ProfileController {
  private candidateRepository = new CandidateRepository();

  private updateProfileUseCase = new UpdateProfileUseCase(
    this.candidateRepository
  );
  private createExperienceUseCase = new CreateExperienceUseCase(
    this.candidateRepository
  );
  updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        id,
        name,
        profession = "",
        bio = "",
        skills = [],
        gitHub = "",
        linkedIn = "",
      } = req.body;

      const existingProfile = await this.candidateRepository.findById(id);

      if (!existingProfile) {
        res.status(404).json({ error: "Candidate profile not found" });
        return;
      }
      let profileImage = existingProfile?.profileImage ?? "";
      if (
        req.files &&
        typeof req.files === "object" &&
        "profileImage" in req.files
      ) {
        profileImage =
          (req.files["profileImage"] as Express.MulterS3.File[])[0]?.key ?? "";
      }
      let resume = existingProfile?.resume ?? "";
      if (req.files && typeof req.files === "object" && "resume" in req.files) {
        resume = (req.files["resume"] as Express.MulterS3.File[])[0]?.key ?? "";
      }

      const response = await this.updateProfileUseCase.execute(
        id,
        name,
        profession,
        bio,
        profileImage,
        JSON.parse(skills),
        resume,
        gitHub,
        linkedIn
      );

      res.json({
        message: response.message,
        image: profileImage,
        resume: resume ? resume : null,
      });
    } catch (error) {
      next(error);
    }
  };

  addExperience = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { jobTitle, company, startDate, endDate, description, location } =
        req.body;
      const candidateId = req.user?.id;
      const response = await this.createExperienceUseCase.execute(
        candidateId!,
        {
          jobTitle,
          company,
          startDate,
          endDate,
          description,
          location,
        }
      );

      res.json({ message: response.message });
    } catch (error) {
      next(error);
    }
  };
}
