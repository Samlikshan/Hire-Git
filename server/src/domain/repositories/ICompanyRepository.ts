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
  listAllCompany(params: {
    page: number;
    limit: number;
    search: string;
  }): Promise<{ companies: Company[]; total: number }>;
  findByIdAndUpdateProfile(
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
  ): Promise<UpdateWriteOpResult>;
}
