"use client";
import { useState } from "react";
import { Search, Filter, Bookmark, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useJobs } from "@/hooks/useJobs";
import { useApply } from "@/hooks/useApplications";
import type { Job } from "@portal/types";

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("All");
  const { data, isLoading } = useJobs();
  const applyMutation = useApply();

  const jobs: Job[] = data?.data ?? [];
  const filtered = jobs.filter(j =>
    (type === "All" || j.type === type) &&
    (j.role.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AppShell>
      <div className="space-y-5 slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Jobs & Placements</h1>
            <p className="text-sm text-gray-500 mt-0.5">{data?.total ?? 0} opportunities available</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          {["All", "Full-time", "Internship"].map(t => (
            <button key={t} onClick={() => setType(t)}
              className={"px-3 py-2 text-sm rounded-lg transition-colors " + (type === t ? "bg-indigo-600 text-white" : "border border-gray-300 text-gray-600 hover:bg-gray-50")}>
              {t}
            </button>
          ))}
        </div>

        {/* Job cards */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 h-28 animate-pulse" />
            ))
          ) : filtered.map((job) => (
            <div key={job.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:border-indigo-200 transition-colors card-hover">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: job.companyColor }}>
                {job.company[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{job.role}</h3>
                  {!job.eligibility || true ? null :
                    <span className="text-xs text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Ineligible</span>}
                </div>
                <p className="text-sm text-gray-500">{job.company} · {job.location}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-emerald-600 font-medium">{job.ctc}</span>
                  <span className="text-xs text-gray-400">Closes {job.deadline}</span>
                  {job.skills.slice(0, 3).map((s: string) => (
                    <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                  <Bookmark size={16} className="text-gray-400" />
                </button>
                <button
                  onClick={() => applyMutation.mutate(job.id)}
                  disabled={applyMutation.isPending}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60">
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
