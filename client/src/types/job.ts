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
  isSaved?: boolean
}

export type JobFilter = {
  department?: string[];
  location?: string[];
  type?: string[];
  experience?: string[];
  status?: ("active" | "draft" | "closed")[];
};

export interface CandidateJob extends Job {
  company: {
    _id: string;
    name: string;
    logo: string;
    location: string;
  };
}

export interface Notification {
  id: string;
  type: "message" | "job" | "interview" | "reminder";
  title: string;
  company: {
    name: string;
    logo: string;
    _id: string;
  };
  candidate: string;
  job: { title: string };
  message: string;
  time: string;
  read: boolean;
  action: {
    label: string;
    type: "join" | "view" | "reply";
    url: string;
  };
  companyName?: string;
  roleName?: string;
}
