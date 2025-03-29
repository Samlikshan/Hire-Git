import { UpdateWriteOpResult } from "mongoose";
import { Admin } from "../entities/Admin";

export interface IAdminRepository {
  findByEmail(email: string): Promise<Admin | null>;
}
