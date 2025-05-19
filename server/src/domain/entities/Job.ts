import { ObjectId } from "mongoose";
import { Company } from "./Company";

export class Job {
  constructor(
    public company: ObjectId | Company,
    public title: string,
    public type: string,
    public location: string,
    public department: string,
    public description: string,
    public salary: string,
    public experienceLevel: string,
    public requirements: string[],
    public responsibilities: string[],
    public requiredSkills: string[],
    public tags: string[],
    public status: "draft" | "active" | "closed",
    public deadline: string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public deleted?: boolean,
    public _id?: string
  ) {}
}
