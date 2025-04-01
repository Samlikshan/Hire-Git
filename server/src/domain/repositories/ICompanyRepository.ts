import { UpdateWriteOpResult } from "mongoose";
import { Company } from "../entities/Company";

export interface ICompanyRepository {
  save(candidate: {
    name: string;
    email: string;
    password: string;
    contactNumber: number;
    industry: string;
    headquarters: string;
    registrationDocument: string;
  }): Promise<Company>;
  findByEmail(email: string): Promise<Company | null>;
  findByEmailOrName(name: string, email: string): Promise<Company | null>;
  findById(id: string): Promise<Company | null>;
  findByIdAndChangePassword(
    id: string,
    newPassword: string
  ): Promise<UpdateWriteOpResult>;
  listByStatus(): Promise<Company[]>;
  listAllCompany(): Promise<Company[]>;
}
