import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  ClipboardList,
  Calendar,
  MessageSquare,
  Video,
  Code2,
  Trophy,
  Bell,
  Settings,
  Building2,
  Plus,
  Sliders,
  Users,
  BarChart as BarChartIcon,
  Brain,
  Network,
} from "lucide-react";

export const PRIMARY = "#4f46e5";

export const STATUSES: Record<string, { bg: string; text: string }> = {
  Applied: { bg: "#f1f5f9", text: "#64748b" },
  Shortlisted: { bg: "#dbeafe", text: "#1d4ed8" },
  "Test Scheduled": { bg: "#fef3c7", text: "#92400e" },
  "Test Completed": { bg: "#e0e7ff", text: "#4338ca" },
  "Interview Scheduled": { bg: "#f3e8ff", text: "#7c3aed" },
  Offered: { bg: "#d1fae5", text: "#065f46" },
  Rejected: { bg: "#fee2e2", text: "#991b1b" },
};

export type NavItem = { id: string; label: string; icon: LucideIcon };

export const navStudent: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "My Profile", icon: User },
  { id: "resume", label: "My Resume", icon: FileText },
  { id: "jobs", label: "Jobs & Placements", icon: Briefcase },
  { id: "applications", label: "My Applications", icon: ClipboardList },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "meetings", label: "Meetings", icon: Video },
  { id: "tests", label: "Coding Tests", icon: Code2 },
  { id: "practice", label: "Practice Arena", icon: Trophy },
  { id: "mock-interview", label: "AI Mock Interview", icon: Brain },
  { id: "network", label: "Referrals & Network", icon: Network },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

export const navRecruiter: NavItem[] = [
  { id: "rec-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "rec-company", label: "Company Profile", icon: Building2 },
  { id: "rec-post", label: "Post a Job / Drive", icon: Plus },
  { id: "rec-drives", label: "Manage Drives", icon: Sliders },
  { id: "rec-candidates", label: "Candidates", icon: Users },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "meetings", label: "Meetings", icon: Video },
  { id: "rec-tests", label: "Create Test", icon: Code2 },
  { id: "rec-analytics", label: "Analytics", icon: BarChartIcon },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

export const navAdmin: NavItem[] = [
  { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "admin-users", label: "Users", icon: Users },
  { id: "admin-companies", label: "Companies", icon: Building2 },
  { id: "admin-drives", label: "All Drives", icon: Briefcase },
  { id: "admin-applications", label: "All Applications", icon: ClipboardList },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "admin-analytics", label: "Analytics & Reports", icon: BarChartIcon },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "admin-settings", label: "System Settings", icon: Settings },
];

export const eventColors: Record<string, string> = {
  interview: "#7c3aed",
  test: "#f59e0b",
  deadline: "#ef4444",
  result: "#10b981",
  info: "#3b82f6",
};

export const INDIGO_SHADES = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"];
