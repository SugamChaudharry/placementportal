"use client";

import React from "react";
import { Briefcase, Users, Video, Award, ArrowRight, Plus, Code2, Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { ColorBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { P, INDIGO_SHADES } from "@/lib/constants";

type RecruiterDashboardProps = {
  setPage: (page: string) => void;
};

export default function RecruiterDashboard({ setPage }: RecruiterDashboardProps) {
  const drives = [
    { name: "SDE-2 2025 Batch", applicants: 234, shortlisted: 45, status: "Active", next: "Interviews: Feb 5–8", color: "#4f46e5" },
    { name: "Data Analyst Summer", applicants: 89, shortlisted: 18, status: "Active", next: "Test closes: Feb 10", color: "#0891b2" },
    { name: "Product Intern 2025", applicants: 156, shortlisted: 0, status: "Draft", next: "Publish to start", color: "#f59e0b" },
  ];

  const funnel = [
    { stage: "Applied", count: 234 }, { stage: "Shortlisted", count: 89 }, { stage: "Test Sent", count: 65 },
    { stage: "Interview", count: 28 }, { stage: "Offered", count: 8 },
  ];

  return (
    <div className="su space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Briefcase} value="3" label="Active Drives" color="#4f46e5" trend={0} />
        <StatCard icon={Users} value="479" label="Total Applicants" sub="across all drives" color="#0891b2" trend={12} />
        <StatCard icon={Video} value="8" label="Interviews Today" sub="next at 10:00 AM" color="#7c3aed" />
        <StatCard icon={Award} value="8" label="Offers Extended" sub="2 accepted" color="#059669" trend={33} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <SectionHeader title="Active Drives" action={() => setPage("rec-drives")} actionLabel="Manage drives" />
          <div className="space-y-3">
            {drives.map((d, i) => (
              <Card key={i} className="p-4 hl cursor-pointer" onClick={() => setPage("rec-drives")}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                  <p className="font-600 text-sm" style={{ fontWeight: 600 }}>{d.name}</p>
                  <ColorBadge label={d.status} color={d.status === "Active" ? "#10b981" : "#f59e0b"} />
                  <span className="ml-auto text-xs text-gray-500">{d.next}</span>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <div><p className="text-lg font-700" style={{ fontWeight: 700 }}>{d.applicants}</p><p className="text-xs text-gray-400">Applicants</p></div>
                  <ArrowRight size={14} className="text-gray-300" />
                  <div><p className="text-lg font-700" style={{ fontWeight: 700 }}>{d.shortlisted}</p><p className="text-xs text-gray-400">Shortlisted</p></div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(d.shortlisted / d.applicants) * 100}%`, background: d.color }} />
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <SectionHeader title="Today's Interviews" />
            <div className="space-y-3">
              {[["Arjun Kumar", "10:00 AM", "#4285F4"], ["Priya Sharma", "11:30 AM", "#7c3aed"], ["Rahul Singh", "2:00 PM", "#0891b2"]].map(([name, time, color]) => (
                <div key={name} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <Avatar name={name} size={32} color={color} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{name}</p>
                    <p className="text-xs text-gray-400">{time}</p>
                  </div>
                  <Button size="sm" icon={Video}>Join</Button>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <p className="font-600 text-sm mb-3" style={{ fontWeight: 600 }}>Quick Actions</p>
            <div className="space-y-2">
              {([
                ["Post New Job", Plus, "#4f46e5", "rec-post"],
                ["Create Test", Code2, "#7c3aed", "rec-tests"],
                ["Schedule Interviews", Calendar, "#0891b2", "rec-drives"]
              ] as [string, React.ComponentType<{size?: number; style?: React.CSSProperties}>, string, string][]).map(([l, IconComponent, c, pg], idx) => (
                <button key={idx} onClick={() => setPage(pg)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-left">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: c + "20" }}>
                    <IconComponent size={15} style={{ color: c }} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{l}</span>
                  <ArrowRight size={14} className="ml-auto text-gray-400" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-5">
        <SectionHeader title="Candidate Pipeline Funnel" />
        <div className="flex items-end gap-3 h-32">
          {funnel.map((f, i) => (
            <div key={f.stage} className="flex-1 flex flex-col items-center gap-2">
              <p className="text-sm font-700" style={{ fontWeight: 700 }}>{f.count}</p>
              <div className="w-full rounded-t-lg" style={{ height: `${(f.count / 234) * 100}%`, background: INDIGO_SHADES[i], minHeight: 8 }} />
              <p className="text-xs text-gray-500 text-center">{f.stage}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
