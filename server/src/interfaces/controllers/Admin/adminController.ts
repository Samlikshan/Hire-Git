import { NextFunction, Request, Response } from "express";
import { CompanyRepository } from "../../../infrastructure/database/repositories/CompanyRepository";
import { ListCompanyUseCase } from "../../../domain/usecases/Admin/ListCompanyUseCase";
import { ListPendingCompaniesUseCase } from "../../../domain/usecases/Admin/ListPendingCompaniesUseCase";
import { ReviewCompanyUseCase } from "../../../domain/usecases/Admin/ReveiwCompanyUseCase";
import { AdminRepository } from "../../../infrastructure/database/repositories/AdminRepository";
export class AdminController {
  private adminRepository = new AdminRepository();
  private companyRepository = new CompanyRepository();
  private listCompaniesUseCase = new ListCompanyUseCase(this.companyRepository);
  private listPendingCompaniesUseCase = new ListPendingCompaniesUseCase(
    this.companyRepository
  );
  private reviewCompanyUseCase = new ReviewCompanyUseCase(
    this.companyRepository,
    this.adminRepository
  );

  listPendingCompanies = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await this.listPendingCompaniesUseCase.execute();
      res.json({ companies: response });
    } catch (error: unknown) {
      next(error);
    }
  };

  listCompanies = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.listCompaniesUseCase.execute();
      res.json({
        companies: response,
        message: "Fetched Companies Successfully",
      });
    } catch (error: unknown) {
      next(error);
    }
  };

  reveiwCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { companyId, adminId, action, description } = req.body;
      const response = await this.reviewCompanyUseCase.execute(
        companyId,
        adminId,
        action,
        description
      );
      res.json({ message: response?.message });
    } catch (error: unknown) {
      next(error);
    }
  };
}
