import { UpdateWriteOpResult } from "mongoose";
import { Admin } from "../entities/Admin";

export interface IAdminRepository {
  findByEmail(email: string): Promise<Admin | null>;
  AcceptCompany(
    companyId: string,
    adminId: string
  ): Promise<UpdateWriteOpResult>;
  RejectCompany(
    companyId: string,
    adminId: string,
    description: string
  ): Promise<UpdateWriteOpResult>;
  blockCandidate(
    candidateId: string,
    status: boolean
  ): Promise<UpdateWriteOpResult>;
}
