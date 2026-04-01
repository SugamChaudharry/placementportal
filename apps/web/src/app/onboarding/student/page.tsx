"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChevronRight, Check, Loader2, AtSign, Upload, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { authService } from "@/lib/services/auth.service";
import { userService } from "@/lib/services/user.service";
import { useAuthStore } from "@/store/auth.store";
import { removeTokenCookie } from "@/lib/cookies";

const P = "#4f46e5";

export default function StudentOnboardingPage() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string>("");

  const labels = ["Personal", "Academic", "Skills", "Resume", "Preferences", "Review"];

  const requiredFields: Record<number, { key: string; label: string }[]> = {
    1: [
      { key: "username", label: "Username" },
      { key: "name", label: "Full Name" },
      { key: "phone", label: "Phone Number" },
    ],
    2: [{ key: "college", label: "College" }],
    3: [],
    4: [{ key: "resume", label: "Resume" }],
    5: [],
    6: [],
  };

  const authUser = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "", phone: "", linkedin: "", bio: "", username: "",
    college: "", degree: "", cgpa: "", gradYear: "",
    branch: "",
    skills: "", preferences: "",
  });

  // Fetch user profile to get auto-generated username
  const { data: userProfile } = useQuery({
    queryKey: ["me", token],
    queryFn: async () => {
      const response = await api.get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!authUser && !!token,
    retry: 3,
    retryDelay: 500,
  });

  // Set initial form data from profile
  useEffect(() => {
    if (userProfile) {
      setFormData((prev) => ({
        ...prev,
        name: userProfile.name || "",
        username: userProfile.username || "",
      }));
    }
  }, [userProfile]);

  // Validate token on mount - redirect to login if invalid
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        router.push("/auth/login");
        return;
      }
      try {
        await authService.getMe();
      } catch {
        localStorage.removeItem("token");
        removeTokenCookie();
        router.push("/auth/login");
      }
    };
    validateToken();
  }, [router]);

  const updateForm = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidationErrors((prev) => ({ ...prev, [key]: "" }));
    if (key === "username") {
      setUsernameError("");
    }
  };

  const validateStep = (stepNum: number): boolean => {
    const errors: Record<string, string> = {};
    const fields = requiredFields[stepNum];

    for (const field of fields) {
      if (field.key === "resume") {
        if (!resumeUrl) {
          errors[field.key] = `${field.label} is required`;
        }
      } else if (!formData[field.key as keyof typeof formData]?.trim()) {
        errors[field.key] = `${field.label} is required`;
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return false;
    }

    setValidationErrors({});
    return true;
  };

  const handleResumeUpload = async (file: File) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      setValidationErrors((prev) => ({
        ...prev,
        resume: "Only PDF and Word documents allowed",
      }));
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setValidationErrors((prev) => ({
        ...prev,
        resume: "File size exceeds 5MB limit",
      }));
      return;
    }

    setResumeFile(file);
    setResumeUploading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("file", file);

      const response = await api.post("/api/resume/upload", formDataObj, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setResumeUrl(response.data.url);
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy.resume;
        return copy;
      });
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to upload resume";
      setValidationErrors((prev) => ({ ...prev, resume: message }));
      setResumeFile(null);
    } finally {
      setResumeUploading(false);
    }
  };

  // Submit onboarding data to backend
  const { mutate: submitOnboarding, isPending } = useMutation({
    mutationFn: async () => {
      const payload = {
        username: formData.username,
        personal: {
          name: formData.name,
          phone: formData.phone,
          linkedinUrl: formData.linkedin || undefined,
          bio: formData.bio || undefined,
        },
        academic: {
          college: formData.college,
          degree: formData.degree,
          cgpa: parseFloat(formData.cgpa) || 0,
          graduationYear: parseInt(formData.gradYear) || new Date().getFullYear(),
          branch: formData.branch || "",
          backlogs: 0,
        },
        skills: {
          technical: formData.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          soft: [],
          languages: [],
        },
        resume: {
          url: resumeUrl,
        },
        preferences: {
          jobTypes: ["FULL_TIME", "INTERNSHIP"],
          preferredLocations: formData.preferences
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
      };
      return await userService.completeOnboarding(payload);
    },
    onSuccess: () => {
      router.push("/");
    },
    onError: (err: any) => {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to save profile. Please try again.";
      if (message.toLowerCase().includes("username")) {
        setUsernameError(message);
        setStep(1);
      } else {
        setError(message);
      }
    },
  });

  const handleNext = () => {
    if (validateStep(step)) {
      setError("");
      setStep((s) => s + 1);
    }
  };

  const handleFinish = () => {
    if (validateStep(6)) {
      setError("");
      submitOnboarding();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(180deg,#eef2ff,#f8fafc)" }}
    >
      {/* ── Step indicator ── */}
      <div className="px-6 py-4 border-b border-indigo-100 bg-white/80 backdrop-blur">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          {labels.map((l, i) => (
            <div key={i} className="flex-1 flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors"
                style={{
                  background: step > i ? P : step === i + 1 ? "#eef2ff" : "#e5e7eb",
                  color: step > i ? "#fff" : step === i + 1 ? P : "#9ca3af",
                  fontWeight: 600,
                }}
              >
                {step > i ? <Check size={14} className="text-white" /> : i + 1}
              </div>
              {i < labels.length - 1 && (
                <div
                  className="flex-1 h-0.5 rounded transition-colors"
                  style={{ background: step > i ? P : "#e5e7eb" }}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">
          Step {step} of {labels.length} — {labels[step - 1]}
        </p>
      </div>

      {/* ── Form card ── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl p-8">
          <h2 className="text-xl text-gray-900 mb-4" style={{ fontWeight: 700 }}>
            Complete your profile
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Fill in your personal details, academics, skills, resume, and preferences.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* ── Step 1 · Personal ── */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500">* Required fields</p>

              {/* Username */}
              <div>
                <label className="text-sm font-medium text-gray-700">Username *</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <AtSign size={16} />
                  </div>
                  <Input
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={(e) =>
                      updateForm(
                        "username",
                        e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "")
                      )
                    }
                    className={`pl-10 ${validationErrors.username ? "border-red-500" : ""}`}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Auto-generated. You can change it to a unique name.
                </p>
                {(usernameError || validationErrors.username) && (
                  <p className="text-xs text-red-500 mt-1">
                    {usernameError || validationErrors.username}
                  </p>
                )}
              </div>

              {/* Full name */}
              <div>
                <label className="text-sm font-medium text-gray-700">Full name *</label>
                <Input
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  className={validationErrors.name ? "border-red-500" : ""}
                />
                {validationErrors.name && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.name}</p>
                )}
              </div>

              {/* Phone — FIX: closed this div before LinkedIn */}
              <div>
                <label className="text-sm font-medium text-gray-700">Phone number *</label>
                <Input
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  className={validationErrors.phone ? "border-red-500" : ""}
                />
                {validationErrors.phone && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.phone}</p>
                )}
              </div>

              {/* LinkedIn */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  LinkedIn Profile URL{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <Input
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.linkedin}
                  onChange={(e) => updateForm("linkedin", e.target.value)}
                />
              </div>

              {/* Bio */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Short bio{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[80px] focus:ring-1 focus:ring-indigo-500 outline-none"
                  placeholder="Tell us about yourself (max 300 chars)"
                  maxLength={300}
                  value={formData.bio}
                  onChange={(e) => updateForm("bio", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ── Step 2 · Academic ── */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500">* Required fields</p>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  University / College name *
                </label>
                <Input
                  placeholder="Enter your college name"
                  value={formData.college}
                  onChange={(e) => updateForm("college", e.target.value)}
                  className={validationErrors.college ? "border-red-500" : ""}
                />
                {validationErrors.college && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.college}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Degree <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <Input
                  placeholder="e.g. B.Tech Computer Science"
                  value={formData.degree}
                  onChange={(e) => updateForm("degree", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Branch <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <Input
                  placeholder="e.g. Computer Science"
                  value={formData.branch}
                  onChange={(e) => updateForm("branch", e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    CGPA <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <Input
                    placeholder="e.g. 8.5"
                    value={formData.cgpa}
                    onChange={(e) => updateForm("cgpa", e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Graduation Year{" "}
                    <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <Input
                    placeholder="e.g. 2025"
                    value={formData.gradYear}
                    onChange={(e) => updateForm("gradYear", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3 · Skills ── */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-700">
                  Skills <span className="text-gray-400 font-normal">(Optional)</span>
                </p>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  Can skip
                </span>
              </div>
              <p className="text-xs text-gray-500">
                List your primary technical skills (comma separated)
              </p>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[120px] focus:ring-1 focus:ring-indigo-500 outline-none"
                placeholder="e.g. React, Node.js, Python, System Design"
                value={formData.skills}
                onChange={(e) => updateForm("skills", e.target.value)}
              />
            </div>
          )}

          {/* ── Step 4 · Resume ── */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700">Resume Upload *</p>
              <p className="text-xs text-gray-500">
                Upload your resume (PDF or Word document, max 5MB)
              </p>

              {!resumeUrl ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = P;
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.style.borderColor = "#d1d5db";
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) handleResumeUpload(file);
                  }}
                  onClick={() => document.getElementById("resume-input")?.click()}
                >
                  <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                    <Upload className="text-indigo-600" size={24} />
                  </div>
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    Click to browse or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    PDF or Word document up to 5MB
                  </p>
                  <Button variant="secondary" size="sm" disabled={resumeUploading}>
                    {resumeUploading ? "Uploading..." : "Choose File"}
                  </Button>
                </div>
              ) : (
                <div className="border border-green-200 bg-green-50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">{resumeFile?.name}</p>
                    <p className="text-xs text-green-600">Successfully uploaded</p>
                  </div>
                  <button
                    onClick={() => {
                      setResumeUrl("");
                      setResumeFile(null);
                    }}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              <input
                id="resume-input"
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleResumeUpload(file);
                }}
              />

              {validationErrors.resume && (
                <p className="text-xs text-red-500">{validationErrors.resume}</p>
              )}
            </div>
          )}

          {/* ── Step 5 · Preferences ── FIX: label/placeholder now match payload (preferredLocations) */}
          {step === 5 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700">
                Preferred Locations{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </p>
              <p className="text-xs text-gray-500">
                Enter cities or regions where you'd like to work (comma separated)
              </p>
              <Input
                placeholder="e.g. Bangalore, Mumbai, Remote"
                value={formData.preferences}
                onChange={(e) => updateForm("preferences", e.target.value)}
              />
            </div>
          )}

          {/* ── Step 6 · Review ── */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="border border-indigo-100 bg-indigo-50 rounded-lg p-4">
                <p className="text-sm font-medium text-indigo-900">Review Your Information</p>
                <p className="text-xs text-indigo-700 mt-1">
                  Please verify all information is correct before submitting.
                </p>
              </div>

              {/* Personal */}
              <div className="border border-gray-100 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Personal Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Username:</span>
                    <span className="font-medium">{formData.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{formData.phone}</span>
                  </div>
                  {formData.linkedin && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">LinkedIn:</span>
                      <span className="font-medium text-blue-600 text-xs truncate">
                        {formData.linkedin}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 mt-3 font-medium"
                >
                  Edit
                </button>
              </div>

              {/* Academic */}
              <div className="border border-gray-100 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Academic Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">College:</span>
                    <span className="font-medium">{formData.college}</span>
                  </div>
                  {formData.degree && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Degree:</span>
                      <span className="font-medium">{formData.degree}</span>
                    </div>
                  )}
                  {formData.branch && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Branch:</span>
                      <span className="font-medium">{formData.branch}</span>
                    </div>
                  )}
                  {formData.cgpa && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">CGPA:</span>
                      <span className="font-medium">{formData.cgpa}</span>
                    </div>
                  )}
                  {formData.gradYear && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Grad Year:</span>
                      <span className="font-medium">{formData.gradYear}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 mt-3 font-medium"
                >
                  Edit
                </button>
              </div>

              {/* Skills */}
              {formData.skills && (
                <div className="border border-gray-100 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.split(",").map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setStep(3)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 mt-3 font-medium"
                  >
                    Edit
                  </button>
                </div>
              )}

              {/* Resume */}
              <div className="border border-gray-100 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Resume</h3>
                <p className="text-sm text-gray-600">{resumeFile?.name || "Resume uploaded"}</p>
                <button
                  onClick={() => setStep(4)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 mt-3 font-medium"
                >
                  Change
                </button>
              </div>

              {/* Preferred Locations */}
              {formData.preferences && (
                <div className="border border-gray-100 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Preferred Locations
                  </h3>
                  <ul className="text-sm space-y-1">
                    {formData.preferences.split(",").map((pref, idx) => (
                      <li key={idx}>• {pref.trim()}</li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setStep(5)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 mt-3 font-medium"
                  >
                    Edit
                  </button>
                </div>
              )}

              <div className="mt-6 p-4 border border-indigo-100 bg-indigo-50/50 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">Ready to submit?</p>
                <p className="text-xs text-indigo-600/80 mt-1">
                  Your profile will be securely saved and accessible to verified recruiters.
                </p>
              </div>
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
            <Button
              variant="secondary"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1 || isPending}
            >
              Back
            </Button>
            <div className="flex gap-2">
              {step < 6 ? (
                <Button onClick={handleNext} icon={ChevronRight}>
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleFinish}
                  icon={isPending ? Loader2 : Check}
                  disabled={isPending}
                >
                  {isPending ? "Submitting..." : "Submit"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}