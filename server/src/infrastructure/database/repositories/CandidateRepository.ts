import { UpdateWriteOpResult } from "mongoose";
import { Candidate } from "../../../domain/entities/Candidate";
import { ICandidateRepository } from "../../../domain/repositories/ICandidateRepository";
import { CandidateModel } from "../models/candidateModel";

export class CandidateRepository implements ICandidateRepository {
  async save(candidate: {
    name: string;
    email: string;
    password?: string | null;
    googleId?: string;
  }): Promise<Candidate> {
    return await CandidateModel.create({ ...candidate, isVerified: true });
  }

  async findByEmail(email: string): Promise<Candidate | null> {
    return await CandidateModel.findOne({ email: email });
  }

  async findById(id: string) {
    return await CandidateModel.findOne({ _id: id });
  }

  async findByIdAndChangePassword(id: string, password: string) {
    return await CandidateModel.updateOne(
      { _id: id },
      { $set: { password: password } }
    );
  }
}
