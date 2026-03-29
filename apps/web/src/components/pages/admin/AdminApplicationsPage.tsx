"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LogoCircle } from "@/components/ui/LogoCircle";
import { Avatar } from "@/components/ui/Avatar";
import { APPS } from "@/lib/constants";

export default function AdminApplicationsPage() {
  return (
    <div className="su">
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Student","Company","Role","Status","Updated"].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {APPS.map(a => (
              <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-4"><div className="flex items-center gap-2"><Avatar name="Arjun Kumar" size={28} /><span className="text-gray-800">Arjun Kumar</span></div></td>
                <td className="py-3 px-4"><div className="flex items-center gap-2"><LogoCircle letter={a.logo} color={a.color} size={24} />{a.company}</div></td>
                <td className="py-3 px-4 text-gray-600">{a.role}</td>
                <td className="py-3 px-4"><Badge label={a.status} /></td>
                <td className="py-3 px-4 text-gray-500">{a.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
