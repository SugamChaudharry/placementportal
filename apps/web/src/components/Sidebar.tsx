"use client";

import React from "react";
import { LogOut, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { navStudent, navRecruiter, navAdmin, P } from "@/lib/constants";
import { useAuthStore } from "@/store/auth.store";

type SidebarProps = {
  role: string;
  setRole: (role: string) => void;
  page: string;
  setPage: (page: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

export function Sidebar({ role, setRole, page, setPage, collapsed, setCollapsed }: SidebarProps) {
  const logout = useAuthStore((state) => state.logout);
  const nav = role === "recruiter" ? navRecruiter : role === "admin" ? navAdmin : navStudent;
  return (
    <div className="sb flex flex-col h-full transition-all duration-300" style={{ width: collapsed ? 64 : 240 }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: "rgba(255,255,255,.08)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
          <GraduationCap size={16} className="text-white" />
        </div>
        {!collapsed && <span className="font-700 text-white" style={{ fontWeight: 700, fontSize: 15 }}>PlaceMe</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-gray-500 hover:text-gray-300 flex-shrink-0">
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 py-3">
          <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize"
            style={{ background: "rgba(79,70,229,.25)", color: "#a5b4fc" }}>
            {role} view
          </span>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {nav.map(({ id, label, icon: Icon }) => {
          const active = page === id;
          return (
            <button key={id} onClick={() => setPage(id)}
              className="w-full flex items-center gap-3 rounded-lg transition-all duration-150 text-left sidebar-item"
              style={{
                padding: collapsed ? "9px" : "8px 10px",
                justifyContent: collapsed ? "center" : "flex-start",
                background: active ? "rgba(79,70,229,.35)" : "transparent",
                color: active ? "#fff" : "#94a3b8",
                borderLeft: active ? `3px solid ${P}` : "3px solid transparent",
              }}
              title={collapsed ? label : undefined}>
              <Icon size={17} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ fontSize: 13.5, fontWeight: active ? 600 : 400 }}>{label}</span>}
              {!collapsed && id === "notifications" && (
                <span className="ml-auto text-white rounded-full px-1.5 text-xs" style={{ background: "#ef4444", fontSize: 10 }}>3</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Demo role switcher */}
      {!collapsed && (
        <div className="px-3 py-3 border-t" style={{ borderColor: "rgba(255,255,255,.08)" }}>
          <p className="text-xs text-gray-600 mb-2">Switch Role (Demo)</p>
          <div className="flex gap-1">
            {["student","recruiter","admin"].map(r => (
              <button key={r} onClick={() => {
                setRole(r);
                setPage(r === "student" ? "dashboard" : r === "recruiter" ? "rec-dashboard" : "admin-dashboard");
              }}
                className="flex-1 text-xs py-1 rounded-md capitalize transition-all"
                style={{ background: role === r ? P : "rgba(255,255,255,.08)", color: role === r ? "#fff" : "#94a3b8", fontWeight: role === r ? 600 : 400 }}>
                {r.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sign out */}
      <button onClick={logout} className="flex items-center gap-3 px-4 py-4 text-gray-500 hover:text-red-400 transition-colors border-t"
        style={{ borderColor: "rgba(255,255,255,.08)", justifyContent: collapsed ? "center" : "flex-start" }}>
        <LogOut size={16} />
        {!collapsed && <span style={{ fontSize: 13 }}>Sign out</span>}
      </button>
    </div>
  );
}
