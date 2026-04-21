import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Navigate } from "react-router-dom";
import { Context } from "../../main";
import { Button, Card, Input, FormGroup, PageHeader, Container } from "../UI";
import { FaCheck } from "react-icons/fa";

const PostJob = () => {
  const { isAuthorized, user } = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [salaryType, setSalaryType] = useState("fixed");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    country: "",
    city: "",
    location: "",
    jobType: "Permanent",
    experienceRequired: "",
    fixedSalary: "",
    salaryFrom: "",
    salaryTo: "",
  });

  if (!isAuthorized || user?.role !== "Employer") {
    return <Navigate to="/login" />;
  }

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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      country: formData.country,
      city: formData.city,
      location: formData.location,
      jobType: formData.jobType,
      experienceRequired: formData.experienceRequired,
    };

    if (salaryType === "fixed") {
      postData.fixedSalary = formData.fixedSalary;
    } else {
      postData.salaryFrom = formData.salaryFrom;
      postData.salaryTo = formData.salaryTo;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/job/post",
        postData,
        { withCredentials: true }
      );
      toast.success(data.message);
      navigate("/jobs/myjobs");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <PageHeader
        title="Post a New Job"
        subtitle="Find the right talent for your organization"
      />

      <Container className="py-8 max-w-2xl">
        <Card>
          <Card.Header>Job Details</Card.Header>
          <Card.Body>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <FormGroup label="Job Title" required>
                    <Input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Enter job title"
                      required
                    />
                  </FormGroup>

                  <FormGroup label="Description" required>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Describe the job role, responsibilities, and requirements"
                      rows={5}
                      required
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </FormGroup>

                  <FormGroup label="Category" required>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </FormGroup>
                </div>
              </div>

              {/* Location */}
              <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormGroup label="Country" required>
                    <Input
                      type="text"
                      value={formData.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      placeholder="Country"
                      required
                    />
                  </FormGroup>
                  <FormGroup label="City" required>
                    <Input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="City"
                      required
                    />
                  </FormGroup>
                  <FormGroup label="Detailed Location" required className="md:col-span-2">
                    <textarea
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="Detailed location or office address"
                      rows={2}
                      required
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </FormGroup>
                </div>
              </div>

              {/* Job Details */}
              <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Job Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormGroup label="Job Type" required>
                    <select
                      value={formData.jobType}
                      onChange={(e) =>
                        handleInputChange("jobType", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Permanent">Permanent</option>
                      <option value="Temporary">Temporary</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </FormGroup>
                  <FormGroup label="Experience Required">
                    <Input
                      type="text"
                      value={formData.experienceRequired}
                      onChange={(e) =>
                        handleInputChange("experienceRequired", e.target.value)
                      }
                      placeholder="e.g., 2-3 years, Entry Level"
                    />
                  </FormGroup>
                </div>
              </div>

              {/* Salary */}
              <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Salary Information
                </h3>

                <div className="mb-4 flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="fixed"
                      checked={salaryType === "fixed"}
                      onChange={(e) => setSalaryType(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-neutral-900 dark:text-neutral-100">
                      Fixed Salary
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="range"
                      checked={salaryType === "range"}
                      onChange={(e) => setSalaryType(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-neutral-900 dark:text-neutral-100">
                      Salary Range
                    </span>
                  </label>
                </div>

                {salaryType === "fixed" ? (
                  <FormGroup label="Fixed Salary" required>
                    <Input
                      type="number"
                      value={formData.fixedSalary}
                      onChange={(e) =>
                        handleInputChange("fixedSalary", e.target.value)
                      }
                      placeholder="Enter salary amount"
                      required
                    />
                  </FormGroup>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormGroup label="Salary From" required>
                      <Input
                        type="number"
                        value={formData.salaryFrom}
                        onChange={(e) =>
                          handleInputChange("salaryFrom", e.target.value)
                        }
                        placeholder="Minimum salary"
                        required
                      />
                    </FormGroup>
                    <FormGroup label="Salary To" required>
                      <Input
                        type="number"
                        value={formData.salaryTo}
                        onChange={(e) =>
                          handleInputChange("salaryTo", e.target.value)
                        }
                        placeholder="Maximum salary"
                        required
                      />
                    </FormGroup>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <Button
                  variant="secondary"
                  onClick={() => navigate("/jobs/myjobs")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Posting..." : <><FaCheck /> Post Job</>}
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
};

export default PostJob;
