import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Context } from "../../main";
import { Button, Card, Badge, Input } from "../UI";
import { PageHeader, Container } from "../UI/Layout";
import { SkeletonLoader } from "../UI/Loading";
import { FaMapMarkerAlt, FaDollarSign, FaBriefcase, FaSearch, FaTimes, FaBookmark, FaRegBookmark } from "react-icons/fa";
import toast from "react-hot-toast";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthorized, user } = useContext(Context);

  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "");
  const [salaryRange, setSalaryRange] = useState(searchParams.get("salary") || "");
  const [jobType, setJobType] = useState(searchParams.get("type") || "");

  // Fetch jobs and bookmarks
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsRes, bookmarksRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/job/getall`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_API_URL}/user/bookmarks`, { withCredentials: true }).catch(() => ({ data: { bookmarkedJobs: [] } }))
        ]);
        setJobs(jobsRes.data.jobs || []);
        const bookmarkIds = (bookmarksRes.data.bookmarkedJobs || []).map(job => job._id.toString());
        setBookmarkedJobs(new Set(bookmarkIds));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter jobs based on criteria
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || job.category === selectedCategory;
    const matchesLocation = !selectedLocation || job.country === selectedLocation;
    const matchesJobType = !jobType || job.jobType === jobType;
    
    return matchesSearch && matchesCategory && matchesLocation && matchesJobType;
  });

  // Update URL when filters change
  const updateFilters = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.location) params.set("location", newFilters.location);
    if (newFilters.salary) params.set("salary", newFilters.salary);
    if (newFilters.type) params.set("type", newFilters.type);
    setSearchParams(params);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    updateFilters({ search: value, category: selectedCategory, location: selectedLocation, salary: salaryRange, type: jobType });
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    updateFilters({ search: searchTerm, category: value, location: selectedLocation, salary: salaryRange, type: jobType });
  };

  const handleLocationChange = (value) => {
    setSelectedLocation(value);
    updateFilters({ search: searchTerm, category: selectedCategory, location: value, salary: salaryRange, type: jobType });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedLocation("");
    setSalaryRange("");
    setJobType("");
    setSearchParams({});
  };

  // Get unique categories and locations
  const categories = [...new Set(jobs.map((job) => job.category))];
  const locations = [...new Set(jobs.map((job) => job.country))];

  const hasActiveFilters = searchTerm || selectedCategory || selectedLocation || salaryRange || jobType;

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  return (
    <main className="bg-white dark:bg-neutral-900 min-h-screen">
      <PageHeader 
        title="Find Your Dream Job"
        subtitle="Browse thousands of opportunities and apply with confidence"
      />

      <Container className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6 flex items-center">
                <FaSearch className="mr-2 text-primary-600" /> Filters
              </h3>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Search Jobs
                  </label>
                  <Input
                    type="text"
                    placeholder="Job title or keyword"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm"
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full"
                    onClick={handleClearFilters}
                  >
                    <FaTimes className="mr-2" /> Clear All
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Jobs Grid */}
          <div className="lg:col-span-3">
            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge variant="primary">
                    Search: {searchTerm}
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge variant="primary">
                    {selectedCategory}
                  </Badge>
                )}
                {selectedLocation && (
                  <Badge variant="primary">
                    {selectedLocation}
                  </Badge>
                )}
              </div>
            )}

            {/* Jobs Count */}
            <div className="mb-6">
              <p className="text-neutral-600 dark:text-neutral-400">
                {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} found
              </p>
            </div>

            {/* Loading State */}
            {loading ? (
              <SkeletonLoader count={6} />
            ) : filteredJobs.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  No jobs found matching your criteria
                </p>
                <Button variant="ghost" onClick={handleClearFilters}>
                  Clear filters and try again
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <Card
                    key={job._id}
                    className="hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    <div className="p-6 flex flex-col h-full">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                            {job.title}
                          </h4>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {job.companyName || "Company Name"}
                          </p>
                        </div>
                        {/* Bookmark Button */}
                        <BookmarkButton 
                          jobId={job._id} 
                          isBookmarked={bookmarkedJobs.has(job._id)}
                          onToggle={(bookmarked) => {
                            const newBookmarks = new Set(bookmarkedJobs);
                            if (bookmarked) {
                              newBookmarks.add(job._id);
                            } else {
                              newBookmarks.delete(job._id);
                            }
                            setBookmarkedJobs(newBookmarks);
                          }}
                        />
                      </div>

                      {/* Category Badge */}
                      <Badge variant="secondary" size="sm" className="mb-4 w-fit">
                        {job.category}
                      </Badge>

                      {/* Job Details */}
                      <div className="space-y-2 mb-4 text-sm flex-1">
                        <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                          <FaMapMarkerAlt className="mr-2 text-primary-600" />
                          {job.country || "Location not specified"}
                        </div>
                        <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                          <FaBriefcase className="mr-2 text-primary-600" />
                          {job.jobType || "Full Time"}
                        </div>
                        {job.fixedSalary && (
                          <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                            <FaDollarSign className="mr-2 text-primary-600" />
                            ${job.fixedSalary}
                          </div>
                        )}
                      </div>

                      {/* Description Preview */}
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      {/* CTA */}
                      <Link to={`/job/${job._id}`} className="block">
                        <Button variant="primary" size="md" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
};

// Bookmark Button Component
const BookmarkButton = ({ jobId, isBookmarked, onToggle }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      if (isBookmarked) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/user/bookmarks/${jobId}`, {
          withCredentials: true
        });
        toast.success("Removed from bookmarks");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/user/bookmarks/${jobId}`, {}, {
          withCredentials: true
        });
        toast.success("Added to bookmarks");
      }
      onToggle(!isBookmarked);
    } catch (error) {
      toast.error("Failed to update bookmark");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`p-2 rounded-lg transition-all ${
        isBookmarked
          ? "bg-accent-100 dark:bg-accent-900 text-accent-600 dark:text-accent-400"
          : "text-neutral-400 hover:text-accent-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
      } ${loading ? "opacity-50" : ""}`}
    >
      {isBookmarked ? <FaBookmark className="w-5 h-5" /> : <FaRegBookmark className="w-5 h-5" />}
    </button>
  );
};

export default Jobs;
