export interface Job {
  _id?: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experienceLevel: string;
  salary: string;
  applicants: number;
  posted: string;
  deadline: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  requiredSkills: string[];
  status: "active" | "draft" | "closed";
  createdAt: Date;
  tags: string[];
}

export type JobFilter = {
  department?: string[];
  location?: string[];
  type?: string[];
  experience?: string[];
  status?: ("active" | "draft" | "closed")[];
};
