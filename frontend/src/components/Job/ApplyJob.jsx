import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { FaArrowLeft, FaUpload, FaPaperPlane } from "react-icons/fa";
import { Context } from "../../main";
import { Button, Card, PageHeader, Container, Input } from "../UI";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthorized, user } = useContext(Context);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    coverLetter: "",
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload PNG, JPEG, WEBP, or PDF file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setResume(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!resume) {
      toast.error("Please upload your resume");
      return;
    }
    
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.coverLetter) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    
    try {
      const submitData = new FormData();
      submitData.append("resume", resume);
      submitData.append("jobId", id);
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("address", formData.address);
      submitData.append("coverLetter", formData.coverLetter);

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/application/post`,
        submitData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      toast.success("Application submitted successfully!");
      navigate(`/job/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <PageHeader
        title="Apply for Job"
        subtitle="Submit your application with resume"
      />

      <Container className="py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6 font-medium transition-colors"
        >
          <FaArrowLeft /> Back to Job
        </button>

        <div className="max-w-2xl mx-auto">
          <Card>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Resume / CV <span className="text-red-500">*</span>
                  <span className="text-neutral-500 text-xs ml-2">(PNG, JPEG, WEBP, or PDF)</span>
                </label>
                <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    {resume ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <FaUpload />
                        <span>{resume.name}</span>
                      </div>
                    ) : (
                      <div className="text-neutral-500 dark:text-neutral-400">
                        <FaUpload className="mx-auto text-2xl mb-2" />
                        <p>Click to upload resume</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
                <Input
                  label="Email *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                <Input
                  label="Phone *"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
                <Input
                  label="Address *"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Enter your address"
                  required
                />
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Cover Letter <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.coverLetter}
                  onChange={(e) => handleChange("coverLetter", e.target.value)}
                  placeholder="Tell us why you're a great fit for this position..."
                  rows={5}
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(`/job/${id}`)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    "Submitting..."
                  ) : (
                    <>
                      <FaPaperPlane /> Submit Application
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </Container>
    </main>
  );
};

export default ApplyJob;
