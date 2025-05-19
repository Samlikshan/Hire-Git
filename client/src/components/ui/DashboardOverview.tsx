// DashboardOverview.tsx
import React, { useEffect, useRef, useState } from "react";
import StatisticsCards from "./StatisticsChart";
import RecentJobPosts from "./RecentJobs";
import DashboardGraph from "./DashboardGraph";
import { DashboardData } from "@/hooks/useDashboard";
import { getDashboardService } from "@/services/company";

const DashboardOverview: React.FC = () => {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("monthly");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | "active">("all");
  const [searchQuery, setSearchQuery] = useState(""); // Add this state
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "postedDate", direction: "desc" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchData = async () => {
      const startTime = Date.now();
      try {
        setLoading(true);
        const response = await getDashboardService({
          timeframe,
          page: currentPage,
          status: statusFilter,
          search: searchQuery,
          sortBy: sortConfig.key,
          sortOrder: sortConfig.direction,
        });

        if (response.data?.data) {
          setData(response.data.data);
          setError(null);
        }
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        // Calculate remaining time to meet minimum delay
        const elapsed = Date.now() - startTime;
        const minimumDelay = 500; // 0.5 seconds
        const remainingDelay = Math.max(minimumDelay - elapsed, 0);

        // Clear previous timeout if exists
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // Set timeout to ensure minimum loading time
        timeoutRef.current = setTimeout(() => {
          setLoading(false);
        }, remainingDelay);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [timeframe, currentPage, statusFilter, searchQuery, sortConfig]);

  return (
    <div className="space-y-6 p-6">
      {/* ... existing header code ... */}

      {data && (
        <StatisticsCards data={data.stats} loading={loading} error={error} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentJobPosts
            jobs={data?.recentJobs?.jobs || []}
            pagination={data?.recentJobs?.pagination}
            loading={loading}
            error={error}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onStatusChange={setStatusFilter}
            onSearch={setSearchQuery} // Now properly defined
            onSortChange={(key, direction) => setSortConfig({ key, direction })}
          />

          <DashboardGraph
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            trends={data?.trends || []}
            applicantsData={data?.applicantsPerJob || []}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
