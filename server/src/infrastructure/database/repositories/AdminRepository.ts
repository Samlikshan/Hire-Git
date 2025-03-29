import { UpdateWriteOpResult } from "mongoose";
import { Admin } from "../../../domain/entities/Admin";
import { IAdminRepository } from "../../../domain/repositories/IAdminRepository";
import { AdminModel } from "../models/adminModel";

export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<Admin | null> {
    return AdminModel.findOne({ email: email });
  }
}
