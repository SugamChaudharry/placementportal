"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { ColorBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Eye } from "lucide-react";

export default function AdminDrivesPage() {
  const drives = [
    { company: "Google", role: "SDE Campus 2025", apps: 234, status: "Open" },
    { company: "Microsoft", role: "SDE-2 2025", apps: 198, status: "Open" },
    { company: "Zomato", role: "Product Intern", apps: 156, status: "Closed" },
  ];

  return (
    <div className="su">
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Company","Role / Drive","Applications","Status","Actions"].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {drives.map(d => (
              <tr key={d.role} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{d.company}</td>
                <td className="py-3 px-4 text-gray-600">{d.role}</td>
                <td className="py-3 px-4">{d.apps}</td>
                <td className="py-3 px-4"><ColorBadge label={d.status} color={d.status === "Open" ? "#059669" : "#64748b"} /></td>
                <td className="py-3 px-4"><Button size="sm" variant="ghost" icon={Eye}>View</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
