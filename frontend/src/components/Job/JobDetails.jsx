import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt, FaDollarSign, FaBriefcase, FaBookmark, FaRegBookmark, FaPaperPlane } from "react-icons/fa";
import { Context } from "../../main";
import { Button, Card, Badge, PageHeader, Container, SkeletonLoader } from "../UI";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthorized, user } = useContext(Context);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const [{ data: jobData }, { data: bookmarkData }] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/job/${id}`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_API_URL}/user/bookmarks`, { withCredentials: true }).catch(() => ({ data: { bookmarkedJobs: [] } }))
        ]);
        setJob(jobData.job);
        const isBookmarked = (bookmarkData.bookmarkedJobs || []).some(job => job._id === id);
        setBookmarked(isBookmarked);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized && id) {
      fetchJobDetails();
    } else {
      setLoading(false);
    }
  }, [isAuthorized, id, navigate]);

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <Container className="py-8">
          <SkeletonLoader count={3} />
        </Container>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <PageHeader title="Job Not Found" subtitle="The job you're looking for doesn't exist" />
        <Container className="py-8">
          <Card className="text-center py-12">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Job Not Found
            </h2>
            <Button variant="primary" onClick={() => navigate("/job/getall")}>
              <FaArrowLeft /> Back to Jobs
            </Button>
          </Card>
        </Container>
      </main>
    );
  }

  const isOwner = user?._id === job.postedBy;
  const isEmployer = user?.role === "Employer";

  const handleApply = () => {
    navigate(`/job/${id}/apply`);
  };

  const handleBookmark = async () => {
    try {
      if (bookmarked) {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/user/bookmarks/${id}`,
          { withCredentials: true }
        );
        setBookmarked(false);
        toast.success("Removed from bookmarks");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/user/bookmarks/${id}`,
          {},
          { withCredentials: true }
        );
        setBookmarked(true);
        toast.success("Added to bookmarks");
      }
    } catch (error) {
      toast.error("Failed to update bookmark");
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Container className="py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6 font-medium transition-colors"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              {/* Header */}
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                      {job.title}
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                      {job.companyName || "Company"}
                    </p>
                  </div>
                  {!isOwner && (
                    <button
                      onClick={handleBookmark}
                      className={`p-3 rounded-lg transition-all ${
                        bookmarked
                          ? "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      }`}
                    >
                      {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
                    </button>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="info">{job.jobType}</Badge>
                  <Badge variant="success">{job.category}</Badge>
                </div>
              </div>

              {/* Key Info */}
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">Location</p>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {job.city}, {job.country}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400">
                      <FaDollarSign />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">Salary</p>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {job.fixedSalary
                          ? `$${job.fixedSalary.toLocaleString()}`
                          : `$${job.salaryFrom?.toLocaleString()} - $${job.salaryTo?.toLocaleString()}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400">
                      <FaBriefcase />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">Experience</p>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {job.experienceRequired || "Any"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  About the Job
                </h2>
                <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap mb-6">
                  {job.description}
                </p>

                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Location Details
                </h3>
                <p className="text-neutral-700 dark:text-neutral-300">
                  {job.location}
                </p>
              </div>
            </Card>
          </div>

          {/* Sidebar - Action Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <Card.Body>
                {isOwner ? (
                  <div className="text-center py-6">
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                      This is your job posting
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => navigate("/jobs/myjobs")}
                      className="w-full"
                    >
                      Manage Job
                    </Button>
                  </div>
                ) : isEmployer ? (
                  <div className="text-center py-6">
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                      Employers cannot apply to jobs
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => navigate("/job/getall")}
                      className="w-full"
                    >
                      Browse More Jobs
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      onClick={handleApply}
                      className="w-full mb-3"
                    >
                      Apply Now
                    </Button>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 text-center">
                      Submit your resume and qualifications
                    </p>
                  </>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default JobDetails;
