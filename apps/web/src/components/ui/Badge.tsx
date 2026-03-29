"use client";

import React from "react";

export const STATUSES: { [key: string]: { bg: string; text: string } } = {
  Applied: { bg: "#f1f5f9", text: "#64748b" },
  Shortlisted: { bg: "#dbeafe", text: "#1d4ed8" },
  "Test Scheduled": { bg: "#fef3c7", text: "#92400e" },
  "Test Completed": { bg: "#e0e7ff", text: "#4338ca" },
  "Interview Scheduled": { bg: "#f3e8ff", text: "#7c3aed" },
  Offered: { bg: "#d1fae5", text: "#065f46" },
  Rejected: { bg: "#fee2e2", text: "#991b1b" },
};

type BadgeProps = {
  label: keyof typeof STATUSES | string;
  style?: React.CSSProperties;
};

export function Badge({ label, style = {} }: BadgeProps) {
  const s = (STATUSES as Record<string, { bg: string; text: string }>)[label] || { bg: "#f1f5f9", text: "#64748b" };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ background: s.bg, color: s.text, ...style }}
    >
      {label}
    </span>
  );
}

type ColorBadgeProps = {
  label: string;
  color?: string;
};

export function ColorBadge({ label, color = "#4f46e5" }: ColorBadgeProps) {
  const alpha = color + "22";
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ background: alpha, color }}
    >
      {label}
    </span>
  );
}
