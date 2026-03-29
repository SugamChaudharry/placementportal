"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Download, Plus, RefreshCw, Sparkles } from "lucide-react";
import { Btn, Card } from "@/placement-portal/components/atoms";
import { PRIMARY } from "@/placement-portal/constants";

export function ResumeEditorPage() {
  const [activeSection, setActiveSection] = useState("work experience");
  const sections = ["Personal Info", "Summary", "Education", "Work Experience", "Projects", "Skills", "Certifications", "Achievements"];

  return (
    <div className="su flex gap-0 h-full" style={{ height: "calc(100vh - 120px)" }}>
      <div className="w-96 flex-shrink-0 flex flex-col">
        <Card className="flex items-center gap-2 px-4 py-3 rounded-b-none border-b border-gray-100">
          <Btn size="sm" icon={RefreshCw}>
            Save
          </Btn>
          <Btn size="sm" variant="secondary" icon={Download}>
            PDF
          </Btn>
          <div className="h-5 w-px bg-gray-200" />
          <select className="text-xs border border-gray-200 rounded px-2 py-1">
            {["Modern", "Classic", "Minimal", "Creative", "ATS-Optimized", "Two-column"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <div className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg" style={{ background: "#d1fae5" }}>
            <span className="font-700 text-emerald-700" style={{ fontWeight: 700 }}>
              82
            </span>
            <span className="text-xs text-emerald-600 font-medium">ATS</span>
          </div>
        </Card>
        <Card className="flex-1 overflow-y-auto rounded-t-none space-y-1 p-2">
          {sections.map((s) => (
            <div key={s}>
              <button
                onClick={() => setActiveSection(s.toLowerCase())}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 text-left transition-colors"
                style={{ background: activeSection === s.toLowerCase() ? "#eef2ff" : "" }}
              >
                <span className="text-sm font-medium" style={{ color: activeSection === s.toLowerCase() ? PRIMARY : "#374151" }}>
                  {s}
                </span>
                <ChevronDown size={14} className="text-gray-400" style={{ transform: activeSection === s.toLowerCase() ? "rotate(180deg)" : "none" }} />
              </button>
              {activeSection === s.toLowerCase() && s === "Work Experience" && (
                <div className="px-4 pb-4 fi">
                  <div className="space-y-3">
                    {["Software Engineering Intern · Groww · May–Aug 2024"].map((exp, i) => (
                      <div key={i} className="p-3 border border-gray-200 rounded-xl">
                        <p className="text-xs font-medium text-gray-700 mb-2">{exp}</p>
                        <div className="space-y-2">
                          {[
                            "Built real-time portfolio tracking using WebSocket + Redis pub/sub, reducing latency by 40%.",
                            "Implemented caching layer for market data API reducing DB queries by 60%.",
                          ].map((b, j) => (
                            <div key={j} className="flex items-start gap-2 group">
                              <ArrowRight size={12} className="text-gray-400 mt-1 flex-shrink-0" />
                              <p className="text-xs text-gray-600 flex-1">{b}</p>
                              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Sparkles size={12} style={{ color: PRIMARY }} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <Btn size="sm" variant="ghost" icon={Sparkles} className="mt-2">
                          AI Improve
                        </Btn>
                      </div>
                    ))}
                    <Btn size="sm" variant="secondary" icon={Plus}>
                      Add Experience
                    </Btn>
                  </div>
                  <div className="mt-3 p-3 rounded-xl" style={{ background: "#f0f0ff" }}>
                    <p className="text-xs font-medium mb-1" style={{ color: PRIMARY }}>
                      AI Features
                    </p>
                    <div className="space-y-1">
                      {["Tailor to job description", "Generate summary", "ATS keyword check"].map((a) => (
                        <button key={a} className="block text-xs hover:underline" style={{ color: PRIMARY }}>
                          {a} →
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </Card>
      </div>

      <Card className="flex-1 flex flex-col rounded-l-none">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <button className="text-gray-400 hover:text-gray-600">
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-gray-500">1 / 1</span>
            <button className="text-gray-400 hover:text-gray-600">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex gap-2">
            <button className="text-gray-400 hover:text-gray-600 text-xs">75%</button>
            <button className="text-gray-400 hover:text-gray-600 text-xs">100%</button>
            <button className="text-gray-400 hover:text-gray-600 text-xs">125%</button>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-gray-200 flex items-start justify-center p-8">
          <div className="bg-white shadow-2xl" style={{ width: 595, minHeight: 842, padding: 48 }}>
            <div style={{ borderBottom: `3px solid ${PRIMARY}`, paddingBottom: 16, marginBottom: 20 }}>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1e293b" }}>Arjun Kumar</h1>
              <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>arjun@iit.ac.in · +91 98765 43210 · linkedin.com/in/arjun · github.com/arjun</p>
            </div>
            {[
              ["EDUCATION", "B.Tech Computer Science · IIT Bombay · 2021–2025\nCGPA: 8.9/10 · 12th: 91.6% CBSE · 10th: 94.2% CBSE"],
              [
                "EXPERIENCE",
                "Software Engineering Intern · Groww · May 2024 – Aug 2024\n• Built real-time portfolio tracking using WebSocket + Redis pub/sub\n• Reduced DB queries by 60% through strategic caching layer\n\nResearch Intern · TIFR · Dec 2023 – Feb 2024\n• NLP research for low-resource language translation",
              ],
              ["SKILLS", "Python, JavaScript, Java, C++ | React, Node.js, FastAPI | AWS, GCP, Docker, Redis, PostgreSQL"],
              [
                "PROJECTS",
                "PlaceMe Portal — React, Node.js, PostgreSQL, Redis\nCampus placement management system with AI-powered features\n\nStock Analyzer — Python, FastAPI, WebSocket\nReal-time stock screener with technical indicators",
              ],
            ].map(([heading, content]) => (
              <div key={heading} style={{ marginBottom: 20 }}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: PRIMARY,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    borderBottom: "1px solid #e2e8f0",
                    paddingBottom: 4,
                    marginBottom: 8,
                  }}
                >
                  {heading}
                </p>
                <pre style={{ fontSize: 12, color: "#374151", whiteSpace: "pre-wrap", lineHeight: 1.6, fontFamily: "inherit" }}>{content}</pre>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
