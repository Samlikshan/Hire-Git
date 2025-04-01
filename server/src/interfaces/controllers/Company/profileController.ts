import { NextFunction, Request, Response } from "express";
import { UpdateProfileUseCase } from "../../../domain/usecases/company/UpdateProfileUseCase";
import { CompanyRepository } from "../../../infrastructure/database/repositories/CompanyRepository";

export class ProfileController {
  private companyRepository = new CompanyRepository();
  private updateProfileUseCase = new UpdateProfileUseCase(
    this.companyRepository
  );

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        _id,
        name = "",
        description = "",
        industry = "",
        companySize = "",
        founded = "",
        website = "",
        headquarters = "",
        linkedIn = "",
        twitter = "",
        about = "",
      } = req.body;

      let logo = req.body.logo;
      if (req.file) {
        logo = (req.file as Express.MulterS3.File).key || req.body.logo;
      }

      const response = await this.updateProfileUseCase.execute(
        _id,
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

      res.json({ message: response.message, logo: logo });
    } catch (error) {
      next(error);
    }
  };
}
