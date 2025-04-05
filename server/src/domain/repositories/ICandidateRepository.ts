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
  listCandidates(): Promise<Candidate[]>;
  findAndUpdateProfile(
    id: string,
    name: string,
    profession: string,
    bio: string,
    profileImage: string,
    skills: string[],
    resume: string,
    gitHub: string,
    linkedIn: string
  ): Promise<UpdateWriteOpResult>;
  findAndCreateExperience(
    candidateId: string,
    jobTitle: string,
    company: string,
    startDate: Date,
    endDate: Date,
    description: string,
    location: string
  ): Promise<UpdateWriteOpResult>;
}
