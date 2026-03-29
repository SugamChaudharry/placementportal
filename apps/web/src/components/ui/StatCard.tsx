"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { Card } from "./Card";
import { PRIMARY_COLOR } from "./Button";

type StatCardProps = {
  icon: React.ComponentType<{ size?: string | number; style?: React.CSSProperties }>;
  value: string | number;
  label: string;
  trend?: number;
  color?: string;
  sub?: string;
};

export function StatCard({ icon: Icon, value, label, trend, color = PRIMARY_COLOR, sub }: StatCardProps) {
  return (
    <Card className="p-5 hl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
          <p className="text-2xl font-700" style={{ color: "#1e293b", fontWeight: 700 }}>{value}</p>
          {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: color + "15" }}
        >
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      {trend !== undefined && trend !== 0 && (
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-50">
          <TrendingUp size={12} className="text-emerald-500" />
          <span className="text-xs text-emerald-600 font-medium">+{trend}% this month</span>
        </div>
      )}
    </Card>
  );
}
