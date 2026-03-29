"use client";

import React from "react";
import { PRIMARY_COLOR } from "./Button";

type ToggleProps = {
  on: boolean;
  onToggle: () => void;
  label?: string;
};

export function Toggle({ on, onToggle, label }: ToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggle}
        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
        style={{ background: on ? PRIMARY_COLOR : "#d1d5db" }}
      >
        <span
          className="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
          style={{ transform: on ? "translateX(18px)" : "translateX(2px)" }}
        />
      </button>
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </div>
  );
}
