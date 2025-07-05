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

  async listByStatus() {
    return await CompanyModel.find({ "accountStatus.status": "Pending" });
  }

  async listAllCompany(params: {
    page: number;
    limit: number;
    search: string;
  }): Promise<{ companies: Company[]; total: number }> {
    const skip = (params.page - 1) * params.limit;

    const total = await CompanyModel.countDocuments({
      name: { $regex: params.search, $options: "i" },
    });

    const companies = await CompanyModel.find({
      name: { $regex: params.search, $options: "i" },
    })
      .skip(skip)
      .limit(params.limit)
      .select(
        "name email contactNumber industry registrationDocument accountStatus"
      );
    return { companies, total };
  }

  async findByIdAndUpdateProfile(
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
  ): Promise<UpdateWriteOpResult> {
    return await CompanyModel.updateOne(
      { _id: id },
      {
        $set: {
          logo: logo,
          name: name,
          description: description,
          industry: industry,
          companySize: companySize,
          founded: founded,
          website: website,
          headquarters: headquarters,
          "socialLinks.linkedIn": linkedIn,
          "socialLinks.twitter": twitter,
          about: about,
        },
      }
    );
  }
}
