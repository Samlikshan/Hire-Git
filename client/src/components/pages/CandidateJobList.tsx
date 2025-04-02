import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { JobCard } from "../ui/JobCard";
import { CandidateJob } from "@/types/job";
import { listCandidateJobsService } from "@/services/job";
import Navbar from "../ui/navbar";
import { useDebounce } from "@/hooks/useDebouce";

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [jobsData, setJobsData] = useState<CandidateJob[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(6);
  const [totalJobs, setTotalJobs] = useState(0);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const fetchJobs = useCallback(async () => {
    try {
      const response = await listCandidateJobsService({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
        types: selectedTypes,
        departments: selectedDepartments,
        locations: selectedLocations,
        experience: selectedExperience,
        tags: selectedTags,
      });

      if (response.data.jobs) {
        setJobsData(response.data.jobs);
        setTotalPages(response.data.pages);
        setTotalJobs(response.data.total);
      }
    } catch (error) {
      console.log("Error fetching jobs", error);
    }
  }, [
    currentPage,
    itemsPerPage,
    debouncedSearch,
    selectedTypes,
    selectedDepartments,
    selectedLocations,
    selectedExperience,
    selectedTags,
  ]);
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);
  // Get unique values for filters
  const types = [...new Set(jobsData.map((job) => job.type))];
  const departments = [...new Set(jobsData.map((job) => job.department))];
  const locations = [...new Set(jobsData.map((job) => job.location))];
  const experiences = [...new Set(jobsData.map((job) => job.experienceLevel))];
  const allTags = [...new Set(jobsData.flatMap((job) => job.tags || []))];

  // const filteredJobs = useMemo(() => {
  //   return jobsData.filter((job) => {
  //     const matchesSearch =
  //       job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       (job.tags &&
  //         job.tags.some((tag) =>
  //           tag.toLowerCase().includes(searchQuery.toLowerCase())
  //         ));

  //     const matchesType =
  //       selectedTypes.length === 0 || selectedTypes.includes(job.type);
  //     const matchesDepartment =
  //       selectedDepartments.length === 0 ||
  //       selectedDepartments.includes(job.department);
  //     const matchesLocation =
  //       selectedLocations.length === 0 ||
  //       selectedLocations.includes(job.location);
  //     const matchesExperience =
  //       selectedExperience.length === 0 ||
  //       selectedExperience.includes(job.experienceLevel);
  //     const matchesTags =
  //       selectedTags.length === 0 ||
  //       (job.tags && selectedTags.every((tag) => job?.tags.includes(tag)));

  //     return (
  //       matchesSearch &&
  //       matchesType &&
  //       matchesDepartment &&
  //       matchesLocation &&
  //       matchesExperience &&
  //       matchesTags
  //     );
  //   });
  // }, [
  //   searchQuery,
  //   selectedTypes,
  //   selectedDepartments,
  //   selectedLocations,
  //   selectedExperience,
  //   selectedTags,
  //   jobsData,
  // ]);

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedDepartments([]);
    setSelectedLocations([]);
    setSelectedExperience([]);
    setSelectedTags([]);
  };

  // useEffect(() => {
  //   const fetchJobs = async () => {
  //     try {
  //       const response = await listCandidateJobsService();
  //       if (response.data.jobs) {
  //         setJobsData(response.data.jobs);
  //       }
  //     } catch (error) {
  //       console.log("Error fetching jobs", error);
  //     }
  //   };
  //   fetchJobs();
  // }, []);

  const FilterSection = ({
    title,
    items,
    selected,
    setSelected,
  }: {
    title: string;
    items: string[];
    selected: string[];
    setSelected: (items: string[]) => void;
  }) => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <label key={item} className="flex items-center">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => {
                if (selected.includes(item)) {
                  setSelected(selected.filter((i) => i !== item));
                } else {
                  setSelected([...selected, item]);
                }
              }}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchJobs();
  }, [
    debouncedSearch,
    selectedTypes,
    selectedDepartments,
    selectedLocations,
    selectedExperience,
    selectedTags,
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Next Opportunity
          </h1>
          <p className="text-gray-600">
            Discover and apply to jobs that match your skills and interests
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search jobs by title, description, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {(selectedTypes.length > 0 ||
                selectedDepartments.length > 0 ||
                selectedLocations.length > 0 ||
                selectedExperience.length > 0 ||
                selectedTags.length > 0) && (
                <Badge className="ml-2 bg-blue-100 text-blue-800">
                  {selectedTypes.length +
                    selectedDepartments.length +
                    selectedLocations.length +
                    selectedExperience.length +
                    selectedTags.length}
                </Badge>
              )}
            </Button>
          </div>

          {/* Active Filters */}
          {(selectedTypes.length > 0 ||
            selectedDepartments.length > 0 ||
            selectedLocations.length > 0 ||
            selectedExperience.length > 0 ||
            selectedTags.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                ...selectedTypes,
                ...selectedDepartments,
                ...selectedLocations,
                ...selectedExperience,
                ...selectedTags,
              ].map((filter) => (
                <Badge
                  key={filter}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {filter}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setSelectedTypes(
                        selectedTypes.filter((t) => t !== filter)
                      );
                      setSelectedDepartments(
                        selectedDepartments.filter((d) => d !== filter)
                      );
                      setSelectedLocations(
                        selectedLocations.filter((l) => l !== filter)
                      );
                      setSelectedExperience(
                        selectedExperience.filter((e) => e !== filter)
                      );
                      setSelectedTags(selectedTags.filter((t) => t !== filter));
                    }}
                  />
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-sm text-gray-500"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-64 bg-white rounded-lg shadow-sm p-4 h-fit sticky top-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-sm text-gray-500"
                  >
                    Clear all
                  </Button>
                </div>

                <FilterSection
                  title="Job Type"
                  items={types}
                  selected={selectedTypes}
                  setSelected={setSelectedTypes}
                />

                <FilterSection
                  title="Department"
                  items={departments}
                  selected={selectedDepartments}
                  setSelected={setSelectedDepartments}
                />

                <FilterSection
                  title="Location"
                  items={locations}
                  selected={selectedLocations}
                  setSelected={setSelectedLocations}
                />

                <FilterSection
                  title="Experience"
                  items={experiences}
                  selected={selectedExperience}
                  setSelected={setSelectedExperience}
                />

                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={
                          selectedTags.includes(tag) ? "default" : "secondary"
                        }
                        className="cursor-pointer"
                        onClick={() => {
                          if (selectedTags.includes(tag)) {
                            setSelectedTags(
                              selectedTags.filter((t) => t !== tag)
                            );
                          } else {
                            setSelectedTags([...selectedTags, tag]);
                          }
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Jobs Grid */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {jobsData.length}{" "}
                {jobsData.length === 1 ? "job" : "jobs"}
              </p>
              {/* <select className="border rounded-md px-2 py-1 text-sm">
                <option>Most Recent</option>
                <option>Most Relevant</option>
                <option>Salary: High to Low</option>
                <option>Salary: Low to High</option>
              </select> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobsData.map((job, index) => (
                <JobCard key={job._id} job={job} index={index} />
              ))}
              {jobsData.length === 0 && (
                <div className="text-center py-12 col-span-3">
                  <p className="text-gray-500">
                    No jobs found matching your criteria
                  </p>
                </div>
              )}
            </div>
            <div className="mt-8 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalJobs)} of {totalJobs}{" "}
                results
              </div>
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
