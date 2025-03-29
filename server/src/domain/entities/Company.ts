import { ObjectId } from "mongoose";

export class Company {
  constructor(
    public name: string,
    public email: string,
    public contactNumber: string,
    public headquarters: string,
    public registrationDocument: string,
    public password: string,
    public industry: string,
    public isEmailVerified: boolean,
    public id?: string,
    public socialLinks?: { linkedIn: string; twitter: string } | {} | null,
    public founded?: string | null,
    public about?: string | null,
    public website?: string | null,
    public logo?: string | null,
    public description?: string | null,
    public companySize?: string | null,
    public profileCompleted?: string | null
  ) {}
}
