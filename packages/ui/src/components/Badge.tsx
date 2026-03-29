type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "purple";
const styles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-600",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger:  "bg-red-50 text-red-700",
  info:    "bg-blue-50 text-blue-700",
  purple:  "bg-purple-50 text-purple-700",
};
interface BadgeProps { variant?: BadgeVariant; className?: string; children: React.ReactNode; }
import React from "react";
export function Badge({ variant = "default", className = "", children }: BadgeProps) {
  return <span className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " + styles[variant] + " " + className}>{children}</span>;
}
