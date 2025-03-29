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
}
