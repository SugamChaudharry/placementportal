"use client";

import React from "react";
import { Search, Filter, Download, Eye, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { P } from "@/lib/constants";

export default function RecruiterCandidatesPage() {
  const rows = [
    { name: "Arjun Kumar", roll: "20CS101", match: 94, stage: "Interview Scheduled" },
    { name: "Priya Sharma", roll: "20CS045", match: 91, stage: "Test Completed" },
    { name: "Rahul Singh", roll: "20IT023", match: 86, stage: "Shortlisted" },
  ];

  return (
    <div className="su">
      <div className="flex gap-2 mb-4">
        <Input placeholder="Search candidates..." prefix={Search} className="max-w-xs" />
        <Button variant="secondary" size="sm" icon={Filter}>Filters</Button>
        <Button size="sm" icon={Download}>Export</Button>
      </div>
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Candidate","Roll","AI match","Pipeline stage","Actions"].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.roll} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-4"><div className="flex items-center gap-2"><Avatar name={r.name} size={30} /><span className="font-medium">{r.name}</span></div></td>
                <td className="py-3 px-4 text-gray-500">{r.roll}</td>
                <td className="py-3 px-4 font-medium" style={{ color: P }}>{r.match}%</td>
                <td className="py-3 px-4"><Badge label={r.stage} /></td>
                <td className="py-3 px-4"><Button size="sm" variant="ghost" icon={Eye}>Profile</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
