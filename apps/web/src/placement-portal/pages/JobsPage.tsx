"use client";

import { useState } from "react";
import {
  Bookmark,
  Calendar,
  CheckCircle,
  Clock,
  Lock,
  MapPin,
  Search,
  Share2,
} from "lucide-react";
import { Btn, Card, ColorBdg, Input, LogoCircle, Tag, Toggle } from "@/placement-portal/components/atoms";
import { PRIMARY } from "@/placement-portal/constants";
import { JOBS } from "@/placement-portal/mock-data";

export function JobsPage({ setPage }: { setPage: (p: string) => void }) {
  const [selectedJob, setSelectedJob] = useState<(typeof JOBS)[0] | null>(null);
  const [filterType, setFilterType] = useState("All");
  const [showEligible, setShowEligible] = useState(false);
  const [search, setSearch] = useState("");
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set([2, 4]));
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set([3]));
  const [activeTab, setActiveTab] = useState("all");

  const filtered = JOBS.filter((j) => {
    if (search && !j.role.toLowerCase().includes(search.toLowerCase()) && !j.company.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== "All" && j.type !== filterType) return false;
    if (showEligible && !j.eligible) return false;
    return true;
  });

  return (
    <div className="su flex gap-5 h-full" style={{ minHeight: 0 }}>
      <div className="w-64 flex-shrink-0">
        <Card className="p-4 sticky top-0">
          <p className="font-600 text-sm mb-4" style={{ fontWeight: 600 }}>
            Filters
          </p>
          <Input placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} prefix={Search} />
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-500 mb-2">Job Type</p>
            {["All", "Full-time", "Internship"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className="flex items-center gap-2 w-full py-1.5 text-sm hover:bg-gray-50 rounded-lg px-2 transition-colors"
                style={{ color: filterType === t ? PRIMARY : "#6b7280", fontWeight: filterType === t ? 600 : 400 }}
              >
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: filterType === t ? PRIMARY : "#d1d5db" }}>
                  {filterType === t && <div className="w-2 h-2 rounded-full" style={{ background: PRIMARY }} />}
                </div>
                {t}
              </button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">Eligibility</p>
            <Toggle on={showEligible} onToggle={() => setShowEligible(!showEligible)} label="Eligible only" />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">CTC Range</p>
            <input type="range" className="w-full" style={{ accentColor: PRIMARY }} />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0 LPA</span>
              <span>50 LPA</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Btn
              variant="secondary"
              size="sm"
              className="flex-1 justify-center"
              onClick={() => {
                setSearch("");
                setFilterType("All");
                setShowEligible(false);
              }}
            >
              Reset
            </Btn>
            <Btn size="sm" className="flex-1 justify-center">
              Apply
            </Btn>
          </div>
        </Card>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex gap-1 mb-4 bg-white rounded-xl border border-gray-100 p-1.5 shadow-sm">
          {(
            [
              ["all", "All Jobs", filtered.length],
              ["applied", "Applied", 1],
              ["saved", "Saved", 2],
            ] as const
          ).map(([id, label, count]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: activeTab === id ? PRIMARY : "transparent", color: activeTab === id ? "#fff" : "#6b7280" }}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-500">
            Showing <strong>{filtered.length}</strong> jobs
          </p>
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none" style={{ color: "#374151" }}>
            <option>Newest first</option>
            <option>CTC: High to Low</option>
            <option>Deadline</option>
          </select>
        </div>

        <div className="space-y-3">
          {filtered.map((j) => (
            <Card
              key={j.id}
              className={`p-4 cursor-pointer transition-all duration-200 ${selectedJob?.id === j.id ? "ring-2 ring-indigo-600" : "hover:shadow-md"}`}
              style={{ borderColor: selectedJob?.id === j.id ? PRIMARY : undefined }}
              onClick={() => setSelectedJob(selectedJob?.id === j.id ? null : j)}
            >
              <div className="flex items-start gap-4">
                <LogoCircle letter={j.logo} color={j.color} size={46} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-600 text-gray-900" style={{ fontWeight: 600 }}>
                        {j.role}
                      </p>
                      <p className="text-sm text-gray-500">
                        {j.company} · <MapPin size={11} className="inline" /> {j.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSavedJobs((s) => {
                            const n = new Set(s);
                            n.has(j.id) ? n.delete(j.id) : n.add(j.id);
                            return n;
                          });
                        }}
                      >
                        <Bookmark size={16} style={{ color: savedJobs.has(j.id) ? PRIMARY : "#9ca3af", fill: savedJobs.has(j.id) ? PRIMARY : "none" }} />
                      </button>
                      {j.eligible ? <CheckCircle size={16} className="text-emerald-500" /> : <Lock size={16} className="text-red-400" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="font-600 text-sm" style={{ fontWeight: 600, color: PRIMARY }}>
                      {j.ctc}
                    </span>
                    <ColorBdg label={j.type} color="#4f46e5" />
                    <span className="text-xs text-red-500 flex items-center gap-1">
                      <Clock size={11} /> Closes {j.deadline}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">{j.skills.slice(0, 4).map((s) => <Tag key={s} label={s} />)}</div>
                </div>
              </div>

              {selectedJob?.id === j.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 fi">
                  <p className="text-sm text-gray-600 mb-4">{j.desc}</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      ["Eligibility", j.eligible ? "✓ You meet all criteria" : "✗ CGPA below requirement"],
                      ["Application Deadline", j.deadline],
                      ["Package", j.ctc],
                      ["Location", j.location],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <p className="text-xs text-gray-400">{k}</p>
                        <p className="text-sm font-medium text-gray-800">{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {appliedJobs.has(j.id) ? (
                      <Btn variant="success" className="flex-1 justify-center" disabled icon={CheckCircle}>
                        Applied
                      </Btn>
                    ) : (
                      <Btn
                        className="flex-1 justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAppliedJobs((s) => new Set([...s, j.id]));
                        }}
                        disabled={!j.eligible}
                      >
                        {j.eligible ? "Apply Now" : "Ineligible"}
                      </Btn>
                    )}
                    <Btn variant="secondary" size="md" icon={Calendar}>
                      Add to Calendar
                    </Btn>
                    <Btn variant="secondary" size="md" icon={Share2}>
                      Share
                    </Btn>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
