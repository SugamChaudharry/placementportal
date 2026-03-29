"use client";

import React from "react";

export const PRIMARY_COLOR = "#4f46e5";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "success";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  size?: ButtonSize;
  disabled?: boolean;
  icon?: React.ComponentType<{ size?: string | number }>;
};

export function Button({
  children,
  variant = "primary",
  onClick,
  className = "",
  size = "md",
  disabled = false,
  icon: Icon,
}: ButtonProps) {
  const base = "inline-flex items-center gap-1.5 rounded-lg font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";
  const sz = size === "sm" ? "px-3 py-1.5 text-xs" : size === "lg" ? "px-5 py-2.5 text-sm" : "px-4 py-2 text-sm";
  const variants: Record<ButtonVariant, string> = {
    primary: "text-white hover:opacity-90 active:scale-95",
    secondary: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 active:scale-95",
    danger: "text-white bg-red-600 hover:bg-red-700 active:scale-95",
    ghost: "text-gray-600 hover:bg-gray-100 active:scale-95",
    success: "text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95",
  };
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${sz} ${variants[variant]} ${className}`}
      style={variant === "primary" ? { background: "linear-gradient(135deg,#4f46e5,#6366f1)" } : {}}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}
