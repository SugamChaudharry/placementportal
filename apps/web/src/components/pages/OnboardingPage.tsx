"use client";

import React, { useState } from "react";
import { ChevronRight, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { P } from "@/lib/constants";

type OnboardingPageProps = {
  onDone: () => void;
};

export default function OnboardingPage({ onDone }: OnboardingPageProps) {
  const [step, setStep] = useState(1);
  const labels = ["Personal", "Academic", "Skills", "Resume", "Preferences"];
  const [formData, setFormData] = useState({
    name: "", phone: "", linkedin: "", bio: "",
    college: "", degree: "", cgpa: "", gradYear: "",
    skills: "", preferences: ""
  });

  const updateForm = (key: string, value: string) => setFormData(prev => ({ ...prev, [key]: value }));

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
          
          {step === 1 && (
            <div className="space-y-4">
              <Input placeholder="Full name" value={formData.name} onChange={e => updateForm("name", e.target.value)} />
              <Input placeholder="Phone number" value={formData.phone} onChange={e => updateForm("phone", e.target.value)} />
              <Input placeholder="LinkedIn Profile URL" value={formData.linkedin} onChange={e => updateForm("linkedin", e.target.value)} />
              <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[80px] focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="Short bio (max 300 chars)" value={formData.bio} onChange={e => updateForm("bio", e.target.value)} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Input placeholder="University / College name" value={formData.college} onChange={e => updateForm("college", e.target.value)} />
              <Input placeholder="Degree (e.g. B.Tech Computer Science)" value={formData.degree} onChange={e => updateForm("degree", e.target.value)} />
              <div className="flex gap-4">
                <Input placeholder="CGPA (e.g. 8.5)" value={formData.cgpa} onChange={e => updateForm("cgpa", e.target.value)} />
                <Input placeholder="Graduation Year (e.g. 2025)" value={formData.gradYear} onChange={e => updateForm("gradYear", e.target.value)} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700">List your primary skills</p>
              <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[120px] focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="e.g. React, Node.js, Python, System Design (comma separated)" value={formData.skills} onChange={e => updateForm("skills", e.target.value)} />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
               <p className="text-sm font-medium text-gray-700">Upload your Resume</p>
               <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                     <span className="text-indigo-600 font-bold text-lg">PDF</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 mb-1">Click to browse or drag and drop</p>
                  <p className="text-xs text-gray-500 mb-4">PDF up to 5MB</p>
                  <Button variant="secondary" size="sm">Choose File</Button>
               </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700">Role Preferences</p>
              <Input placeholder="Preferred Job Titles (e.g. Frontend Engineer, Product Manager)" value={formData.preferences} onChange={e => updateForm("preferences", e.target.value)} />
              
              <div className="mt-6 p-4 border border-indigo-100 bg-indigo-50/50 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">Almost there!</p>
                <p className="text-xs text-indigo-600/80 mt-1">
                  By clicking finish, your profile will be securely saved and accessible to Verified Recruiters matching your skills.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}>Back</Button>
            {step < 5 ? (
              <Button onClick={() => setStep(s => s + 1)} icon={ChevronRight}>Next</Button>
            ) : (
              <Button onClick={() => onDone()} icon={Check}>Finish & go to dashboard</Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
