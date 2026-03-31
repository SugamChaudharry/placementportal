"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronRight, Check, Loader2, AtSign } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { P } from "@/lib/constants";
import { api } from "@/lib/api";
import { userService } from "@/lib/services/user.service";
import { useAuthStore } from "@/store/auth.store";

type OnboardingPageProps = {
  onDone: () => void;
};

export default function OnboardingPage({ onDone }: OnboardingPageProps) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const labels = ["Personal", "Academic", "Skills", "Resume", "Preferences"];
  const requiredFields: Record<number, string[]> = {
    1: ["name", "phone", "username"],
    2: ["college"],
    3: [],
    4: [],
    5: []
  };
  const isStepSkippable = (stepNum: number) => requiredFields[stepNum].length === 0;
  
  const authUser = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [formData, setFormData] = useState({
    name: "", phone: "", linkedin: "", bio: "", username: "",
    college: "", degree: "", cgpa: "", gradYear: "",
    branch: "",
    skills: "", preferences: ""
  });

  // Fetch user profile to get auto-generated username
  const { data: userProfile } = useQuery({
    queryKey: ["me", token],
    queryFn: async () => {
      const response = await api.get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` }
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
      setFormData(prev => ({
        ...prev,
        name: userProfile.name || "",
        username: userProfile.username || "",
      }));
    }
  }, [userProfile]);

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (key === "username") {
      setUsernameError("");
    }
  };

  // Submit onboarding data to backend
  const { mutate: submitOnboarding, isPending } = useMutation({
    mutationFn: async () => {
      // Transform form data to match API schema
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
          technical: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
          soft: [],
          languages: [],
        },
        resume: {
          url: undefined,
        },
        preferences: {
          jobTypes: ["FULL_TIME", "INTERNSHIP"],
          preferredLocations: formData.preferences.split(",").map(s => s.trim()).filter(Boolean),
        },
      };
      return await userService.completeOnboarding(payload);
    },
    onSuccess: () => {
      onDone();
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || err.message || "Failed to save profile. Please try again.";
      if (message.toLowerCase().includes("username")) {
        setUsernameError(message);
        setStep(1); // Go back to step 1 to fix username
      } else {
        setError(message);
      }
    },
  });

  const handleFinish = () => {
    setError("");
    submitOnboarding();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg,#eef2ff,#f8fafc)" }}>
      <div className="px-6 py-4 border-b border-indigo-100 bg-white/80 backdrop-blur">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          {labels.map((l, i) => (
            <div key={i} className="flex-1 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-600 transition-colors"
                style={{ background: step > i ? P : step === i ? "#eef2ff" : "#e5e7eb", color: step > i ? "#fff" : step === i ? P : "#9ca3af", fontWeight: 600 }}>
                {step > i ? <Check size={14} className="text-white" /> : i + 1}
              </div>
              {i < labels.length - 1 && <div className="flex-1 h-0.5 rounded transition-colors" style={{ background: step > i ? P : "#e5e7eb" }} />}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">Step {step} of 5 — {labels[step - 1]}</p>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl p-8 su">
          <h2 className="text-xl font-700 text-gray-900 mb-4" style={{ fontWeight: 700 }}>Complete your profile</h2>
          <p className="text-sm text-gray-600 mb-6">This is a condensed onboarding flow matching the spec: photo, bio, academics, skills, resume upload, and preferences.</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500">* Required fields</p>
              <div>
                <label className="text-sm font-medium text-gray-700">Username *</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <AtSign size={16} />
                  </div>
                  <Input 
                    placeholder="Choose a username" 
                    value={formData.username} 
                    onChange={e => updateForm("username", e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Auto-generated. You can change it to a unique name.</p>
                {usernameError && <p className="text-xs text-red-500 mt-1">{usernameError}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Full name *</label>
                <Input placeholder="Enter your full name" value={formData.name} onChange={e => updateForm("name", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone number *</label>
                <Input placeholder="Enter your phone number" value={formData.phone} onChange={e => updateForm("phone", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">LinkedIn Profile URL <span className="text-gray-400 font-normal">(Optional)</span></label>
                <Input placeholder="https://linkedin.com/in/yourprofile" value={formData.linkedin} onChange={e => updateForm("linkedin", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Short bio <span className="text-gray-400 font-normal">(Optional)</span></label>
                <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[80px] focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="Tell us about yourself (max 300 chars)" value={formData.bio} onChange={e => updateForm("bio", e.target.value)} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500">* Required fields</p>
              <div>
                <label className="text-sm font-medium text-gray-700">University / College name *</label>
                <Input placeholder="Enter your college name" value={formData.college} onChange={e => updateForm("college", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Degree <span className="text-gray-400 font-normal">(Optional)</span></label>
                <Input placeholder="e.g. B.Tech Computer Science" value={formData.degree} onChange={e => updateForm("degree", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Branch <span className="text-gray-400 font-normal">(Optional)</span></label>
                <Input placeholder="e.g. Computer Science" value={formData.branch} onChange={e => updateForm("branch", e.target.value)} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">CGPA <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <Input placeholder="e.g. 8.5" value={formData.cgpa} onChange={e => updateForm("cgpa", e.target.value)} />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Graduation Year <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <Input placeholder="e.g. 2025" value={formData.gradYear} onChange={e => updateForm("gradYear", e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-700">Skills <span className="text-gray-400 font-normal">(Optional)</span></p>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Can skip</span>
              </div>
              <p className="text-xs text-gray-500">List your primary technical skills (comma separated)</p>
              <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[120px] focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="e.g. React, Node.js, Python, System Design" value={formData.skills} onChange={e => updateForm("skills", e.target.value)} />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-700">Resume Upload <span className="text-gray-400 font-normal">(Optional)</span></p>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Can skip</span>
              </div>
               <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                     <span className="text-indigo-600 font-bold text-lg">PDF</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 mb-1">Click to browse or drag and drop</p>
                  <p className="text-xs text-gray-500 mb-4">PDF up to 5MB</p>
                  <Button variant="secondary" size="sm" disabled>Choose File (Coming Soon)</Button>
               </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-700">Job Preferences <span className="text-gray-400 font-normal">(Optional)</span></p>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Can skip</span>
              </div>
              <p className="text-xs text-gray-500">Preferred Job Titles / Roles (comma separated)</p>
              <Input placeholder="e.g. Frontend Engineer, Product Manager" value={formData.preferences} onChange={e => updateForm("preferences", e.target.value)} />
              
              <div className="mt-6 p-4 border border-indigo-100 bg-indigo-50/50 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">Almost there!</p>
                <p className="text-xs text-indigo-600/80 mt-1">
                  By clicking finish, your profile will be securely saved and accessible to Verified Recruiters matching your skills.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1 || isPending}>Back</Button>
            <div className="flex gap-2">
              {isStepSkippable(step) && step < 5 && (
                <Button variant="secondary" onClick={() => setStep(s => s + 1)}>Skip</Button>
              )}
              {step < 5 ? (
                <Button onClick={() => setStep(s => s + 1)} icon={ChevronRight}>Next</Button>
              ) : (
                <Button 
                  onClick={handleFinish} 
                  icon={isPending ? Loader2 : Check}
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : "Finish & go to dashboard"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
