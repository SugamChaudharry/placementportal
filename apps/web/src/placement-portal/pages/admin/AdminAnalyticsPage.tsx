"use client";

import { useState } from "react";
import { Award, Building2, Download, FileText, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Av, Btn, Card, ColorBdg, LogoCircle, SectionHeader, StatCard } from "@/placement-portal/components/atoms";
import { INDIGO_SHADES, PRIMARY } from "@/placement-portal/constants";
import {
  chartBranch,
  chartCompanyMix,
  chartDriveTrend,
  chartPlacement,
  chartRadar,
  topStudentsPerf,
} from "@/placement-portal/mock-data";

export function AdminAnalyticsPage() {
  const [tab, setTab] = useState("placement-overview");
  const tabs = [
    { id: "placement-overview", label: "Placement Overview" },
    { id: "drive-performance", label: "Drive Performance" },
    { id: "student-performance", label: "Student Performance" },
    { id: "company-insights", label: "Company Insights" },
  ];

  return (
    <div className="su">
      <div className="flex gap-0 border-b border-gray-200 mb-5 overflow-x-auto flex-wrap">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all"
            style={{ borderColor: tab === id ? PRIMARY : "transparent", color: tab === id ? PRIMARY : "#6b7280" }}
          >
            {label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 pb-2">
          <select className="text-xs border border-gray-200 rounded px-2 py-1">
            <option>2024–25</option>
            <option>2023–24</option>
          </select>
          <Btn size="sm" variant="secondary" icon={Download}>
            Export
          </Btn>
          <Btn size="sm" icon={FileText}>
            NAAC Report
          </Btn>
        </div>
      </div>

      {tab === "placement-overview" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 text-center" style={{ background: "linear-gradient(135deg,#eef2ff,#fdf4ff)" }}>
              <p className="text-4xl font-700" style={{ fontWeight: 700, color: PRIMARY }}>
                89%
              </p>
              <p className="text-sm text-gray-500 mt-1">Placement Rate</p>
              <p className="text-xs text-emerald-600 mt-1">↑ 6% vs last year</p>
            </Card>
            <StatCard icon={Building2} value="38" label="Companies Visited" trend={12} color="#0891b2" />
            <StatCard icon={TrendingUp} value="₹18.4L" label="Average CTC" sub="Median: ₹14.2L" trend={8} color="#059669" />
            <StatCard icon={Award} value="₹45L" label="Highest Package" sub="Google SDE-3" color="#f59e0b" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="p-5">
              <SectionHeader title="Month-wise Offer Trend" />
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartPlacement}>
                  <defs>
                    <linearGradient id="indigo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Area dataKey="offers" fill="url(#indigo)" stroke={PRIMARY} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5">
              <SectionHeader title="Branch-wise Placement Rate" />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartBranch} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                  <YAxis dataKey="branch" type="category" tick={{ fontSize: 11 }} width={40} />
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="rate" radius={[0, 6, 6, 0]}>
                    {chartBranch.map((_, i) => (
                      <Cell key={i} fill={INDIGO_SHADES[Math.min(i, 4)]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      )}

      {tab === "drive-performance" && (
        <>
          <Card className="mb-5 p-5">
            <SectionHeader title="Tests vs Offers (season trend)" />
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartDriveTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="tests" stroke="#94a3b8" strokeWidth={2} dot={false} name="Assessments" />
                <Line type="monotone" dataKey="offers" stroke={PRIMARY} strokeWidth={2} name="Offers" />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Company", "Drive Name", "Applicants", "Shortlisted", "Offered", "Acceptance Rate"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ["Google", "SDE Campus 2025", 234, 45, 8, "89%", "#4285F4"],
                    ["Microsoft", "SDE-2 2025", 198, 62, 12, "92%", "#00A4EF"],
                    ["Amazon", "SDE-1 2025", 312, 78, 15, "80%", "#FF9900"],
                    ["Flipkart", "DA Summer 2025", 156, 34, 6, "75%", "#2874F0"],
                    ["Groww", "Backend 2025", 98, 28, 5, "88%", "#00D09C"],
                  ] as const
                ).map(([comp, drive, app, shortlist, offered, rate, col]) => (
                  <tr key={`${comp}-${drive}`} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <LogoCircle letter={comp[0]} color={col} size={28} />
                        <span className="font-medium text-gray-800">{comp}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{drive}</td>
                    <td className="py-3 px-4">{app}</td>
                    <td className="py-3 px-4">{shortlist}</td>
                    <td className="py-3 px-4 font-medium" style={{ color: "#059669" }}>
                      {offered}
                    </td>
                    <td className="py-3 px-4">
                      <ColorBdg label={rate} color="#059669" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      {tab === "student-performance" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="p-5">
            <SectionHeader title="Skill dimensions (cohort average)" />
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={chartRadar} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <Radar name="Avg" dataKey="A" stroke={PRIMARY} fill={PRIMARY} fillOpacity={0.35} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <SectionHeader title="Top performers (mock interviews + CGPA)" />
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Student", "Branch", "CGPA", "Offers", "Top company"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topStudentsPerf.map((s) => (
                  <tr key={s.name} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Av name={s.name} size={30} />
                        <span className="font-medium text-gray-800">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{s.branch}</td>
                    <td className="py-3 px-4 font-medium" style={{ color: s.cgpa >= 9 ? "#10b981" : "#374151" }}>
                      {s.cgpa}
                    </td>
                    <td className="py-3 px-4">{s.offers}</td>
                    <td className="py-3 px-4 text-gray-600">{s.company}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {tab === "company-insights" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="p-5 lg:col-span-2">
            <SectionHeader title="Offers by role cluster" />
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={chartCompanyMix} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {chartCompanyMix.map((_, i) => (
                    <Cell key={i} fill={INDIGO_SHADES[i % INDIGO_SHADES.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-5">
            <p className="font-600 text-sm mb-4" style={{ fontWeight: 600 }}>
              Returning recruiters
            </p>
            <div className="space-y-3">
              {[
                ["Google", "4th year on campus", "92% offer acceptance"],
                ["Microsoft", "3rd year", "88%"],
                ["Amazon", "5th year", "81%"],
              ].map(([c, y, n]) => (
                <div key={c} className="p-3 rounded-xl border border-gray-100">
                  <p className="text-sm font-medium text-gray-800">{c}</p>
                  <p className="text-xs text-gray-500">{y}</p>
                  <p className="text-xs mt-1" style={{ color: PRIMARY }}>
                    {n}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
