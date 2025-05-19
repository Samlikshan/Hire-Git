import { Job } from "./Job";

// domain/entities/Dashboard.ts
export type DashboardData = {
  stats: {
    totalJobs: number;
    currentMonthJobs: number;
    totalApplicants: number;
    activeJobs: number;
  };
  recentJobs: {
    jobs: Job[];
    total: number;
    page: number;
    totalPages: number;
  };
  trends: TrendData[];
  applicantsPerJob: ApplicantsPerJob[];
};

export type TrendData = {
  label: string;
  value: number;
};

export type ApplicantsPerJob = {
  jobId: string;
  title: string;
  applicants: number;
  status: "active" | "canceled" | "closed" | "draft";
};
