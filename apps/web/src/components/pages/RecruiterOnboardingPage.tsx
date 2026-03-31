"use client";

import React, { useState } from "react";
import { ChevronRight, Check, Building2, User, Briefcase, FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { P } from "@/lib/constants";

type RecruiterOnboardingPageProps = {
  onDone: () => void;
};

export default function RecruiterOnboardingPage({ onDone }: RecruiterOnboardingPageProps) {
  const [step, setStep] = useState(1);
  const labels = ["Personal", "Company", "Role", "Review"];

  const [formData, setFormData] = useState({
    // Personal
    name: "",
    phone: "",
    workEmail: "",
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

  const updateForm = (key: string, value: string) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleFinish = () => {
    // TODO: Submit to API
    // await userService.completeRecruiterOnboarding(formData);
    onDone();
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

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <User size={20} color={P} />
                <h3 className="font-medium text-gray-900">Personal Information</h3>
              </div>
              <Input placeholder="Full name" value={formData.name} onChange={e => updateForm("name", e.target.value)} />
              <Input placeholder="Phone number" value={formData.phone} onChange={e => updateForm("phone", e.target.value)} />
              <Input placeholder="Work email address" type="email" value={formData.workEmail} onChange={e => updateForm("workEmail", e.target.value)} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Building2 size={20} color={P} />
                <h3 className="font-medium text-gray-900">Company Information</h3>
              </div>
              <Input placeholder="Company name" value={formData.companyName} onChange={e => updateForm("companyName", e.target.value)} />
              <Input placeholder="Company website (optional)" value={formData.companyWebsite} onChange={e => updateForm("companyWebsite", e.target.value)} />
              <div className="flex gap-4">
                <Input placeholder="Industry (e.g. Technology, Finance)" value={formData.companyIndustry} onChange={e => updateForm("companyIndustry", e.target.value)} />
                <Input placeholder="Company size (e.g. 100-500)" value={formData.companySize} onChange={e => updateForm("companySize", e.target.value)} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase size={20} color={P} />
                <h3 className="font-medium text-gray-900">Your Role</h3>
              </div>
              <Input placeholder="Designation (e.g. HR Manager, Talent Acquisition)" value={formData.designation} onChange={e => updateForm("designation", e.target.value)} />
              <Input placeholder="LinkedIn Profile URL (optional)" value={formData.linkedinUrl} onChange={e => updateForm("linkedinUrl", e.target.value)} />
              <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[100px] focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="Brief bio about your role and hiring needs (optional)" value={formData.bio} onChange={e => updateForm("bio", e.target.value)} />
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
            <Button variant="secondary" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}>Back</Button>
            {step < 4 ? (
              <Button onClick={() => setStep(s => s + 1)} icon={ChevronRight}>Next</Button>
            ) : (
              <Button onClick={handleFinish} icon={Check}>Submit for Verification</Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
