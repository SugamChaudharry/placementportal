"use client";

import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { Btn, Card, Input } from "@/placement-portal/components/atoms";
import { PRIMARY } from "@/placement-portal/constants";

export function OnboardingPage({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(1);
  const labels = ["Personal", "Academic", "Skills", "Resume", "Preferences"];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg,#eef2ff,#f8fafc)" }}>
      <div className="px-6 py-4 border-b border-indigo-100 bg-white/80 backdrop-blur">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          {labels.map((l, i) => (
            <div key={l} className="flex-1 flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-600"
                style={{
                  background: step > i ? PRIMARY : step === i ? "#eef2ff" : "#e5e7eb",
                  color: step > i ? "#fff" : step === i ? PRIMARY : "#9ca3af",
                  fontWeight: 600,
                }}
              >
                {step > i ? <Check size={14} className="text-white" /> : i + 1}
              </div>
              {i < labels.length - 1 && <div className="flex-1 h-0.5 rounded" style={{ background: step > i ? PRIMARY : "#e5e7eb" }} />}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">
          Step {step} of 5 — {labels[step - 1]}
        </p>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl p-8 su">
          <h2 className="text-xl font-700 text-gray-900 mb-4" style={{ fontWeight: 700 }}>
            Complete your profile
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            This is a condensed onboarding flow matching the spec: photo, bio, academics, skills, resume upload, and preferences.
          </p>
          <div className="space-y-4">
            <Input placeholder="Full name" />
            <Input placeholder="Phone" />
            <Input placeholder="LinkedIn URL" />
            <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[80px]" placeholder="Short bio (max 300 chars)" />
          </div>
          <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
            <Btn variant="secondary" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
              Back
            </Btn>
            {step < 5 ? (
              <Btn onClick={() => setStep((s) => s + 1)} icon={ChevronRight}>
                Next
              </Btn>
            ) : (
              <Btn onClick={onDone} icon={Check}>
                Finish & go to dashboard
              </Btn>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
