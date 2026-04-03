"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, Search, ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { navStudent, navRecruiter, navAdmin, NOTIFS, P } from "@/lib/constants";
import { useAuthStore } from "@/store/auth.store";

type TopNavProps = {
  page: string;
  role: string;
  setPage: (page: string) => void;
  showNotifs: boolean;
  setShowNotifs: (show: boolean) => void;
};

export function TopNav({ page, role, setPage, showNotifs, setShowNotifs }: TopNavProps) {
  const [search, setSearch] = useState("");
  const nav = role === "recruiter" ? navRecruiter : role === "admin" ? navAdmin : navStudent;
  const user = useAuthStore((state) => state.user);
  const pageTitles: { [key: string]: string } = {
    dashboard: "Dashboard", profile: "My Profile", resume: "My Resume", jobs: "Jobs & Placements",
    applications: "My Applications", calendar: "Placement Calendar", chat: "Chat", meetings: "Meetings",
    tests: "Coding Tests", practice: "Practice Arena", "mock-interview": "AI Mock Interview", network: "Referrals & Network",
    notifications: "Notifications", settings: "Settings", "rec-dashboard": "Recruiter Dashboard",
    "rec-company": "Company Profile", "rec-post": "Post a Job", "rec-drives": "Manage Drives",
    "rec-candidates": "Candidates", "rec-tests": "Create Test", "rec-analytics": "Analytics",
    "admin-dashboard": "Admin Dashboard", "admin-users": "Users", "admin-companies": "Companies",
    "admin-drives": "All Drives", "admin-applications": "All Applications", "admin-analytics": "Analytics & Reports", "admin-settings": "System Settings",
    "resume-editor": "Resume Editor",
  };

  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-100 px-6" style={{ height: 60, flexShrink: 0 }}>
      <h1 className="font-600 text-gray-900" style={{ fontWeight: 600, fontSize: 18 }}>
        {pageTitles[page] || page}
      </h1>
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs, candidates..."
            className="pl-8 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 w-52 bg-gray-50"
            style={{ "--tw-ring-color": "#4f46e5" } as React.CSSProperties & { [key: string]: any }} />
        </div>
        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotifs(!showNotifs)}
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 fi" style={{ maxHeight: 400, overflowY: "auto" }}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-600 text-sm" style={{ fontWeight: 600 }}>Notifications</span>
                <button className="text-xs" style={{ color: P }}>Mark all read</button>
              </div>
              {NOTIFS.slice(0, 4).map(n => (
                <div key={n.id} className="flex gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50"
                  style={{ borderLeft: n.unread ? `3px solid ${P}` : "3px solid transparent" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: n.color + "20" }}>
                    <n.icon size={14} style={{ color: n.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-500 truncate">{n.msg}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
              <button onClick={() => { setPage("notifications"); setShowNotifs(false); }}
                className="w-full text-center py-3 text-xs font-medium" style={{ color: P }}>
                View all notifications →
              </button>
            </div>
          )}
        </div>
        {/* Avatar */}
        <Link href="/profile" className="flex items-center gap-2 cursor-pointer group">
          <Avatar name={user?.name || "User"} size={32} />
          <div className="hidden md:block">
            <p className="text-xs font-600" style={{ fontWeight: 600, lineHeight: 1.2 }}>{user?.name || "User"}</p>
            <p className="text-xs text-gray-400 capitalize">{role}</p>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </Link>
      </div>
    </div>
  );
}
