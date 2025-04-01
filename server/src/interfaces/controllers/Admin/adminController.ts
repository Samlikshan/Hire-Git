import { NextFunction, Request, Response } from "express";
import { ListCompanyUseCase } from "../../../domain/usecases/Admin/ListCompanyUseCase";
import { ReviewCompanyUseCase } from "../../../domain/usecases/Admin/ReveiwCompanyUseCase";
import { CompanyRepository } from "../../../infrastructure/database/repositories/CompanyRepository";
import { AdminRepository } from "../../../infrastructure/database/repositories/AdminRepository";
import { ListPendingCompaniesUseCase } from "../../../domain/usecases/Admin/ListPendingCompaniesUseCase";
import { ListCandidatesUseCase } from "../../../domain/usecases/Admin/ListCandidatesUseCase";
import { CandidateRepository } from "../../../infrastructure/database/repositories/CandidateRepository";
import { BlockCandidateUseCase } from "../../../domain/usecases/Admin/BlockCandidateUseCase";

export class AdminController {
  private adminRepository = new AdminRepository();
  private companyRepository = new CompanyRepository();
  private candidateRepository = new CandidateRepository();
  private listCompaniesUseCase = new ListCompanyUseCase(this.companyRepository);
  private listPendingCompaniesUseCase = new ListPendingCompaniesUseCase(
    this.companyRepository
  );
  private reviewCompanyUseCase = new ReviewCompanyUseCase(
    this.companyRepository,
    this.adminRepository
  );

  //cadidate
  private listCandidateUseCase = new ListCandidatesUseCase(
    this.candidateRepository
  );
  private blockCandidateUseCase = new BlockCandidateUseCase(
    this.candidateRepository,
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

  listCandidates = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await this.listCandidateUseCase.execute();
      res.json({ candidates: response });
    } catch (error: unknown) {
      next(error);
    }
  };

  blockCandidate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { candidateId, status } = req.body;
      const response = await this.blockCandidateUseCase.execute(
        candidateId,
        status
      );
      res.json({ message: response?.message });
    } catch (error: unknown) {
      next(error);
    }
  };
}
