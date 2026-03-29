"use client";

import { Award, Share2, TrendingUp, Users } from "lucide-react";
import { Av, Btn, Card, LogoCircle, SectionHeader } from "@/placement-portal/components/atoms";

export function NetworkPage() {
  const alumni = [
    { name: "Priya Sharma", batch: "2023", company: "Google", role: "SDE-2", color: "#4285F4" },
    { name: "Rahul Gupta", batch: "2022", company: "Microsoft", role: "SDE-3", color: "#00A4EF" },
    { name: "Ananya Verma", batch: "2023", company: "Amazon", role: "SDE-1", color: "#FF9900" },
    { name: "Vikram Patel", batch: "2021", company: "Flipkart", role: "Senior SDE", color: "#2874F0" },
    { name: "Neha Singh", batch: "2022", company: "Zomato", role: "PM", color: "#E23744" },
    { name: "Aryan Kumar", batch: "2023", company: "Groww", role: "Backend Engineer", color: "#00D09C" },
  ];

  return (
    <div className="su flex gap-5">
      <div className="w-64 flex-shrink-0 space-y-4">
        <Card className="p-5">
          <p className="font-600 text-sm mb-4" style={{ fontWeight: 600 }}>
            Your Network
          </p>
          {(
            [
              ["Profile views this week", 24, TrendingUp, "#4f46e5"],
              ["Connections", 18, Users, "#0891b2"],
              ["Referrals sent", 3, Share2, "#f59e0b"],
              ["Referrals received", 1, Award, "#10b981"],
            ] as const
          ).map(([l, v, Icon, c]) => (
            <div key={l} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2">
                <Icon size={14} style={{ color: c }} />
                <span className="text-xs text-gray-600">{l}</span>
              </div>
              <span className="font-600 text-sm" style={{ fontWeight: 600, color: "#1e293b" }}>
                {v}
              </span>
            </div>
          ))}
        </Card>
        <Card className="p-5">
          <p className="font-600 text-sm mb-3" style={{ fontWeight: 600 }}>
            Filter Alumni
          </p>
          {[
            ["Company", ["All", "Google", "Microsoft", "Amazon"]],
            ["Batch", ["All", "2023", "2022", "2021"]],
          ].map(([label, opts]) => (
            <div key={label as string} className="mb-3">
              <p className="text-xs text-gray-400 mb-1">{label as string}</p>
              <select className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none">
                {(opts as string[]).map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          ))}
        </Card>
      </div>
      <div className="flex-1">
        <SectionHeader title="Alumni Network" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {alumni.map((a, i) => (
            <Card key={i} className="p-4 text-center hl">
              <Av name={a.name} size={52} className="mx-auto mb-2" />
              <p className="font-600 text-sm" style={{ fontWeight: 600 }}>
                {a.name}
              </p>
              <p className="text-xs text-gray-500">Batch of {a.batch}</p>
              <div className="flex items-center justify-center gap-1 mt-1 mb-3">
                <LogoCircle letter={a.company[0]} color={a.color} size={16} />
                <span className="text-xs text-gray-600">
                  {a.company} · {a.role}
                </span>
              </div>
              <div className="flex gap-2">
                <Btn size="sm" variant="secondary" className="flex-1 justify-center">
                  Connect
                </Btn>
                <Btn size="sm" className="flex-1 justify-center" icon={Share2}>
                  Referral
                </Btn>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
