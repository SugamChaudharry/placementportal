import React, { useState } from "react";
import {
  Search, Download, Eye, ChevronDown, Check, Video, Code2, MessageSquare,
  GraduationCap, Building2, Shield, Mail, Lock as LockIcon, User
} from "lucide-react";

// ─── Temporary Shared Components ─────────────────────────────────────────────
const P = "#4f46e5";

const Card = ({ children, className = "", ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

const Input = ({ placeholder, value, onChange, prefix: Prefix, className = "", ...props }: {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: React.ComponentType<any>;
  className?: string;
  [key: string]: any;
}) => (
  <div className={`flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 ${className}`}>
    {Prefix && <Prefix size={16} className="text-gray-400" />}
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="flex-1 outline-none text-sm"
      {...props}
    />
  </div>
);

const Btn = ({ children, icon: Icon, variant = "primary", size = "md", className = "", ...props }: {
  children: React.ReactNode;
  icon?: React.ComponentType<any>;
  variant?: "primary" | "secondary" | "success" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  [key: string]: any;
}) => {
  const baseClasses = "inline-flex items-center gap-2 rounded-lg font-medium transition-all focus:outline-none disabled:opacity-50";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    success: "bg-green-600 text-white hover:bg-green-700",
    ghost: "text-gray-600 hover:bg-gray-100"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {Icon && <Icon size={size === "sm" ? 14 : size === "md" ? 16 : 18} />}
      {children}
    </button>
  );
};

const LogoCircle = ({ letter, color, size }: { letter: string; color: string; size: number }) => (
  <div
    className="rounded-full flex items-center justify-center text-white font-bold"
    style={{ width: size, height: size, background: color, fontSize: size * 0.4 }}
  >
    {letter}
  </div>
);

const Bdg = ({ label }: { label: string }) => {
  const colors: { [key: string]: string } = {
    "Applied": "#3b82f6",
    "Shortlisted": "#f59e0b",
    "Test Scheduled": "#8b5cf6",
    "Interview Scheduled": "#10b981",
    "Offered": "#059669",
    "Rejected": "#ef4444"
  };
  return (
    <span
      className="px-2 py-1 rounded-full text-xs font-medium text-white"
      style={{ background: colors[label] || "#6b7280" }}
    >
      {label}
    </span>
  );
};

// ─── Mock Data ──────────────────────────────────────────────────────────────
const APPS = [
  { id: 1, company: "Google", role: "SDE-1", logo: "G", color: "#4285F4", date: "Jan 15", updated: "2 days ago", status: "Interview Scheduled", drive: "Winter 2025" },
  { id: 2, company: "Microsoft", role: "Software Engineer", logo: "M", color: "#00A4EF", date: "Jan 12", updated: "5 days ago", status: "Test Scheduled", drive: "Winter 2025" },
  { id: 3, company: "Amazon", role: "SDE-2", logo: "A", color: "#FF9900", date: "Jan 10", updated: "1 week ago", status: "Shortlisted", drive: "Winter 2025" },
  { id: 4, company: "Flipkart", role: "Backend Developer", logo: "F", color: "#2874F0", date: "Jan 8", updated: "1 week ago", status: "Applied", drive: "Winter 2025" },
  { id: 5, company: "Paytm", role: "Full Stack Developer", logo: "P", color: "#00BAF2", date: "Jan 5", updated: "2 weeks ago", status: "Rejected", drive: "Winter 2025" }
];

// ─── ApplicationsPage Component ─────────────────────────────────────────────
function ApplicationsPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Applied", "Shortlisted", "Test Scheduled", "Interview Scheduled", "Offered", "Rejected"];
  const steps = ["Applied", "Shortlisted", "Test Scheduled", "Test Completed", "Interview Scheduled", "Interview Completed", "Offered"];

  const filtered = filter === "All" ? APPS : APPS.filter(a => a.status === filter);

  return (
    <div className="su">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{ background: filter === s ? P : "#f1f5f9", color: filter === s ? "#fff" : "#6b7280" }}>
            {s}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <Input placeholder="Search..." prefix={Search} className="w-40" />
          <Btn variant="secondary" size="sm" icon={Download}>Export</Btn>
        </div>
      </div>

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Company", "Role", "Drive", "Applied On", "Last Updated", "Status", "Actions"].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <>
                <tr key={a.id} className={`border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${expanded === a.id ? "bg-indigo-50" : ""}`}
                  onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <LogoCircle letter={a.logo} color={a.color} size={30} />
                      <span className="font-medium text-gray-800">{a.company}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{a.role}</td>
                  <td className="py-3 px-4 text-gray-500">{a.drive}</td>
                  <td className="py-3 px-4 text-gray-500">{a.date}</td>
                  <td className="py-3 px-4 text-gray-400">{a.updated}</td>
                  <td className="py-3 px-4"><Bdg label={a.status} /></td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <Btn size="sm" variant="ghost" icon={Eye}>View</Btn>
                      <ChevronDown size={14} className="text-gray-400 self-center" style={{ transform: expanded === a.id ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                    </div>
                  </td>
                </tr>
                {expanded === a.id && (
                  <tr key={`exp-${a.id}`}>
                    <td colSpan={7} className="px-6 py-5 bg-indigo-50 border-b border-indigo-100">
                      <div className="fi">
                        <p className="text-xs font-medium text-gray-500 mb-3">APPLICATION TIMELINE</p>
                        <div className="flex items-center gap-0 mb-5 overflow-x-auto">
                          {steps.map((s, i) => {
                            const stepIdx = steps.indexOf(a.status);
                            const done = i <= stepIdx;
                            const active = i === stepIdx;
                            return (
                              <div key={s} className="flex items-center">
                                <div className="flex flex-col items-center">
                                  <div className="w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all"
                                    style={{ borderColor: done ? P : "#d1d5db", background: done ? P : "#fff" }}>
                                    {done ? <Check size={13} className="text-white" /> : <span className="text-xs text-gray-400">{i + 1}</span>}
                                  </div>
                                  <p className="text-xs mt-1 whitespace-nowrap" style={{ color: active ? P : "#9ca3af", fontWeight: active ? 600 : 400, fontSize: 10 }}>{s}</p>
                                </div>
                                {i < steps.length - 1 && (
                                  <div className="h-0.5 w-10 mx-1 mb-4" style={{ background: i < stepIdx ? P : "#e5e7eb" }} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex gap-3 flex-wrap">
                          {a.status === "Interview Scheduled" && <Btn icon={Video}>Join Meeting</Btn>}
                          {a.status === "Test Scheduled" && <Btn icon={Code2}>Take Test</Btn>}
                          {a.status === "Offered" && <Btn icon={Download} variant="success">Download Offer Letter</Btn>}
                          {a.status === "Rejected" && <Btn variant="secondary" icon={MessageSquare}>Request Feedback</Btn>}
                          <Btn variant="secondary" icon={Eye}>View Resume Submitted</Btn>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default ApplicationsPage;