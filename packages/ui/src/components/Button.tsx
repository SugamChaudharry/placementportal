import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variants = {
  primary:   "bg-indigo-600 text-white hover:bg-indigo-700 border-transparent",
  secondary: "bg-white text-gray-700 hover:bg-gray-50 border-gray-300",
  danger:    "bg-red-600 text-white hover:bg-red-700 border-transparent",
  ghost:     "bg-transparent text-gray-600 hover:bg-gray-100 border-transparent",
};
const sizes = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-sm gap-2",
};

export function Button({ variant = "primary", size = "md", loading, children, disabled, className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={"inline-flex items-center justify-center font-medium rounded-lg border transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed " + variants[variant] + " " + sizes[size] + " " + className}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}
