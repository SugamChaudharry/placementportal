"use client";

import { useState } from "react";
import {
  CheckCircle,
  Code2,
  Download,
  Eye,
  MoreHorizontal,
  Plus,
  Sparkles,
  Video,
  XCircle,
} from "lucide-react";
import { Av, Bdg, Btn, Card } from "@/placement-portal/components/atoms";
import { PRIMARY } from "@/placement-portal/constants";

export function ManageDrivePage() {
  const [tab, setTab] = useState("candidates");
  const tabs = ["Overview", "Candidates", "Shortlisting", "Test", "Interviews", "Offers"];
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const candidates = [
    { name: "Arjun Kumar", roll: "20CS101", branch: "CSE", cgpa: 8.9, applied: "Jan 20", status: "Interview Scheduled", logo: "AK", color: "#4f46e5" },
    { name: "Priya Sharma", roll: "20CS045", branch: "CSE", cgpa: 9.2, applied: "Jan 18", status: "Test Completed", logo: "PS", color: "#7c3aed" },
    { name: "Rahul Singh", roll: "20IT023", branch: "IT", cgpa: 8.4, applied: "Jan 22", status: "Shortlisted", logo: "RS", color: "#0891b2" },
    { name: "Ananya Verma", roll: "20CS089", branch: "CSE", cgpa: 9.5, applied: "Jan 15", status: "Interview Scheduled", logo: "AV", color: "#059669" },
    { name: "Vikram Patel", roll: "20ME101", branch: "ME", cgpa: 7.8, applied: "Jan 25", status: "Applied", logo: "VP", color: "#f59e0b" },
  ];

  return (
    <div className="su">
      <div className="flex items-center gap-3 mb-4">
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Microsoft SDE-2 2025</h2>
          <p className="text-sm text-gray-500">234 applicants · Active</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Btn variant="secondary" size="sm" icon={Download}>
            Export
          </Btn>
          <Btn size="sm" icon={Plus}>
            Add Candidate
          </Btn>
        </div>
      </div>

      <div className="flex gap-0 border-b border-gray-200 mb-5 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t.toLowerCase())}
            className="px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all"
            style={{ borderColor: tab === t.toLowerCase() ? PRIMARY : "transparent", color: tab === t.toLowerCase() ? PRIMARY : "#6b7280" }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
          {[
            ["Applied", "234"],
            ["Shortlisted", "89"],
            ["Tests Sent", "65"],
            ["Interviews Done", "28"],
            ["Offers", "8"],
          ].map(([l, v]) => (
            <Card key={l} className="p-4">
              <p className="text-2xl font-700" style={{ fontWeight: 700 }}>
                {v}
              </p>
              <p className="text-xs text-gray-500">{l}</p>
            </Card>
          ))}
        </div>
      )}

      {tab === "candidates" && (
        <>
          {selected.size > 0 && (
            <div className="flex items-center gap-2 mb-3 p-3 rounded-xl" style={{ background: "#eef2ff" }}>
              <span className="text-sm font-medium" style={{ color: PRIMARY }}>
                {selected.size} selected
              </span>
              <Btn size="sm" icon={CheckCircle}>
                Shortlist
              </Btn>
              <Btn size="sm" variant="secondary" icon={Code2}>
                Assign Test
              </Btn>
              <Btn size="sm" variant="secondary" icon={Video}>
                Schedule Interview
              </Btn>
              <Btn size="sm" variant="danger" icon={XCircle}>
                Reject
              </Btn>
            </div>
          )}
          <Card>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 pl-4">
                    <input
                      type="checkbox"
                      className="rounded"
                      onChange={(e) => setSelected(e.target.checked ? new Set(candidates.map((c) => c.roll)) : new Set())}
                    />
                  </th>
                  {["Candidate", "Roll No.", "Branch", "CGPA", "Applied", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left py-3 px-3 text-xs font-medium text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {candidates.map((c) => (
                  <tr key={c.roll} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="pl-4">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selected.has(c.roll)}
                        onChange={(e) =>
                          setSelected((s) => {
                            const n = new Set(s);
                            e.target.checked ? n.add(c.roll) : n.delete(c.roll);
                            return n;
                          })
                        }
                      />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <Av name={c.name} size={30} color={c.color} />
                        <span className="font-medium text-gray-800">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-500">{c.roll}</td>
                    <td className="py-3 px-3 text-gray-600">{c.branch}</td>
                    <td className="py-3 px-3 font-medium" style={{ color: c.cgpa >= 8.5 ? "#10b981" : c.cgpa >= 7.5 ? "#f59e0b" : "#ef4444" }}>
                      {c.cgpa}
                    </td>
                    <td className="py-3 px-3 text-gray-500">{c.applied}</td>
                    <td className="py-3 px-3">
                      <Bdg label={c.status} />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1">
                        <Btn size="sm" variant="ghost" icon={Eye}>
                          View
                        </Btn>
                        <Btn size="sm" variant="ghost" icon={MoreHorizontal} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      {tab === "shortlisting" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="p-5">
            <p className="font-600 mb-4" style={{ fontWeight: 600 }}>
              AI Shortlisting Weights
            </p>
            <div className="space-y-4">
              {[
                ["CGPA", 40],
                ["Skills Match", 35],
                ["Projects", 25],
              ].map(([label, val]) => (
                <div key={label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-gray-700">{label}</span>
                    <span className="text-sm font-600" style={{ fontWeight: 600, color: PRIMARY }}>
                      {val}%
                    </span>
                  </div>
                  <input type="range" defaultValue={val} className="w-full" style={{ accentColor: PRIMARY }} />
                </div>
              ))}
              <Btn className="w-full justify-center" icon={Sparkles}>
                Auto-shortlist Top 50
              </Btn>
            </div>
          </Card>
          <Card className="p-5">
            <p className="font-600 mb-3" style={{ fontWeight: 600 }}>
              AI Ranking Preview
            </p>
            <div className="space-y-2">
              {[...candidates]
                .sort((a, b) => b.cgpa - a.cgpa)
                .map((c, i) => (
                  <div key={c.roll} className="flex items-center gap-3 p-2 rounded-lg border border-gray-100">
                    <span className="w-6 text-center text-xs font-medium text-gray-400">#{i + 1}</span>
                    <Av name={c.name} size={28} color={c.color} />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-800">{c.name}</p>
                      <p className="text-xs text-gray-400">CGPA: {c.cgpa}</p>
                    </div>
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(c.cgpa / 10) * 100}%`, background: PRIMARY }} />
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "interviews" && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-600" style={{ fontWeight: 600 }}>
              Interview Schedule
            </p>
            <Btn size="sm" icon={Plus}>
              Schedule Batch
            </Btn>
          </div>
          <div className="space-y-3">
            {(
              [
                ["Arjun Kumar", "Feb 5 · 10:00 AM", "60 min", "Priya Nair", true],
                ["Ananya Verma", "Feb 5 · 11:30 AM", "60 min", "Rohit Kumar", true],
                ["Priya Sharma", "Feb 6 · 2:00 PM", "60 min", "Priya Nair", false],
              ] as const
            ).map(([cand, time, dur, inter, live]) => (
              <div key={cand} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
                <Av name={cand} size={36} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{cand}</p>
                  <p className="text-xs text-gray-500">
                    {time} · {dur} · Interviewer: {inter}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: live ? "#d1fae5" : "#eef2ff", color: live ? "#065f46" : PRIMARY }}>
                  {live ? "Live" : "Scheduled"}
                </span>
                {live && (
                  <Btn size="sm" icon={Video}>
                    Join
                  </Btn>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
