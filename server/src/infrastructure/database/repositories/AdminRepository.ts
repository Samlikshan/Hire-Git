import { UpdateWriteOpResult } from "mongoose";
import { Admin } from "../../../domain/entities/Admin";
import { IAdminRepository } from "../../../domain/repositories/IAdminRepository";
import { AdminModel } from "../models/adminModel";
import { CompanyModel } from "../models/companyModel";
import { CandidateModel } from "../models/candidateModel";

export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<Admin | null> {
    return AdminModel.findOne({ email: email });
  }

  async AcceptCompany(
    companyId: string,
    adminId: string
  ): Promise<UpdateWriteOpResult> {
    return CompanyModel.updateOne(
      { _id: companyId },
      {
        $set: {
          "accountStatus.status": "Accepted",
          "accountStatus.verifiedBy": adminId,
        },
      }
    );
  }

  async RejectCompany(
    companyId: string,
    adminId: string,
    description: string
  ): Promise<UpdateWriteOpResult> {
    return CompanyModel.updateOne(
      { _id: companyId },
      {
        $set: {
          "accountStatus.status": "Rejected",
          "accountStatus.description": description,
          "accountStatus.verifiedBy": adminId,
        },
      }
    );
  }

  async blockCandidate(candidateId: string, status: boolean) {
    return CandidateModel.updateOne(
      { _id: candidateId },
      { $set: { isBlocked: status } }
    );
  }
}
