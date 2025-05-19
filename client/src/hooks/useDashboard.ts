import { useState, useEffect } from "react";

// Types for our dashboard data
export interface Job {
  id: string;
  title: string;
  department: string;
  postedDate: string;
  status: "active" | "paused" | "closed";
  applicants: number;
}

export interface Interview {
  id: string;
  candidateName: string;
  candidateAvatar?: string;
  position: string;
  date: string;
  type: "video" | "phone" | "in-person";
  status: "scheduled" | "completed" | "canceled";
}

export interface TrendData {
  labels: string[];
  values: number[];
}

export interface DashboardData {
  totalJobs: number;
  currentMonthJobs: number;
  totalApplicants: number;
  activeJobs: number;
  jobs: Job[];
  interviews: Interview[];
  weeklyTrends: TrendData;
  monthlyTrends: TrendData;
}

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real application, this would be an API call
        // For demo purposes, we're simulating a delay and returning mock data
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Mock data
        const mockData: DashboardData = {
          totalJobs: 127,
          currentMonthJobs: 18,
          totalApplicants: 3456,
          activeJobs: 24,
          jobs: [
            {
              id: "job-1",
              title: "Senior React Developer",
              department: "Engineering",
              postedDate: "2025-04-15T00:00:00Z",
              status: "active",
              applicants: 37,
            },
            {
              id: "job-2",
              title: "Product Manager",
              department: "Product",
              postedDate: "2025-04-10T00:00:00Z",
              status: "active",
              applicants: 24,
            },
            {
              id: "job-3",
              title: "UI/UX Designer",
              department: "Design",
              postedDate: "2025-04-05T00:00:00Z",
              status: "active",
              applicants: 19,
            },
            {
              id: "job-4",
              title: "Marketing Specialist",
              department: "Marketing",
              postedDate: "2025-03-28T00:00:00Z",
              status: "paused",
              applicants: 12,
            },
            {
              id: "job-5",
              title: "Frontend Developer",
              department: "Engineering",
              postedDate: "2025-03-20T00:00:00Z",
              status: "closed",
              applicants: 45,
            },
            {
              id: "job-6",
              title: "Data Analyst",
              department: "Data Science",
              postedDate: "2025-03-15T00:00:00Z",
              status: "active",
              applicants: 28,
            },
            {
              id: "job-7",
              title: "Customer Success Manager",
              department: "Customer Support",
              postedDate: "2025-03-10T00:00:00Z",
              status: "closed",
              applicants: 32,
            },
          ],
          interviews: [
            {
              id: "int-1",
              candidateName: "Alex Morgan",
              position: "Senior React Developer",
              date: "2025-05-05T14:30:00Z",
              type: "video",
              status: "scheduled",
            },
            {
              id: "int-2",
              candidateName: "Jamie Chen",
              position: "Product Manager",
              date: "2025-05-06T10:00:00Z",
              type: "in-person",
              status: "scheduled",
            },
            {
              id: "int-3",
              candidateName: "Taylor Swift",
              position: "UI/UX Designer",
              date: "2025-05-07T15:00:00Z",
              type: "video",
              status: "scheduled",
            },
            {
              id: "int-4",
              candidateName: "Jordan Lee",
              position: "Marketing Specialist",
              date: "2025-05-08T11:30:00Z",
              type: "phone",
              status: "scheduled",
            },
            {
              id: "int-5",
              candidateName: "Casey Kim",
              position: "Frontend Developer",
              date: "2025-05-09T13:00:00Z",
              type: "video",
              status: "scheduled",
            },
          ],
          weeklyTrends: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
            values: [4, 7, 3, 9, 5],
          },
          monthlyTrends: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            values: [12, 19, 15, 27, 18, 24],
          },
        };

        setData(mockData);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { loading, error, data };
};
