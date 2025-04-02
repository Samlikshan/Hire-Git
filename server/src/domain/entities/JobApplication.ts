import { ObjectId } from "mongoose";
import { Job } from "./Job";

export class JobApplication {
  constructor(
    public candidate: string,
    public job: string | Job,
    public firstName: string,
    public lastName: string,
    public email: string,
    public phone: string,
    public location: string,
    public education: string,
    public currentTitle: string,
    public experience: string,
    public expectedSalary: string,
    public resume: string,
    public status:
      | "applied"
      | "shortlisted"
      | "in-progress"
      | "hired"
      | "rejected",
    public _id?: ObjectId,
    public feedBack?: string,
    public coverLetter?: string
  ) {}
}
