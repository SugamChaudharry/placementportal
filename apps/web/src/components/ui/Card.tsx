"use client";

import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export function Card({ children, className = "", style = {}, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-100 shadow-sm ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
