import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { JobFilter } from "../types/job";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: JobFilter;
  setFilters: React.Dispatch<React.SetStateAction<JobFilter>>;
  availableDepartments: string[];
  availableLocations: string[];
  availableTypes: string[];
  availableExperience: string[];
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export function FilterDrawer({
  isOpen,
  onClose,
  filters,
  setFilters,
  availableDepartments,
  availableLocations,
  availableTypes,
  availableExperience,
  onApplyFilters,
  onResetFilters,
}: FilterDrawerProps) {
  const toggleDepartment = (department: string) => {
    setFilters((prev) => {
      const currentDepartments = prev.department || [];
      if (currentDepartments.includes(department)) {
        return {
          ...prev,
          department: currentDepartments.filter((d) => d !== department),
        };
      } else {
        return {
          ...prev,
          department: [...currentDepartments, department],
        };
      }
    });
  };

  const toggleLocation = (location: string) => {
    setFilters((prev) => {
      const currentLocations = prev.location || [];
      if (currentLocations.includes(location)) {
        return {
          ...prev,
          location: currentLocations.filter((l) => l !== location),
        };
      } else {
        return {
          ...prev,
          location: [...currentLocations, location],
        };
      }
    });
  };

  const toggleType = (type: string) => {
    setFilters((prev) => {
      const currentTypes = prev.type || [];
      if (currentTypes.includes(type)) {
        return {
          ...prev,
          type: currentTypes.filter((t) => t !== type),
        };
      } else {
        return {
          ...prev,
          type: [...currentTypes, type],
        };
      }
    });
  };

  const toggleExperience = (experience: string) => {
    setFilters((prev) => {
      const currentExperience = prev.experience || [];
      if (currentExperience.includes(experience)) {
        return {
          ...prev,
          experience: currentExperience.filter((e) => e !== experience),
        };
      } else {
        return {
          ...prev,
          experience: [...currentExperience, experience],
        };
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50 overflow-y-auto"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-4 space-y-6">
              {/* Department Filter */}
              <div>
                <h3 className="font-medium mb-2">Department</h3>
                <div className="space-y-2">
                  {availableDepartments.map((department) => (
                    <label
                      key={department}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={(filters.department || []).includes(
                          department
                        )}
                        onChange={() => toggleDepartment(department)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{department}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <h3 className="font-medium mb-2">Location</h3>
                <div className="space-y-2">
                  {availableLocations.map((location) => (
                    <label
                      key={location}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={(filters.location || []).includes(location)}
                        onChange={() => toggleLocation(location)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Job Type Filter */}
              <div>
                <h3 className="font-medium mb-2">Job Type</h3>
                <div className="space-y-2">
                  {availableTypes.map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={(filters.type || []).includes(type)}
                        onChange={() => toggleType(type)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Filter */}
              <div>
                <h3 className="font-medium mb-2">Experience</h3>
                <div className="space-y-2">
                  {availableExperience.map((exp) => (
                    <label key={exp} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={(filters.experience || []).includes(exp)}
                        onChange={() => toggleExperience(exp)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{exp}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex space-x-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onResetFilters}
              >
                Reset
              </Button>
              <Button className="flex-1" onClick={onApplyFilters}>
                Apply Filters
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
