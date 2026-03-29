"use client";

import { Award, CheckCircle, Users, Video } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, SectionHeader, StatCard } from "@/placement-portal/components/atoms";
import { PRIMARY } from "@/placement-portal/constants";

export function RecruiterAnalyticsPage() {
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
          <BarChart
            data={[
              { stage: "Applied", d: 0 },
              { stage: "Shortlist", d: 4 },
              { stage: "Test", d: 9 },
              { stage: "Interview", d: 16 },
              { stage: "Offer", d: 22 },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="d" fill={PRIMARY} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
