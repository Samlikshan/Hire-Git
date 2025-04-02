import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Filter, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobCard } from "../JobCard";
import { FilterDrawer } from "../FilterDrawer";
import { CreateJobForm } from "../ui/CreateJobDialog";
import { Job, JobFilter } from "@/types/job";
import { listCompanyJobsService } from "@/services/job";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<JobFilter>({});
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
  const [isSearching, setIsSearching] = useState(false);

  const user = useSelector((state: RootState) => state.user.userData);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user || !user._id) return;
      try {
        const response = await listCompanyJobsService(user?._id);
        setJobs(response.data.jobs);
      } catch (error) {
        console.log(error);
      }
    };
    fetchJobs();
  }, [user]);

  // Extract unique values for filter options
  const availableDepartments = Array.from(
    new Set(jobs.map((job) => job.department))
  );
  const availableLocations = Array.from(
    new Set(jobs.map((job) => job.location))
  );
  const availableTypes = Array.from(new Set(jobs.map((job) => job.type)));
  const availableExperience = Array.from(
    new Set(jobs.map((job) => job.experienceLevel))
  );

  // Apply filters and search
  useEffect(() => {
    setIsSearching(true);

    const timer = setTimeout(() => {
      const filtered = jobs.filter((job) => {
        // Filter by search query
        const matchesSearch =
          searchQuery === "" ||
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (job.tags &&
            job.tags.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            ));

        // Filter by tab (status)
        const matchesTab = activeTab === "all" || job.status === activeTab;

        // Filter by department
        const matchesDepartment =
          !filters.department?.length ||
          filters.department.includes(job.department);

        // Filter by location
        const matchesLocation =
          !filters.location?.length || filters.location.includes(job.location);

        // Filter by job type
        const matchesType =
          !filters.type?.length || filters.type.includes(job.type);

        // Filter by experience
        const matchesExperience =
          !filters.experience?.length ||
          filters.experience.includes(job.experienceLevel);

        return (
          matchesSearch &&
          matchesTab &&
          matchesDepartment &&
          matchesLocation &&
          matchesType &&
          matchesExperience
        );
      });

      setFilteredJobs(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [jobs, searchQuery, activeTab, filters]);

  // const handleCreateJob = (newJob: Job) => {
  //   setJobs([newJob, ...jobs]);
  // };

  const resetFilters = () => {
    setFilters({});
  };

  const handleCreateJob = (newJob: Job) => {
    setJobs([newJob, ...jobs]);
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header with Icon */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
            <Briefcase className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recruitment</h1>
            <p className="text-gray-500">Manage recruitment process</p>
          </div>
        </div>

        {/* Search and Actions Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search Keyword..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button
            className="gap-2 bg-blue-500 hover:bg-blue-600"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus size={16} />
            Create New Job
          </Button>
        </div>

        {/* Tabs and Filters */}
        <div className="mb-6">
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All Jobs</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
              </TabsList>

              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setIsFilterDrawerOpen(true)}
              >
                <Filter size={14} />
                <span>Filters</span>
              </Button>
            </div>

            <TabsContent value="all" className="mt-0">
              {renderJobGrid(filteredJobs)}
            </TabsContent>

            <TabsContent value="active" className="mt-0">
              {renderJobGrid(filteredJobs)}
            </TabsContent>

            <TabsContent value="draft" className="mt-0">
              {renderJobGrid(filteredJobs)}
            </TabsContent>

            <TabsContent value="closed" className="mt-0">
              {renderJobGrid(filteredJobs)}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        setFilters={setFilters}
        availableDepartments={availableDepartments}
        availableLocations={availableLocations}
        availableTypes={availableTypes}
        availableExperience={availableExperience}
        onApplyFilters={() => setIsFilterDrawerOpen(false)}
        onResetFilters={resetFilters}
      />

      {/* Create Job Dialog */}
      {isCreateDialogOpen && (
        <CreateJobForm
          onClose={() => setIsCreateDialogOpen(false)}
          onSubmit={handleCreateJob}
        />
      )}
    </div>
  );

  function renderJobGrid(jobs: Job[]) {
    if (isSearching) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 h-64 animate-pulse"
            >
              <div className="p-4 h-full">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (jobs.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg p-8 text-center"
        >
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No jobs found
          </h3>
          <p className="mt-2 text-gray-500">
            {searchQuery ||
            Object.values(filters).some((f) => f && f.length > 0)
              ? "Try adjusting your search or filters"
              : "Create your first job posting to get started"}
          </p>
          {!searchQuery &&
            !Object.values(filters).some((f) => f && f.length > 0) && (
              <Button
                className="mt-4"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus size={16} className="mr-2" />
                Create Job
              </Button>
            )}
        </motion.div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {jobs.map((job, index) => (
            <JobCard key={index} job={job} index={index} />
          ))}
        </AnimatePresence>
      </div>
    );
  }
}
