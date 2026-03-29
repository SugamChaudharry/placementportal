"use client";

import React from "react";

type InputProps = {
  placeholder?: string;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
  className?: string;
  prefix?: React.ComponentType<{ size?: string | number }>;
  suffix?: React.ComponentType<{ size?: string | number }>;
};

export function Input({
  placeholder,
  value,
  onChange,
  type = "text",
  className = "",
  prefix: Prefix,
  suffix: Suffix,
}: InputProps) {
  const inputStyle: React.CSSProperties & { [key: string]: any } = { "--tw-ring-color": "#4f46e5" };
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
        className={`w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
          Prefix ? "pl-9" : "pl-3"
        } ${Suffix ? "pr-9" : "pr-3"} py-2 ${className}`}
        style={inputStyle}
      />
      {Suffix && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Suffix size={15} />
        </div>
      )}
    </div>
  );
}
