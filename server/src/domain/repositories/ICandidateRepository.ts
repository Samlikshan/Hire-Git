import { UpdateWriteOpResult } from "mongoose";
import { Candidate } from "../entities/Candidate";

export interface ICandidateRepository {
  save(candidate: {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
  }): Promise<Candidate>;
  findByEmail(email: string): Promise<Candidate | null>;
  findById(id: string): Promise<Candidate | null>;
  findByIdAndChangePassword(
    id: string,
    password: string
  ): Promise<UpdateWriteOpResult>;
}
