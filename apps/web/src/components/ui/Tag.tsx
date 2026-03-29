"use client";

import React from "react";
import { X } from "lucide-react";

type TagProps = {
  label: string;
  onRemove?: () => void;
  color?: string;
  textColor?: string;
};

export function Tag({ label, onRemove, color = "#e0e7ff", textColor = "#4f46e5" }: TagProps) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: color, color: textColor }}
    >
      {label}
      {onRemove && (
        <button onClick={onRemove} className="hover:opacity-70">
          <X size={10} />
        </button>
      )}
    </span>
  );
}
