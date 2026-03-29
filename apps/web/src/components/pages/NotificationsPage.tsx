"use client";
import { useState } from "react";

// Temporary component definitions (to be moved to shared files later)
const P = "#4f46e5";
const Card = ({ children, className = "", ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <div className={`bg-white rounded-xl border border-gray-100 shadow-sm ${className}`} {...props}>{children}</div>
);
type BtnVariant = "primary" | "secondary" | "ghost";
type BtnSize = "sm" | "md" | "lg";
const Btn = ({ children, variant = "primary", size = "md", icon: Icon, className = "", ...props }: {
  children: React.ReactNode;
  variant?: BtnVariant;
  size?: BtnSize;
  icon?: React.ComponentType<any>;
  className?: string;
  [key: string]: any;
}) => {
  const baseClasses = "inline-flex items-center gap-2 font-medium rounded-lg transition-colors focus:outline-none";
  const variantClasses = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    ghost: "text-indigo-600 hover:bg-indigo-50"
  };
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
};

// Mock data (to be moved to shared files later)
const NOTIFS = [
  { id: 1, type: "interview", icon: ({ size, style }: { size?: number; style?: React.CSSProperties }) => <div style={{ fontSize: size, ...style }}>📹</div>, color: "#7c3aed", title: "Interview Scheduled", msg: "Google SDE interview confirmed for Feb 5 at 10:00 AM", time: "2h ago", unread: true, action: "Join Meeting" },
  { id: 2, type: "test", icon: ({ size, style }: { size?: number; style?: React.CSSProperties }) => <div style={{ fontSize: size, ...style }}>💻</div>, color: "#f59e0b", title: "Test Reminder", msg: "Microsoft SDE-2 coding test starts in 2 hours", time: "4h ago", unread: true, action: "View Test" },
  { id: 3, type: "shortlist", icon: ({ size, style }: { size?: number; style?: React.CSSProperties }) => <div style={{ fontSize: size, ...style }}>✅</div>, color: "#10b981", title: "Shortlisted!", msg: "You've been shortlisted for Flipkart Data Analyst drive", time: "1d ago", unread: true, action: "View Details" },
  { id: 4, type: "offer", icon: ({ size, style }: { size?: number; style?: React.CSSProperties }) => <div style={{ fontSize: size, ...style }}>🏆</div>, color: "#4f46e5", title: "Offer Received 🎉", msg: "Groww has extended a full-time offer for Backend Engineer", time: "3d ago", unread: false, action: "View Offer" },
  { id: 5, type: "system", icon: ({ size, style }: { size?: number; style?: React.CSSProperties }) => <div style={{ fontSize: size, ...style }}>ℹ️</div>, color: "#3b82f6", title: "Profile 80% Complete", msg: "Add 2 more projects to complete your profile and boost ATS score", time: "5d ago", unread: false, action: null },
  { id: 6, type: "chat", icon: ({ size, style }: { size?: number; style?: React.CSSProperties }) => <div style={{ fontSize: size, ...style }}>💬</div>, color: "#6366f1", title: "New Message", msg: "Recruiter from Amazon: 'Your profile looks strong! Can you...'", time: "1w ago", unread: false, action: "Reply" },
];

function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Unread", "Applications", "Tests", "Interviews", "System"];
  const [notifs, setNotifs] = useState(NOTIFS);

  return (
    <div className="su max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{ background: filter === f ? P : "#f1f5f9", color: filter === f ? "#fff" : "#6b7280" }}>
              {f}
            </button>
          ))}
        </div>
        <Btn variant="secondary" size="sm" onClick={() => setNotifs(n => n.map(x => ({ ...x, unread: false })))}>
          Mark all read
        </Btn>
      </div>
      <Card>
        {notifs.map((n, i) => (
          <div key={n.id} onClick={() => setNotifs(ns => ns.map(x => x.id === n.id ? { ...x, unread: false } : x))}
            className="flex gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
            style={{ borderLeft: n.unread ? `4px solid ${P}` : "4px solid transparent" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: n.color + "20" }}>
              <n.icon size={18} style={{ color: n.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-600 text-sm text-gray-900" style={{ fontWeight: n.unread ? 600 : 500 }}>{n.title}</p>
                <span className="text-xs text-gray-400 flex-shrink-0">{n.time}</span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{n.msg}</p>
              {n.action && (
                <button className="mt-2 text-xs font-medium" style={{ color: P }}>{n.action} →</button>
              )}
            </div>
            {n.unread && <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: P }} />}
          </div>
        ))}
      </Card>
    </div>
  );
}

export default NotificationsPage;