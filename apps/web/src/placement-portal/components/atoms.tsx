"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowRight, TrendingUp, X } from "lucide-react";
import { PRIMARY, STATUSES } from "@/placement-portal/constants";

export function Av({
  name = "?",
  size = 32,
  color,
  className = "",
}: {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
}) {
  const colors = ["#4f46e5", "#7c3aed", "#2563eb", "#0891b2", "#059669", "#d97706", "#dc2626"];
  const bg = color || colors[name.charCodeAt(0) % colors.length];
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold text-white flex-shrink-0 ${className}`}
      style={{ width: size, height: size, background: bg, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

export function Bdg({ label, style = {} }: { label: string; style?: React.CSSProperties }) {
  const s = STATUSES[label] || { bg: "#f1f5f9", text: "#64748b" };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ background: s.bg, color: s.text, ...style }}
    >
      {label}
    </span>
  );
}

export function ColorBdg({ label, color = PRIMARY }: { label: string; color?: string }) {
  const alpha = color + "22";
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: alpha, color }}>
      {label}
    </span>
  );
}

export function Btn({
  children,
  variant = "primary",
  onClick,
  className = "",
  size = "md",
  disabled = false,
  icon: Icon,
}: {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "success";
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  icon?: LucideIcon;
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-lg font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";
  const sz =
    size === "sm" ? "px-3 py-1.5 text-xs" : size === "lg" ? "px-5 py-2.5 text-sm" : "px-4 py-2 text-sm";
  const variants: Record<string, string> = {
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

export function Card({
  children,
  className = "",
  style = {},
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div onClick={onClick} className={`bg-white rounded-xl border border-gray-100 shadow-sm ${className}`} style={style}>
      {children}
    </div>
  );
}

export function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  color = PRIMARY,
  sub,
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: number;
  color?: string;
  sub?: string;
}) {
  return (
    <Card className="p-5 hl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
          <p className="text-2xl font-700" style={{ color: "#1e293b", fontWeight: 700 }}>
            {value}
          </p>
          {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + "15" }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-50">
          <TrendingUp size={12} className="text-emerald-500" />
          <span className="text-xs text-emerald-600 font-medium">+{trend}% this month</span>
        </div>
      )}
    </Card>
  );
}

export function Input({
  placeholder,
  value,
  onChange,
  type = "text",
  className = "",
  prefix: Prefix,
  suffix: Suffix,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  prefix?: LucideIcon;
  suffix?: LucideIcon;
}) {
  return (
    <div className="relative">
      {Prefix && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Prefix size={15} />
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all ${Prefix ? "pl-9" : "pl-3"} ${Suffix ? "pr-9" : "pr-3"} py-2 ${className}`}
        style={{ "--tw-ring-color": "#4f46e5" } as React.CSSProperties}
      />
      {Suffix && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Suffix size={15} />
        </div>
      )}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  width = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fi" style={{ background: "rgba(15,23,42,.5)", backdropFilter: "blur(4px)" }}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${width} su`} style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-600 text-gray-900" style={{ fontWeight: 600 }}>
            {title}
          </h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  desc,
  cta,
  onCta,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  cta?: string;
  onCta?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#f0f0ff" }}>
        <Icon size={28} style={{ color: PRIMARY }} />
      </div>
      <h3 className="font-600 text-gray-800 mb-2" style={{ fontWeight: 600 }}>
        {title}
      </h3>
      <p className="text-sm text-gray-500 max-w-xs mb-5">{desc}</p>
      {cta && <Btn onClick={onCta}>{cta}</Btn>}
    </div>
  );
}

export function LogoCircle({
  letter,
  color,
  size = 36,
  className = "",
}: {
  letter: string;
  color: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg flex items-center justify-center font-700 text-white flex-shrink-0 ${className}`}
      style={{ width: size, height: size, background: color, fontWeight: 700, fontSize: size * 0.42 }}
    >
      {letter}
    </div>
  );
}

export function SectionHeader({
  title,
  action,
  actionLabel,
}: {
  title: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{title}</h2>
      {action && (
        <button onClick={action} className="text-xs font-medium flex items-center gap-1 hover:underline" style={{ color: PRIMARY }}>
          {actionLabel} <ArrowRight size={12} />
        </button>
      )}
    </div>
  );
}

export function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label?: string }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggle}
        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
        style={{ background: on ? PRIMARY : "#d1d5db" }}
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

export function Tag({
  label,
  onRemove,
  color = "#e0e7ff",
  textColor = "#4f46e5",
}: {
  label: string;
  onRemove?: () => void;
  color?: string;
  textColor?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: color, color: textColor }}>
      {label}
      {onRemove && (
        <button onClick={onRemove} className="hover:opacity-70">
          <X size={10} />
        </button>
      )}
    </span>
  );
}
