"use client";

import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Plus, Search, Upload, Users, X, Zap } from "lucide-react";
import { Av, Btn, Card, Input, Tag, Toggle } from "@/placement-portal/components/atoms";
import { PRIMARY } from "@/placement-portal/constants";

export function CreateTestPage() {
  const [step, setStep] = useState(1);
  const [questions, setQuestions] = useState<{ id: number; title: string; diff: string; tags: string[]; marks: number }[]>([]);
  const steps = ["Test Details", "Add Questions", "Assign Candidates", "Review & Publish"];

  const bankQuestions = [
    { id: 1, title: "Two Sum", diff: "Easy", tags: ["Array"] },
    { id: 2, title: "Longest Common Subsequence", diff: "Medium", tags: ["DP"] },
    { id: 3, title: "Merge K Sorted Lists", diff: "Hard", tags: ["Heap"] },
    { id: 4, title: "Graph BFS/DFS", diff: "Medium", tags: ["Graph"] },
  ];

  return (
    <div className="su max-w-3xl mx-auto">
      <div className="flex items-center mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all"
                style={{ borderColor: i + 1 <= step ? PRIMARY : "#d1d5db", background: i + 1 < step ? PRIMARY : i + 1 === step ? "#eef2ff" : "#fff" }}
              >
                {i + 1 < step ? <Check size={14} className="text-white" /> : <span className="text-xs font-medium" style={{ color: i + 1 === step ? PRIMARY : "#9ca3af" }}>{i + 1}</span>}
              </div>
              <p className="text-xs mt-1 text-center" style={{ color: i + 1 === step ? PRIMARY : "#9ca3af", fontWeight: i + 1 === step ? 600 : 400, width: 80 }}>
                {s}
              </p>
            </div>
            {i < steps.length - 1 && <div className="flex-1 h-0.5 mb-5" style={{ background: i + 1 < step ? PRIMARY : "#e5e7eb" }} />}
          </div>
        ))}
      </div>

      <Card className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-600 text-lg" style={{ fontWeight: 600 }}>
              Test Details
            </h3>
            {[
              ["Test Name", "e.g. SDE-2 Online Assessment"],
              ["Associated Drive", "Select drive"],
            ].map(([l, p]) => (
              <div key={l}>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">{l}</label>
                <Input placeholder={p} />
              </div>
            ))}
            <div className="grid grid-cols-3 gap-3">
              {[
                ["Duration (min)", "90"],
                ["Start Date", ""],
                ["End Date", ""],
              ].map(([l, p]) => (
                <div key={l}>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">{l}</label>
                  <Input placeholder={p} type={l.includes("Date") ? "date" : "number"} />
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Allowed Languages</p>
              <div className="flex gap-2 flex-wrap">
                {["Python", "Java", "C++", "JavaScript", "Go"].map((l) => (
                  <Tag key={l} label={l} onRemove={() => {}} />
                ))}
                <button className="px-2.5 py-1 border border-dashed border-gray-300 rounded-full text-xs text-gray-400">+ Add</button>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-3">Proctoring Settings</p>
              <div className="space-y-2">
                {(
                  [
                    ["Camera Required", true],
                    ["Show Results Immediately", false],
                    ["Allow Hints", false],
                  ] as const
                ).map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-700">{l}</span>
                    <Toggle on={v} onToggle={() => {}} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="font-600 text-lg mb-4" style={{ fontWeight: 600 }}>
              Add Questions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Question Bank</p>
                <Input placeholder="Search questions..." prefix={Search} className="mb-2" />
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {bankQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer"
                      onClick={() => !questions.find((x) => x.id === q.id) && setQuestions((qs) => [...qs, { ...q, marks: 10 }])}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{q.title}</p>
                        <span className="text-xs" style={{ color: { Easy: "#10b981", Medium: "#f59e0b", Hard: "#ef4444" }[q.diff as "Easy" | "Medium" | "Hard"] }}>
                          {q.diff}
                        </span>
                      </div>
                      <Plus size={14} style={{ color: PRIMARY }} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Test Questions ({questions.length})</p>
                {questions.length === 0 ? (
                  <div className="h-40 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
                    <p className="text-sm text-gray-400">Drag questions here</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {questions.map((q, i) => (
                      <div key={q.id} className="flex items-center gap-3 p-3 border border-indigo-100 rounded-xl" style={{ background: "#eef2ff" }}>
                        <span className="text-xs font-medium" style={{ color: PRIMARY }}>
                          Q{i + 1}
                        </span>
                        <p className="text-sm font-medium text-gray-800 flex-1">{q.title}</p>
                        <input type="number" defaultValue={q.marks} className="w-16 text-xs border border-gray-200 rounded px-2 py-1 text-center" />
                        <span className="text-xs text-gray-400">pts</span>
                        <button type="button" onClick={() => setQuestions((qs) => qs.filter((x) => x.id !== q.id))}>
                          <X size={14} className="text-gray-400" />
                        </button>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <span className="text-sm text-gray-500">Total</span>
                      <span className="font-600" style={{ fontWeight: 600, color: PRIMARY }}>
                        {questions.reduce((s, q) => s + q.marks, 0)} marks
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="font-600 text-lg mb-4" style={{ fontWeight: 600 }}>
              Assign Candidates
            </h3>
            <div className="p-4 rounded-xl border border-gray-200 mb-4">
              <p className="text-sm text-gray-600">
                89 eligible candidates from <strong>SDE-2 2025</strong> drive will be assigned
              </p>
            </div>
            <div className="flex gap-3 mb-4">
              <Btn variant="secondary" size="sm" icon={Users}>
                Select All (89)
              </Btn>
              <Btn variant="secondary" size="sm" icon={Upload}>
                Import CSV
              </Btn>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {[
                ["Arjun Kumar", "20CS101", "CSE", "8.9"],
                ["Priya Sharma", "20CS045", "CSE", "9.2"],
                ["Rahul Singh", "20IT023", "IT", "8.4"],
                ["Ananya Verma", "20CS089", "CSE", "9.5"],
              ].map(([name, roll, branch, cgpa]) => (
                <div key={roll} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <Av name={name} size={28} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{name}</p>
                    <p className="text-xs text-gray-400">
                      {roll} · {branch} · CGPA: {cgpa}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="font-600 text-lg mb-4" style={{ fontWeight: 600 }}>
              Review & Publish
            </h3>
            <div className="space-y-3">
              {[
                ["Test Name", "SDE-2 Online Assessment"],
                ["Duration", "90 minutes"],
                ["Questions", `${questions.length} questions`],
                ["Total Marks", `${questions.reduce((s, q) => s + q.marks, 0)} marks`],
                ["Candidates", "89 candidates"],
                ["Proctoring", "Camera required, Tab switch limit: 3"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">{k}</span>
                  <span className="text-sm font-medium text-gray-800">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 p-4 rounded-xl" style={{ background: "#fef3c7" }}>
              <p className="text-sm text-amber-700">⚠️ Once published, students will be notified immediately. You cannot change questions after publishing.</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
          <Btn variant="secondary" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1} icon={ChevronLeft}>
            Back
          </Btn>
          <Btn onClick={() => setStep((s) => Math.min(4, s + 1))} icon={step === 4 ? Zap : ChevronRight}>
            {step === 4 ? "Publish Test" : "Next"}
          </Btn>
        </div>
      </Card>
    </div>
  );
}
