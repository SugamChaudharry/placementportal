"use client";

import React from "react";
import { GraduationCap, Building2, Briefcase, Code2, Award, Activity, Plus, Bell, Building, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ColorBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { P } from "@/lib/constants";

type AdminDashboardProps = {
  setPage: (page: string) => void;
};

export default function AdminDashboard({ setPage }: AdminDashboardProps) {
  const health = [
    { label: "PostgreSQL", status: "healthy", val: "12ms" },
    { label: "Redis", status: "healthy", val: "2ms" },
    { label: "Job Queue", status: "warning", val: "14 pending" },
    { label: "Error Rate (24h)", status: "healthy", val: "0.02%" },
  ];

  return (
    <div className="su space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={GraduationCap} value="2,847" label="Total Students" sub="Active this year" trend={8} color="#4f46e5" />
        <StatCard icon={Building2} value="124" label="Recruiters" sub="38 companies" trend={15} color="#0891b2" />
        <StatCard icon={Briefcase} value="18" label="Active Drives" color="#7c3aed" />
        <StatCard icon={Code2} value="156" label="Tests Conducted" sub="this season" color="#f59e0b" />
        <StatCard icon={Award} value="312" label="Offers Made" sub="89% acceptance rate" trend={22} color="#059669" />
        <StatCard icon={Activity} value="99.98%" label="Platform Uptime" sub="last 30 days" color="#ef4444" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <SectionHeader title="Recent Registrations" action={() => setPage("admin-users")} actionLabel="Manage users" />
          <Card>
            {[["Arjun Kumar","CSE · IIT Bombay","Student","2m ago","#4f46e5"],
              ["TechCorp India","IT Recruiter","Recruiter","15m ago","#0891b2"],
              ["Priya Sharma","ECE · NIT Trichy","Student","1h ago","#7c3aed"],
              ["StartupXYZ","Startup Recruiter","Recruiter","3h ago","#059669"],
              ["Rahul Gupta","ME · BITS Pilani","Student","5h ago","#f59e0b"]].map(([name, sub, role, time, c]) => (
              <div key={name} className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <Avatar name={name} size={36} color={c} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{name}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
                <ColorBadge label={role} color={role === "Student" ? "#4f46e5" : "#0891b2"} />
                <span className="text-xs text-gray-400">{time}</span>
              </div>
            ))}
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <p className="font-600 text-sm mb-4" style={{ fontWeight: 600 }}>System Health</p>
            <div className="space-y-3">
              {health.map(h => (
                <div key={h.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: h.status === "healthy" ? "#10b981" : "#f59e0b" }} />
                    <span className="text-sm text-gray-700">{h.label}</span>
                  </div>
                  <span className="text-xs font-medium" style={{ color: h.status === "healthy" ? "#10b981" : "#f59e0b" }}>{h.val}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <p className="font-600 text-sm mb-3" style={{ fontWeight: 600 }}>Quick Actions</p>
            {([
              ["Add User", Plus, "#4f46e5", "admin-users"],
              ["Add Company", Building, "#0891b2", "admin-companies"],
              ["Broadcast Announcement", Bell, "#f59e0b", "notifications"]
            ] as [string, React.ComponentType<{size?: number; style?: React.CSSProperties}>, string, string][]).map(([l, IconComponent, c, pg], idx) => (
              <button key={idx} onClick={() => setPage(pg)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left mb-2 border border-gray-100">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: c + "20" }}>
                  <IconComponent size={15} style={{ color: c }} />
                </div>
                <span className="text-sm font-medium text-gray-700">{l}</span>
                <ArrowRight size={13} className="ml-auto text-gray-400" />
              </button>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
