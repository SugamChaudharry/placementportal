"use client";

import React from "react";
import { Search, Plus, Eye, Edit3 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ColorBadge } from "@/components/ui/Badge";
import { LogoCircle } from "@/components/ui/LogoCircle";

export default function AdminCompaniesPage() {
  const cos = [
    { name: "Google India", hires: 12, status: "Active", contact: "campus-in@google.com" },
    { name: "Microsoft India", hires: 8, status: "Active", contact: "univjobs@microsoft.com" },
    { name: "StartupXYZ", hires: 2, status: "Pending review", contact: "hr@startup.example" },
  ];

  return (
    <div className="su">
      <div className="flex justify-between mb-4">
        <Input placeholder="Search companies..." prefix={Search} className="w-64" />
        <Button size="sm" icon={Plus}>Add company</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cos.map(c => (
          <Card key={c.name} className="p-5">
            <div className="flex items-start justify-between mb-2">
              <LogoCircle letter={c.name[0]} color="#0891b2" size={40} />
              <ColorBadge label={c.status} color={c.status === "Active" ? "#059669" : "#f59e0b"} />
            </div>
            <p className="font-600 text-gray-900" style={{ fontWeight: 600 }}>{c.name}</p>
            <p className="text-xs text-gray-500 mt-1">{c.contact}</p>
            <p className="text-sm text-gray-600 mt-3"><strong>{c.hires}</strong> offers this season</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="secondary" icon={Eye}>View</Button>
              <Button size="sm" variant="ghost" icon={Edit3}>Edit</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
