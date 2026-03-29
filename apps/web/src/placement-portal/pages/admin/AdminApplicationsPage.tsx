"use client";

import { Av, Bdg, Card, LogoCircle } from "@/placement-portal/components/atoms";
import { APPS } from "@/placement-portal/mock-data";

export function AdminApplicationsPage() {
  return (
    <div className="su">
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Student", "Company", "Role", "Status", "Updated"].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {APPS.map((a) => (
              <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Av name="Arjun Kumar" size={28} />
                    <span className="text-gray-800">Arjun Kumar</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <LogoCircle letter={a.logo} color={a.color} size={24} />
                    {a.company}
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600">{a.role}</td>
                <td className="py-3 px-4">
                  <Bdg label={a.status} />
                </td>
                <td className="py-3 px-4 text-gray-500">{a.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
