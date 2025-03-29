import { UpdateWriteOpResult } from "mongoose";
import { Company } from "../../../domain/entities/Company";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { CompanyModel } from "../models/companyModel";

export class CompanyRepository implements ICompanyRepository {
  async save(company: {
    name: string;
    email: string;
    password: string;
    contactNumber: number;
    industry: string;
    headquarters: string;
    registrationDocument: string;
  }): Promise<Company> {
    return await CompanyModel.create({ ...company, isEmailVerified: true });
  }

  async findByEmail(email: string): Promise<Company | null> {
    return await CompanyModel.findOne({ email: email });
  }

  async findByEmailOrName(
    name: string,
    email: string
  ): Promise<Company | null> {
    return await CompanyModel.findOne({
      $or: [{ email: email }, { name: name }],
    });
  }
  async findById(id: string): Promise<Company | null> {
    return await CompanyModel.findById(id);
  }
  async findByIdAndChangePassword(
    id: string,
    newPassword: string
  ): Promise<UpdateWriteOpResult> {
    return await CompanyModel.updateOne(
      { _id: id },
      { $set: { password: newPassword } }
    );
  }
}
