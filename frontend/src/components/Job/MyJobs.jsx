import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import { Context } from "../../main";
import { useNavigate, Navigate } from "react-router-dom";
import { Button, Card, Badge, PageHeader, Container, SkeletonLoader, Input } from "../UI";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const { isAuthorized, user } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/job/getmyjobs",
          { withCredentials: true }
        );
        setMyJobs(data.myJobs || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch jobs");
        setMyJobs([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized) {
      fetchJobs();
    }
  }, [isAuthorized]);

  if (!isAuthorized || user?.role !== "Employer") {
    return <Navigate to="/login" />;
  }

  const handleEdit = (job) => {
    setEditingJobId(job._id);
    setEditFormData({ ...job });
  };

  const handleCancelEdit = () => {
    setEditingJobId(null);
    setEditFormData({});
  };

  const handleInputChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveJob = async () => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/job/update/${editingJobId}`,
        editFormData,
        { withCredentials: true }
      );
      toast.success(data.message);
      setMyJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === editingJobId ? data.job : job
        )
      );
      setEditingJobId(null);
      setEditFormData({});
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update job");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const { data } = await axios.delete(
        `http://localhost:4000/api/v1/job/delete/${jobId}`,
        { withCredentials: true }
      );
      toast.success(data.message);
      setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete job");
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <PageHeader
        title="My Job Postings"
        subtitle="Manage all your job listings and view applications"
      />

      <Container className="py-8">
        {/* Header with New Job Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Your Jobs ({myJobs.length})
          </h2>
          <Button variant="primary" onClick={() => navigate("/post/job")}>
            <FaPlus /> Post New Job
          </Button>
        </div>

        {/* Loading State */}
        {loading ? (
          <SkeletonLoader count={4} />
        ) : myJobs.length === 0 ? (
          /* Empty State */
          <Card className="text-center py-12">
            <div className="text-5xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              No jobs posted yet
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Start hiring by posting your first job
            </p>
            <Button variant="primary" onClick={() => navigate("/post/job")}>
              Post Your First Job
            </Button>
          </Card>
        ) : (
          /* Jobs Grid */
          <div className="space-y-4">
            {myJobs.map((job) =>
              editingJobId === job._id ? (
                <JobEditCard
                  key={job._id}
                  formData={editFormData}
                  onChange={handleInputChange}
                  onSave={handleSaveJob}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <JobCard
                  key={job._id}
                  job={job}
                  onEdit={() => handleEdit(job)}
                  onDelete={() => handleDeleteJob(job._id)}
                  onViewApplications={() =>
                    navigate(`/job/${job._id}/applications`)
                  }
                />
              )
            )}
          </div>
        )}
      </Container>
    </main>
  );
};

export default MyJobs;

const JobCard = ({ job, onEdit, onDelete, onViewApplications }) => {
  const getJobTypeColor = (type) => {
    if (type === "Permanent") return "success";
    if (type === "Temporary") return "warning";
    return "info";
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {job.title}
              </h3>
              <Badge variant={getJobTypeColor(job.jobType)}>
                {job.jobType}
              </Badge>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              {job.city}, {job.country} • {job.category}
            </p>
          </div>

          {/* Salary */}
          <div className="text-right">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Salary</p>
            <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {job.fixedSalary
                ? `$${job.fixedSalary?.toLocaleString()}`
                : `$${job.salaryFrom?.toLocaleString()} - $${job.salaryTo?.toLocaleString()}`}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4 line-clamp-2">
          {job.description}
        </p>

        {/* Meta Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-t border-neutral-200 dark:border-neutral-700">
          <div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Posted</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Experience</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {job.experienceRequired || "Any"}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Positions</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {job.positionsOpen || 1}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Status</p>
            <Badge variant="success" size="sm">
              Active
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <Button
            variant="primary"
            size="sm"
            onClick={onViewApplications}
            className="flex-1"
          >
            <FaEye /> View Applications
          </Button>
          <Button variant="secondary" size="sm" onClick={onEdit}>
            <FaEdit /> Edit
          </Button>
          <Button variant="danger" size="sm" onClick={onDelete}>
            <FaTrash /> Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

const JobEditCard = ({ formData, onChange, onSave, onCancel }) => {
  const categories = [
    "Graphics & Design",
    "Mobile App Development",
    "Frontend Web Development",
    "MERN Stack Development",
    "Account & Finance",
    "Artificial Intelligence",
    "Video Animation",
    "MEAN Stack Development",
    "MEVN Stack Development",
    "Data Entry Operator",
  ];

  return (
    <Card>
      <Card.Header>Edit Job</Card.Header>
      <Card.Body>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Job Title"
            value={formData.title || ""}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Enter job title"
          />
          <Input
            label="Category"
            type="select"
            options={categories}
            value={formData.category || ""}
            onChange={(e) => onChange("category", e.target.value)}
          />
          <Input
            label="Country"
            value={formData.country || ""}
            onChange={(e) => onChange("country", e.target.value)}
            placeholder="Country"
          />
          <Input
            label="City"
            value={formData.city || ""}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="City"
          />
          <Input
            label="Job Type"
            type="select"
            options={["Permanent", "Temporary"]}
            value={formData.jobType || ""}
            onChange={(e) => onChange("jobType", e.target.value)}
          />
          <Input
            label="Experience Required"
            value={formData.experienceRequired || ""}
            onChange={(e) => onChange("experienceRequired", e.target.value)}
            placeholder="e.g., 2-3 years"
          />
        </div>
        <Input
          label="Description"
          type="textarea"
          value={formData.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Job description"
          className="mt-4"
        />

        <div className="flex gap-3 mt-6">
          <Button variant="primary" onClick={onSave} className="flex-1">
            Save Changes
          </Button>
          <Button variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
