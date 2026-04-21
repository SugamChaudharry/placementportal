import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { FaDownload, FaTrash, FaListAlt, FaClock } from "react-icons/fa";
import { Button, Card, Badge, PageHeader, Container, Timeline } from "../UI";
import ResumeModal from "./ResumeModal";

const MyApplications = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "list" or "timeline"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        if (user && user.role === "Employer") {
          const { data } = await axios.get(
            "http://localhost:4000/api/v1/application/employer/getall",
            { withCredentials: true }
          );
          setApplications(data.applications || []);
        } else {
          const { data } = await axios.get(
            "http://localhost:4000/api/v1/application/jobseeker/getall",
            { withCredentials: true }
          );
          setApplications(data.applications || []);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized) {
      fetchApplications();
    }
  }, [isAuthorized, user]);

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  const deleteApplication = (id) => {
    try {
      axios
        .delete(`http://localhost:4000/api/v1/application/delete/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          setApplications((prevApplications) =>
            prevApplications.filter((app) => app._id !== id)
          );
        });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete application");
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const title = user?.role === "Job Seeker" ? "My Applications" : "Applications Received";
  const subtitle = user?.role === "Job Seeker" 
    ? "Track your job applications and their status"
    : "View and manage applications from job seekers";

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <PageHeader title={title} subtitle={subtitle} />

      <Container className="py-8">
        {/* View Toggle */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === "list"
                  ? "bg-primary-500 text-white shadow-md"
                  : "bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-600"
              }`}
            >
              <FaListAlt /> List View
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === "timeline"
                  ? "bg-primary-500 text-white shadow-md"
                  : "bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-600"
              }`}
            >
              <FaClock /> Timeline View
            </button>
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            {applications.length} application{applications.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Empty State */}
        {applications.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              No applications found
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              {user?.role === "Job Seeker" 
                ? "Start applying to jobs to see them here"
                : "Applications will appear here when job seekers apply"}
            </p>
          </Card>
        ) : viewMode === "list" ? (
          /* List View */
          <div className="space-y-4">
            {applications.map((application) =>
              user?.role === "Job Seeker" ? (
                <ApplicationCard
                  key={application._id}
                  application={application}
                  onDelete={deleteApplication}
                  onViewResume={openModal}
                />
              ) : (
                <ApplicantCard
                  key={application._id}
                  application={application}
                  onViewResume={openModal}
                />
              )
            )}
          </div>
        ) : (
          /* Timeline View */
          <div className="space-y-6">
            {applications.map((application) => (
              <div key={application._id} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      {application.jobId?.title || "Job Application"}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Applied on {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {user?.role === "Job Seeker" && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteApplication(application._id)}
                    >
                      <FaTrash /> Delete
                    </Button>
                  )}
                </div>
                {/* Timeline component here */}
                <Timeline application={application} />
              </div>
            ))}
          </div>
        )}
      </Container>

      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
      )}
    </main>
  );
};

export default MyApplications;

const ApplicationCard = ({ application, onDelete, onViewResume }) => {
  const statusColors = {
    pending: "warning",
    accepted: "success",
    rejected: "danger",
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {application.jobId?.title || "Job Application"}
              </h3>
              <Badge variant={statusColors[application.status?.toLowerCase()] || "info"}>
                {application.status || "Pending"}
              </Badge>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              {application.employerID?.user?.companyName || application.employerID?.user?.name || "Company"}
            </p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2">
              <span className="font-medium">Cover Letter:</span> {application.coverLetter}
            </p>
          </div>

          <div className="flex flex-col gap-2 md:flex-row">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onViewResume(application.resume?.url)}
            >
              <FaDownload /> Resume
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(application._id)}
            >
              <FaTrash /> Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Email</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {application.email}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Phone</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {application.phone}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Applied</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {new Date(application.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

const ApplicantCard = ({ application, onViewResume }) => {
  const statusColors = {
    pending: "warning",
    accepted: "success",
    rejected: "danger",
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {application.name}
              </h3>
              <Badge variant={statusColors[application.status?.toLowerCase()] || "info"}>
                {application.status || "Pending"}
              </Badge>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              Applied for: {application.jobId?.title || "Position"}
            </p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2">
              <span className="font-medium">Cover Letter:</span> {application.coverLetter}
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewResume(application.resume?.url)}
          >
            <FaDownload /> Resume
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Email</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {application.email}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Phone</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {application.phone}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Address</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {application.address || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Applied</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {new Date(application.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
