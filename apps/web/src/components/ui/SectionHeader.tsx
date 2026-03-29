"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { PRIMARY_COLOR } from "./Button";

type SectionHeaderProps = {
  title: string;
  action?: () => void;
  actionLabel?: string;
};

export function SectionHeader({ title, action, actionLabel }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{title}</h2>
      {action && (
        <button
          onClick={action}
          className="text-xs font-medium flex items-center gap-1 hover:underline"
          style={{ color: PRIMARY_COLOR }}
        >
          {actionLabel} <ArrowRight size={12} />
        </button>
      )}
    </div>
  );
}
