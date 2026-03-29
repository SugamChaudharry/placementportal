"use client";

import { useState } from "react";
import {
  Award,
  CheckCircle,
  ClipboardList,
  Code2,
  Copy,
  Download,
  Edit3,
  FileText,
  Github,
  Linkedin,
  Mail,
  Phone,
  Plus,
  Share2,
  User,
  X,
} from "lucide-react";
import { Av, Btn, Card, ColorBdg, SectionHeader, Tag, Toggle } from "@/placement-portal/components/atoms";
import { PRIMARY } from "@/placement-portal/constants";

export function ProfilePage({ setPage }: { setPage: (p: string) => void }) {
  const [tab, setTab] = useState("personal");
  const [editMode, setEditMode] = useState(false);
  const tabs = ["personal", "skills", "resume", "preferences", "activity"];
  const skills: Record<string, string[]> = {
    Languages: ["Python", "JavaScript", "Java", "C++"],
    Frameworks: ["React", "Node.js", "FastAPI", "Spring"],
    Tools: ["Git", "Docker", "Redis", "PostgreSQL"],
    Cloud: ["AWS", "GCP"],
  };

  return (
    <div className="su flex gap-6">
      <div className="w-72 flex-shrink-0 space-y-4">
        <Card className="p-6 text-center">
          <div className="relative inline-block mb-4">
            <Av name="Arjun Kumar" size={80} />
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center" style={{ background: PRIMARY }}>
              <Edit3 size={12} className="text-white" />
            </button>
          </div>
          <h2 style={{ fontWeight: 700, fontSize: 18 }}>Arjun Kumar</h2>
          <p className="text-sm text-gray-500 mt-0.5">B.Tech CSE · IIT Bombay</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <ColorBdg label="Student" color="#4f46e5" />
            <ColorBdg label="Class of 2025" color="#0891b2" />
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="text-center">
              <p className="font-700 text-lg" style={{ fontWeight: 700 }}>
                8.9
              </p>
              <p className="text-xs text-gray-400">CGPA</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <p className="font-700 text-lg" style={{ fontWeight: 700 }}>
                6
              </p>
              <p className="text-xs text-gray-400">Applications</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <p className="font-700 text-lg" style={{ fontWeight: 700 }}>
                1
              </p>
              <p className="text-xs text-gray-400">Offer</p>
            </div>
          </div>
          <div className="flex justify-center gap-3 mt-4">
            {[Mail, Phone, Linkedin, Github].map((Icon, i) => (
              <button key={i} className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 hover:bg-gray-50 text-gray-500">
                <Icon size={15} />
              </button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Profile completion</span>
              <span className="text-xs font-600" style={{ fontWeight: 600, color: PRIMARY }}>
                74%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: "74%", background: "linear-gradient(90deg,#4f46e5,#7c3aed)" }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">Add 2 projects to reach 90%</p>
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-medium text-gray-500 mb-3">QUICK ACTIONS</p>
          <div className="space-y-2">
            <Btn variant="secondary" size="sm" className="w-full justify-center" icon={FileText} onClick={() => setPage("resume-editor")}>
              View Resume
            </Btn>
            <Btn variant="secondary" size="sm" className="w-full justify-center" icon={Download}>
              Download PDF
            </Btn>
            <Btn variant="primary" size="sm" className="w-full justify-center" icon={Edit3} onClick={() => setPage("resume-editor")}>
              Edit Resume
            </Btn>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Public profile link</p>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-xs text-gray-500 flex-1 truncate">placeme.io/u/arjun</span>
              <button className="text-gray-400">
                <Copy size={12} />
              </button>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex-1 min-w-0">
        <Card>
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-5 py-4 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-all"
                style={{ borderColor: tab === t ? PRIMARY : "transparent", color: tab === t ? PRIMARY : "#6b7280" }}
              >
                {t}
              </button>
            ))}
            <button onClick={() => setEditMode(!editMode)} className="ml-auto px-4 flex items-center gap-1.5 text-sm" style={{ color: editMode ? "#ef4444" : PRIMARY }}>
              {editMode ? (
                <>
                  <X size={14} />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 size={14} />
                  Edit
                </>
              )}
            </button>
          </div>
          <div className="p-6 fi">
            {tab === "personal" && (
              <div className="grid grid-cols-2 gap-5">
                {[
                  ["Full Name", "Arjun Kumar"],
                  ["Roll Number", "20CS101"],
                  ["Branch", "Computer Science"],
                  ["CGPA", "8.9 / 10"],
                  ["Graduation Year", "2025"],
                  ["Phone", "+91 98765 43210"],
                  ["Date of Birth", "15 Aug 2002"],
                  ["Gender", "Male"],
                  ["10th Percentage", "94.2% (CBSE)"],
                  ["12th Percentage", "91.6% (CBSE)"],
                  ["Active Backlogs", "None"],
                  ["LinkedIn", "linkedin.com/in/arjun"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs text-gray-400 mb-1">{k}</p>
                    {editMode ? (
                      <input defaultValue={v} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
                    ) : (
                      <p className="text-sm font-medium text-gray-800">{v}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {tab === "skills" && (
              <div className="space-y-5">
                {Object.entries(skills).map(([cat, items]) => (
                  <div key={cat}>
                    <p className="text-xs font-medium text-gray-400 mb-2">{cat.toUpperCase()}</p>
                    <div className="flex flex-wrap gap-2">
                      {items.map((s) => (
                        <Tag key={s} label={s} onRemove={editMode ? () => {} : undefined} />
                      ))}
                      {editMode && <button className="px-2.5 py-1 border border-dashed border-gray-300 rounded-full text-xs text-gray-400 hover:border-indigo-400">+ Add</button>}
                    </div>
                  </div>
                ))}
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-3">WORK EXPERIENCE</p>
                  <div className="space-y-3">
                    {[
                      {
                        role: "SDE Intern",
                        company: "Groww",
                        period: "May 2024 – Aug 2024",
                        desc: "Built real-time portfolio tracking features using WebSocket and Redis pub/sub.",
                      },
                      {
                        role: "Research Intern",
                        company: "TIFR",
                        period: "Dec 2023 – Feb 2024",
                        desc: "Worked on NLP research for low-resource language translation.",
                      },
                    ].map((e, i) => (
                      <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-600 text-sm" style={{ fontWeight: 600 }}>
                              {e.role}
                            </p>
                            <p className="text-xs text-gray-500">
                              {e.company} · {e.period}
                            </p>
                          </div>
                          {editMode && (
                            <button className="text-gray-400">
                              <Edit3 size={14} />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{e.desc}</p>
                      </div>
                    ))}
                    {editMode && (
                      <Btn variant="secondary" size="sm" icon={Plus}>
                        Add Experience
                      </Btn>
                    )}
                  </div>
                </div>
              </div>
            )}
            {tab === "preferences" && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-600 mb-3" style={{ fontWeight: 600 }}>
                    Job Preferences
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Interested Roles</p>
                      <div className="flex flex-wrap gap-2">{["SDE", "Backend Engineer", "ML Engineer"].map((r) => <Tag key={r} label={r} />)}</div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Preferred Locations</p>
                      <div className="flex flex-wrap gap-2">{["Bangalore", "Mumbai", "Remote"].map((l) => <Tag key={l} label={l} />)}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-600 mb-3" style={{ fontWeight: 600 }}>
                    Notifications
                  </p>
                  <div className="space-y-2">
                    {["Email updates for new jobs", "SMS for test reminders", "Push for shortlist results", "In-app for messages"].map((n, i) => (
                      <div key={n} className="flex items-center justify-between py-2 border-b border-gray-50">
                        <span className="text-sm text-gray-700">{n}</span>
                        <Toggle on={i !== 1} onToggle={() => {}} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {tab === "activity" && (
              <div className="space-y-3">
                {[
                  { icon: ClipboardList, color: "#4f46e5", text: "Applied to Google SDE position", time: "2 days ago" },
                  { icon: CheckCircle, color: "#10b981", text: "Shortlisted for Flipkart Data Analyst", time: "5 days ago" },
                  { icon: Code2, color: "#f59e0b", text: "Completed Microsoft OA – Score: 84/100", time: "1 week ago" },
                  { icon: FileText, color: "#6366f1", text: "Updated resume and improved ATS score by 8 points", time: "1 week ago" },
                  { icon: Award, color: "#059669", text: "Received offer from Groww – ₹18 LPA", time: "2 weeks ago" },
                  { icon: User, color: "#0891b2", text: "Completed profile onboarding", time: "1 month ago" },
                ].map((a, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: a.color + "20" }}>
                      <a.icon size={14} style={{ color: a.color }} />
                    </div>
                    <div className="flex-1 pt-1.5 border-b border-gray-50 pb-3">
                      <p className="text-sm text-gray-700">{a.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tab === "resume" && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Btn icon={Edit3} onClick={() => setPage("resume-editor")}>
                    Edit Resume
                  </Btn>
                  <Btn variant="secondary" icon={Download}>
                    Download PDF
                  </Btn>
                  <Btn variant="secondary" icon={Share2}>
                    Share Link
                  </Btn>
                  <div className="ml-auto flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#d1fae5" }}>
                    <span className="font-700 text-emerald-700" style={{ fontWeight: 700, fontSize: 24 }}>
                      82
                    </span>
                    <div>
                      <p className="text-xs font-600 text-emerald-700" style={{ fontWeight: 600 }}>
                        ATS Score
                      </p>
                      <p className="text-xs text-emerald-600">Good match</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 text-center" style={{ minHeight: 400 }}>
                  <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500 text-sm">Resume preview would render here</p>
                  <p className="text-xs text-gray-400 mt-1">PDF viewer (pdf-lib)</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
