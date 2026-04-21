import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { FaArrowLeft, FaDownload, FaTimes, FaCheck } from "react-icons/fa";
import { Context } from "../../main";
import { Button, Card, Badge, PageHeader, Container, SkeletonLoader, Timeline } from "../UI";
import ResumeModal from "./ResumeModal";

const Application = () => {
  const { appid } = useParams();
  const navigate = useNavigate();
  const { isAuthorized, user } = useContext(Context);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/application/${appid}`,
          { withCredentials: true }
        );
        setApplication(data.application);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load application");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized && appid) {
      fetchApplication();
    }
  }, [isAuthorized, appid]);

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

  if (!application) {
    return (
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <PageHeader title="Application Not Found" subtitle="The application you're looking for doesn't exist" />
        <Container className="py-8">
          <Card className="text-center py-12">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Application Not Found
            </h2>
            <Button variant="primary" onClick={() => navigate(-1)}>
              <FaArrowLeft /> Go Back
            </Button>
          </Card>
        </Container>
      </main>
    );
  }

  const statusColors = {
    pending: "warning",
    accepted: "success",
    rejected: "danger",
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/application/update/${appid}`,
        { status: newStatus },
        { withCredentials: true }
      );
      setApplication(data.application);
      toast.success(`Application ${newStatus}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update application");
    } finally {
      setUpdating(false);
    }
  };

  const isEmployer = user?.role === "Employer";
  const isApplicant = user?._id === application.applicantId;

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <PageHeader 
        title={`Application - ${application.jobTitle || "Job"}`}
        subtitle={`Status: ${application.status || "Pending"}`}
      />

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
          <div className="lg:col-span-2 space-y-6">
            {/* Applicant Info */}
            <Card>
              <Card.Header>Applicant Information</Card.Header>
              <Card.Body>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Name
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100 mt-1">
                      {application.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Email
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100 mt-1">
                      {application.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Phone
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100 mt-1">
                      {application.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Address
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100 mt-1">
                      {application.address || "N/A"}
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Cover Letter */}
            <Card>
              <Card.Header>Cover Letter</Card.Header>
              <Card.Body>
                <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                  {application.coverLetter || "No cover letter provided"}
                </p>
              </Card.Body>
            </Card>

            {/* Resume */}
            <Card>
              <Card.Header>Resume</Card.Header>
              <Card.Body>
                {application.resume?.url ? (
                  <div className="flex items-center justify-between p-4 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        Resume Document
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        Click to view resume
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowResumeModal(true)}
                        className="p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                        title="View Resume"
                      >
                        <FaEye />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-neutral-600 dark:text-neutral-400">
                    No resume attached
                  </p>
                )}
              </Card.Body>
            </Card>

            {/* Timeline */}
            {application.timeline && (
              <Card>
                <Card.Header>Application Timeline</Card.Header>
                <Card.Body>
                  <Timeline application={application} />
                </Card.Body>
              </Card>
            )}
          </div>

          {/* Sidebar - Actions */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <Card.Header>Application Status</Card.Header>
              <Card.Body>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Current Status
                    </label>
                    <Badge variant={statusColors[application.status?.toLowerCase()] || "info"}>
                      {application.status || "Pending"}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Applied on {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {isEmployer && (
                  <div className="space-y-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleStatusUpdate("accepted")}
                      disabled={updating || application.status === "accepted"}
                      className="w-full"
                    >
                      <FaCheck /> Accept
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleStatusUpdate("rejected")}
                      disabled={updating || application.status === "rejected"}
                      className="w-full"
                    >
                      <FaTimes /> Reject
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>

      {/* Resume Modal */}
      {showResumeModal && application.resume?.url && (
        <ResumeModal
          imageUrl={application.resume.url}
          onClose={() => setShowResumeModal(false)}
        />
      )}
    </main>
  );
};

export default Application;
