"use client";

import React from "react";
import { Button } from "./Button";
import { PRIMARY_COLOR } from "./Button";

type EmptyStateProps = {
  icon: React.ComponentType<{ size?: string | number; style?: React.CSSProperties }>;
  title: string;
  desc: string;
  cta?: string;
  onCta?: () => void;
};

export function EmptyState({ icon: Icon, title, desc, cta, onCta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "#f0f0ff" }}
      >
        <Icon size={28} style={{ color: PRIMARY_COLOR }} />
      </div>
      <h3 className="font-600 text-gray-800 mb-2" style={{ fontWeight: 600 }}>{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-5">{desc}</p>
      {cta && <Button onClick={onCta} icon={undefined}>{cta}</Button>}
    </div>
  );
}
