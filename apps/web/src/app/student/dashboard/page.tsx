"use client";
import { useAuth } from "@/hooks/useAuth";
import { useApplications } from "@/hooks/useApplications";
import { useJobs } from "@/hooks/useJobs";
import { AppShell } from "@/components/layout/AppShell";
import { TrendingUp, Briefcase, FileText, Award } from "lucide-react";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Applied:              { bg: "#f1f5f9", text: "#64748b" },
  Shortlisted:          { bg: "#dbeafe", text: "#1d4ed8" },
  "Test Scheduled":     { bg: "#fef3c7", text: "#92400e" },
  "Test Completed":     { bg: "#e0e7ff", text: "#4338ca" },
  "Interview Scheduled":{ bg: "#f3e8ff", text: "#7c3aed" },
  Offered:              { bg: "#d1fae5", text: "#065f46" },
  Rejected:             { bg: "#fee2e2", text: "#991b1b" },
};

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { data: appsData, isLoading: appsLoading } = useApplications();
  const { data: jobsData } = useJobs();

  const apps = appsData?.data ?? [];
  const jobs = jobsData?.data ?? [];

  return (
    <AppShell>
      <div className="space-y-6 slide-up">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good morning, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Applications", value: apps.length, icon: Briefcase, color: "indigo" },
            { label: "Tests taken", value: 3, icon: FileText, color: "blue" },
            { label: "Interviews", value: 1, icon: TrendingUp, color: "purple" },
            { label: "Offers", value: 1, icon: Award, color: "emerald" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className={`w-9 h-9 bg-${color}-50 rounded-lg flex items-center justify-center mb-3`}>
                <Icon size={18} className={`text-${color}-600`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Applications table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Recent applications</h2>
            <a href="/student/applications" className="text-sm text-indigo-600 hover:underline">View all</a>
          </div>
          {appsLoading ? (
            <div className="p-5 space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
            </div>
          ) : apps.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No applications yet. <a href="/student/jobs" className="text-indigo-600">Browse jobs</a></div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="text-xs text-gray-500 border-b border-gray-50">
                <th className="text-left px-5 py-3 font-medium">Company</th>
                <th className="text-left px-5 py-3 font-medium">Role</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Updated</th>
              </tr></thead>
              <tbody>
                {apps.slice(0, 5).map((app: any) => {
                  const s = STATUS_COLORS[app.status] ?? STATUS_COLORS["Applied"];
                  return (
                    <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900">{app.job?.company}</td>
                      <td className="px-5 py-3 text-gray-600">{app.job?.role}</td>
                      <td className="px-5 py-3">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.text }}>{app.status}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-400">{app.updatedAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppShell>
  );
}
