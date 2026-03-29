"use client";

import React from "react";
import { Users, CheckCircle, Video, Award } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { P } from "@/lib/constants";

const timeToHireData = [
  { stage: "Applied", d: 0 }, { stage: "Shortlist", d: 4 }, { stage: "Test", d: 9 },
  { stage: "Interview", d: 16 }, { stage: "Offer", d: 22 },
];

export default function RecruiterAnalyticsPage() {
  return (
    <div className="su space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} value="479" label="Applicants" trend={12} color="#4f46e5" />
        <StatCard icon={CheckCircle} value="156" label="Tests completed" color="#059669" />
        <StatCard icon={Video} value="28" label="Interviews done" color="#7c3aed" />
        <StatCard icon={Award} value="8" label="Offers extended" color="#f59e0b" />
      </div>
      <Card className="p-5">
        <SectionHeader title="Time-to-hire by stage (days)" />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={timeToHireData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="d" fill={P} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
