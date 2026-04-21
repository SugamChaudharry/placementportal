import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { Context } from "../../main";
import { Button, Card, Badge } from "../UI";
import { PageHeader, Container } from "../UI/Layout";
import { SkeletonLoader } from "../UI/Loading";
import { FaMapMarkerAlt, FaDollarSign, FaBriefcase, FaBookmark, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const SavedJobs = () => {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    const fetchBookmarkedJobs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/bookmarks`,
          { withCredentials: true }
        );
        setBookmarkedJobs(data.bookmarkedJobs || []);
      } catch (error) {
        toast.error("Failed to load saved jobs");
        setBookmarkedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized) {
      fetchBookmarkedJobs();
    }
  }, [isAuthorized]);

  const handleRemoveBookmark = async (jobId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/user/bookmarks/${jobId}`,
        { withCredentials: true }
      );
      setBookmarkedJobs((prev) => prev.filter((job) => job._id !== jobId));
      toast.success("Removed from bookmarks");
    } catch (error) {
      toast.error("Failed to remove bookmark");
    }
  };

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  return (
    <main className="bg-white dark:bg-neutral-900 min-h-screen">
      <PageHeader
        title="Saved Jobs"
        subtitle="Jobs you've bookmarked for later"
      />

      <Container className="py-8">
        {/* Loading State */}
        {loading ? (
          <SkeletonLoader count={4} />
        ) : bookmarkedJobs.length === 0 ? (
          /* Empty State */
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">🔖</div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              No saved jobs yet
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Bookmark jobs you're interested in and find them here
            </p>
            <Link to="/job/getall">
              <Button variant="primary">Browse Jobs</Button>
            </Link>
          </Card>
        ) : (
          /* Bookmarked Jobs Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedJobs.map((job) => (
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
                    <button
                      onClick={() => handleRemoveBookmark(job._id)}
                      className="p-2 rounded-lg bg-accent-100 dark:bg-accent-900 text-accent-600 dark:text-accent-400 hover:bg-accent-200 dark:hover:bg-accent-800 transition-colors"
                    >
                      <FaBookmark className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Category Badge */}
                  <Badge variant="secondary" size="sm" className="mb-4 w-fit">
                    {job.category}
                  </Badge>

                  {/* Job Details */}
                  <div className="space-y-2 mb-4 text-sm flex-1">
                    <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                      <FaMapMarkerAlt className="mr-2 text-primary-600" />
                      {job.city}, {job.country}
                    </div>
                    <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                      <FaBriefcase className="mr-2 text-primary-600" />
                      {job.jobType || "Full Time"}
                    </div>
                    {job.fixedSalary ? (
                      <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                        <FaDollarSign className="mr-2 text-primary-600" />
                        ${job.fixedSalary.toLocaleString()}
                      </div>
                    ) : job.salaryFrom && job.salaryTo ? (
                      <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                        <FaDollarSign className="mr-2 text-primary-600" />
                        ${job.salaryFrom.toLocaleString()} - ${job.salaryTo.toLocaleString()}
                      </div>
                    ) : null}
                  </div>

                  {/* Description Preview */}
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link to={`/job/${job._id}`} className="flex-1">
                      <Button variant="primary" size="md" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={() => handleRemoveBookmark(job._id)}
                      className="text-accent-500 hover:text-accent-600"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
};

export default SavedJobs;
