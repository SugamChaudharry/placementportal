"use client";

import { Edit3, Eye, Plus, Search } from "lucide-react";
import { Btn, Card, ColorBdg, Input, LogoCircle } from "@/placement-portal/components/atoms";

export function AdminCompaniesPage() {
  const cos = [
    { name: "Google India", hires: 12, status: "Active", contact: "campus-in@google.com" },
    { name: "Microsoft India", hires: 8, status: "Active", contact: "univjobs@microsoft.com" },
    { name: "StartupXYZ", hires: 2, status: "Pending review", contact: "hr@startup.example" },
  ];

  return (
    <div className="su">
      <div className="flex justify-between mb-4">
        <Input placeholder="Search companies..." prefix={Search} className="w-64" />
        <Btn size="sm" icon={Plus}>
          Add company
        </Btn>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cos.map((c) => (
          <Card key={c.name} className="p-5">
            <div className="flex items-start justify-between mb-2">
              <LogoCircle letter={c.name[0]} color="#0891b2" size={40} />
              <ColorBdg label={c.status} color={c.status === "Active" ? "#059669" : "#f59e0b"} />
            </div>
            <p className="font-600 text-gray-900" style={{ fontWeight: 600 }}>
              {c.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">{c.contact}</p>
            <p className="text-sm text-gray-600 mt-3">
              <strong>{c.hires}</strong> offers this season
            </p>
            <div className="mt-3 flex gap-2">
              <Btn size="sm" variant="secondary" icon={Eye}>
                View
              </Btn>
              <Btn size="sm" variant="ghost" icon={Edit3}>
                Edit
              </Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
