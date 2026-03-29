"use client";

import { Download, Eye, Filter, Search } from "lucide-react";
import { Av, Bdg, Btn, Card, Input } from "@/placement-portal/components/atoms";
import { PRIMARY } from "@/placement-portal/constants";

export function RecruiterCandidatesPage() {
  const rows = [
    { name: "Arjun Kumar", roll: "20CS101", match: 94, stage: "Interview Scheduled" },
    { name: "Priya Sharma", roll: "20CS045", match: 91, stage: "Test Completed" },
    { name: "Rahul Singh", roll: "20IT023", match: 86, stage: "Shortlisted" },
  ];

  return (
    <div className="su">
      <div className="flex gap-2 mb-4">
        <Input placeholder="Search candidates..." prefix={Search} className="max-w-xs" />
        <Btn variant="secondary" size="sm" icon={Filter}>
          Filters
        </Btn>
        <Btn size="sm" icon={Download}>
          Export
        </Btn>
      </div>
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Candidate", "Roll", "AI match", "Pipeline stage", "Actions"].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.roll} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Av name={r.name} size={30} />
                    <span className="font-medium">{r.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-500">{r.roll}</td>
                <td className="py-3 px-4 font-medium" style={{ color: PRIMARY }}>
                  {r.match}%
                </td>
                <td className="py-3 px-4">
                  <Bdg label={r.stage} />
                </td>
                <td className="py-3 px-4">
                  <Btn size="sm" variant="ghost" icon={Eye}>
                    Profile
                  </Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
