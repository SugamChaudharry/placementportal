"use client";

import React from "react";

const colors = ["#4f46e5", "#7c3aed", "#2563eb", "#0891b2", "#059669", "#d97706", "#dc2626"];

type AvatarProps = {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
};

export function Avatar({ name = "?", size = 32, color, className = "" }: AvatarProps) {
  const bg = color || colors[name.charCodeAt(0) % colors.length];
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold text-white flex-shrink-0 ${className}`}
      style={{ width: size, height: size, background: bg, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}
