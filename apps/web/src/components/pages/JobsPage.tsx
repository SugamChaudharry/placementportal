"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsService, type Job } from "@/lib/services/jobs.service";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { LogoCircle } from "@/components/ui/LogoCircle";
import { Bookmark, MapPin, Briefcase, DollarSign, Search, Filter, Building2, CheckCircle, Lock, Clock } from "lucide-react";

const P = "#4f46e5";

// ─── JobsPage Component ──────────────────────────────────────────────────────
function JobsPage({ setPage }: { setPage: (page: string) => void }) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filterType, setFilterType] = useState("All");
  const [showEligible, setShowEligible] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const qc = useQueryClient();

  // Fetch jobs from API
  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["jobs", { q: search, type: filterType !== "All" ? filterType : undefined, eligible_only: showEligible }],
    queryFn: () => jobsService.getJobs({
      q: search || undefined,
      type: filterType !== "All" ? filterType : undefined,
      eligible_only: showEligible,
    }),
  });

  // Fetch saved jobs
  const { data: savedData } = useQuery({
    queryKey: ["saved-jobs"],
    queryFn: () => jobsService.getSaved(),
  });

  // Fetch applied jobs
  const { data: appliedData } = useQuery({
    queryKey: ["applications"],
    queryFn: () => jobsService.getApplied(),
  });

  // Mutations
  const saveMutation = useMutation({
    mutationFn: jobsService.save,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved-jobs"] }),
  });

  const unsaveMutation = useMutation({
    mutationFn: jobsService.unsave,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved-jobs"] }),
  });

  const applyMutation = useMutation({
    mutationFn: jobsService.apply,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applications"] }),
  });

  const jobs = jobsData?.data?.data || [];
  const savedJobs = new Set((savedData?.data || []).map((j: Job) => j.id));
  const appliedJobs = new Set((appliedData?.data || []).map((j: Job) => j.id));

  const filtered = jobs;

  return (
    <div className="su flex gap-5 h-full" style={{ minHeight: 0 }}>
      {/* Filters */}
      <div className="w-64 flex-shrink-0">
        <Card className="p-4 sticky top-0">
          <p className="font-600 text-sm mb-4" style={{ fontWeight: 600 }}>Filters</p>
          <Input placeholder="Search jobs..." value={search} onChange={e => setSearch(e.target.value)} prefix={Search} />
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-500 mb-2">Job Type</p>
            {["All", "Full-time", "Internship"].map(t => (
              <button key={t} onClick={() => setFilterType(t)}
                className="flex items-center gap-2 w-full py-1.5 text-sm hover:bg-gray-50 rounded-lg px-2 transition-colors"
                style={{ color: filterType === t ? P : "#6b7280", fontWeight: filterType === t ? 600 : 400 }}>
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: filterType === t ? P : "#d1d5db" }}>
                  {filterType === t && <div className="w-2 h-2 rounded-full" style={{ background: P }} />}
                </div>
                {t}
              </button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">Eligibility</p>
            <button onClick={() => setShowEligible(!showEligible)} className="flex items-center gap-2">
              <div className={`w-8 h-4 rounded-full transition-colors ${showEligible ? "bg-indigo-600" : "bg-gray-300"}`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${showEligible ? "translate-x-4" : "translate-x-0.5"} mt-0.5`} />
              </div>
              <span className="text-sm text-gray-600">Eligible only</span>
            </button>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" size="sm" className="flex-1 justify-center" onClick={() => { setSearch(""); setFilterType("All"); setShowEligible(false); }}>Reset</Button>
            <Button size="sm" className="flex-1 justify-center">Apply</Button>
          </div>
        </Card>
      </div>

      {/* Listings */}
      <div className="flex-1 min-w-0">
        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-white rounded-xl border border-gray-100 p-1.5 shadow-sm">
          {([["all", "All Jobs", filtered.length], ["applied", "Applied", appliedJobs.size], ["saved", "Saved", savedJobs.size]] as [string, string, number][]).map(([id, label, count]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: activeTab === id ? P : "transparent", color: activeTab === id ? "#fff" : "#6b7280" }}>
              {label} ({count})
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-500">Showing <strong>{filtered.length}</strong> jobs</p>
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none" style={{ color: "#374151" }}>
            <option>Newest first</option><option>CTC: High to Low</option><option>Deadline</option>
          </select>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </Card>
            ))}
          </div>
        ) : (
        <div className="space-y-3">
          {filtered.map((j: Job) => (
            <Card key={j.id} className={`p-4 cursor-pointer transition-all duration-200 ${selectedJob?.id === j.id ? "ring-2" : "hover:shadow-md"}`}
              style={{ "--tw-ring-color": P, borderColor: selectedJob?.id === j.id ? P : undefined } as React.CSSProperties & { [key: string]: any }}
              onClick={() => setSelectedJob(selectedJob?.id === j.id ? null : j)}>
              <div className="flex items-start gap-4">
                <LogoCircle letter={j.company?.name?.[0] || "J"} color={j.company?.color || "#4f46e5"} size={46} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-600 text-gray-900" style={{ fontWeight: 600 }}>{j.title}</p>
                      <p className="text-sm text-gray-500">{j.company?.name} · <MapPin size={11} className="inline" /> {j.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={e => { e.stopPropagation(); savedJobs.has(j.id) ? unsaveMutation.mutate(j.id) : saveMutation.mutate(j.id); }}>
                        <Bookmark size={16} style={{ color: savedJobs.has(j.id) ? P : "#9ca3af", fill: savedJobs.has(j.id) ? P : "none" }} />
                      </button>
                      {true ? <CheckCircle size={16} className="text-emerald-500" /> : <Lock size={16} className="text-red-400" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="font-600 text-sm" style={{ fontWeight: 600, color: P }}>{j.ctc}</span>
                    <Badge label={j.type.replace("_", " ")} />
                    <span className="text-xs text-red-500 flex items-center gap-1"><Clock size={11} /> Closes soon</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    {j.skills?.slice(0, 4).map(s => <span key={s} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">{s}</span>)}
                  </div>
                </div>
              </div>

              {/* Expanded detail */}
              {selectedJob?.id === j.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 fi">
                  <p className="text-sm text-gray-600 mb-4">{j.description}</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[["Min CGPA", j.minCgpa || "N/A"],
                      ["Branches", j.branches?.join(", ") || "All"], ["Package", j.ctc], ["Location", j.location]].map(([k, v]) => (
                      <div key={k}>
                        <p className="text-xs text-gray-400">{k}</p>
                        <p className="text-sm font-medium text-gray-800">{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {appliedJobs.has(j.id) ? (
                      <Button variant="secondary" className="flex-1 justify-center" disabled icon={CheckCircle}>Applied</Button>
                    ) : (
                      <Button className="flex-1 justify-center" onClick={(e: React.MouseEvent) => { e.stopPropagation(); applyMutation.mutate(j.id); }}>
                        Apply Now
                      </Button>
                    )}
                    <Button variant="secondary" size="md">Add to Calendar</Button>
                    <Button variant="secondary" size="md">Share</Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}

export default JobsPage;