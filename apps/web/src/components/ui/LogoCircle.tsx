"use client";

import React from "react";

type LogoCircleProps = {
  letter: string;
  color: string;
  size?: number;
  className?: string;
};

export function LogoCircle({ letter, color, size = 36, className = "" }: LogoCircleProps) {
  return (
    <div
      className={`rounded-lg flex items-center justify-center font-700 text-white flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        fontWeight: 700,
        fontSize: size * 0.42,
      }}
    >
      {letter}
    </div>
  );
}
