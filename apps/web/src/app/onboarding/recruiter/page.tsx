"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChevronRight, Check, Building2, User, Briefcase, FileText, Loader2, AtSign } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { authService } from "@/lib/services/auth.service";
import { recruiterService } from "@/lib/services/recruiter.service";
import { useAuthStore } from "@/store/auth.store";
import { removeTokenCookie } from "@/lib/cookies";

const P = "#4f46e5";

export default function RecruiterOnboardingPage() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const labels = ["Personal", "Company", "Role", "Review"];
  const requiredFields: Record<number, string[]> = {
    1: ["name", "phone", "username"],
    2: ["companyName"],
    3: [],
    4: []
  };
  const isStepSkippable = (stepNum: number) => requiredFields[stepNum].length === 0;

  const authUser = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  const [formData, setFormData] = useState({
    // Personal
    name: "",
    phone: "",
    workEmail: "",
    username: "",
    // Company
    companyName: "",
    companyWebsite: "",
    companyIndustry: "",
    companySize: "",
    // Role
    designation: "",
    linkedinUrl: "",
    bio: "",
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

  // Validate token on mount - redirect to login if invalid
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
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
    setFormData(prev => ({ ...prev, [key]: value }));
    if (key === "username") {
      setUsernameError("");
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
          workEmail: formData.workEmail,
        },
        company: {
          name: formData.companyName,
          website: formData.companyWebsite || undefined,
          industry: formData.companyIndustry || undefined,
          size: formData.companySize || undefined,
        },
        designation: formData.designation,
        linkedinUrl: formData.linkedinUrl || undefined,
        bio: formData.bio || undefined,
      };
      return await recruiterService.completeOnboarding(payload);
    },
    onSuccess: () => {
      // Redirect to dashboard after onboarding complete
      router.push("/");
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || err.message || "Failed to submit profile. Please try again.";
      if (message.toLowerCase().includes("username")) {
        setUsernameError(message);
        setStep(1);
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
        <p className="text-center text-xs text-gray-500 mt-2">Step {step} of 4 — {labels[step - 1]}</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl p-8 su">
          <h2 className="text-xl font-700 text-gray-900 mb-4" style={{ fontWeight: 700 }}>Complete your recruiter profile</h2>
          <p className="text-sm text-gray-600 mb-6">This information will be reviewed by our team before your account is approved.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500">* Required fields</p>
              <div className="flex items-center gap-3 mb-4">
                <User size={20} color={P} />
                <h3 className="font-medium text-gray-900">Personal Information</h3>
              </div>
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
                <label className="text-sm font-medium text-gray-700">Work email address <span className="text-gray-400 font-normal">(Optional)</span></label>
                <Input placeholder="yourname@company.com" type="email" value={formData.workEmail} onChange={e => updateForm("workEmail", e.target.value)} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500">* Required fields</p>
              <div className="flex items-center gap-3 mb-4">
                <Building2 size={20} color={P} />
                <h3 className="font-medium text-gray-900">Company Information</h3>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Company name *</label>
                <Input placeholder="Enter company name" value={formData.companyName} onChange={e => updateForm("companyName", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Company website <span className="text-gray-400 font-normal">(Optional)</span></label>
                <Input placeholder="https://company.com" value={formData.companyWebsite} onChange={e => updateForm("companyWebsite", e.target.value)} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Industry <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <Input placeholder="e.g. Technology, Finance" value={formData.companyIndustry} onChange={e => updateForm("companyIndustry", e.target.value)} />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Company size <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <Input placeholder="e.g. 100-500" value={formData.companySize} onChange={e => updateForm("companySize", e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase size={20} color={P} />
                  <h3 className="font-medium text-gray-900">Your Role</h3>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Can skip</span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Designation <span className="text-gray-400 font-normal">(Optional)</span></label>
                <Input placeholder="e.g. HR Manager, Talent Acquisition" value={formData.designation} onChange={e => updateForm("designation", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">LinkedIn Profile URL <span className="text-gray-400 font-normal">(Optional)</span></label>
                <Input placeholder="https://linkedin.com/in/yourprofile" value={formData.linkedinUrl} onChange={e => updateForm("linkedinUrl", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Brief bio <span className="text-gray-400 font-normal">(Optional)</span></label>
                <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[100px] focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="Tell us about your role and hiring needs" value={formData.bio} onChange={e => updateForm("bio", e.target.value)} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <FileText size={20} color={P} />
                <h3 className="font-medium text-gray-900">Review & Submit</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Personal</p>
                  <p className="text-sm font-medium">{formData.name}</p>
                  <p className="text-sm text-gray-600">{formData.phone}</p>
                  <p className="text-sm text-gray-600">{formData.workEmail}</p>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Company</p>
                  <p className="text-sm font-medium">{formData.companyName}</p>
                  {formData.companyIndustry && <p className="text-sm text-gray-600">{formData.companyIndustry}</p>}
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Role</p>
                  <p className="text-sm font-medium">{formData.designation}</p>
                </div>
              </div>
              <div className="mt-4 p-4 border border-amber-100 bg-amber-50/50 rounded-lg">
                <p className="text-sm text-amber-800 font-medium">Pending Verification</p>
                <p className="text-xs text-amber-700/80 mt-1">
                  Your profile will be reviewed by our admin team. You will receive an email once approved.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1 || isPending}>Back</Button>
            <div className="flex gap-2">
              {isStepSkippable(step) && step < 4 && (
                <Button variant="secondary" onClick={() => setStep(s => s + 1)}>Skip</Button>
              )}
              {step < 4 ? (
                <Button onClick={() => setStep(s => s + 1)} icon={ChevronRight}>Next</Button>
              ) : (
                <Button
                  onClick={handleFinish}
                  icon={isPending ? Loader2 : Check}
                  disabled={isPending}
                >
                  {isPending ? "Submitting..." : "Submit for Verification"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
