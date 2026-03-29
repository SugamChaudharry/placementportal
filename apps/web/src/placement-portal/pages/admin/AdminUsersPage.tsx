"use client";

import { useState } from "react";
import { Download, Edit3, Eye, Lock, Plus, Search, Trash2, Unlock, Upload } from "lucide-react";
import { Av, Btn, Card, Input } from "@/placement-portal/components/atoms";

export function AdminUsersPage() {
  const [tab, setTab] = useState("students");
  const [search, setSearch] = useState("");

  const students = [
    { name: "Arjun Kumar", roll: "20CS101", branch: "CSE", cgpa: 8.9, batch: 2025, registered: "Jan 10", status: "Active" },
    { name: "Priya Sharma", roll: "20CS045", branch: "CSE", cgpa: 9.2, batch: 2025, registered: "Jan 8", status: "Active" },
    { name: "Rahul Singh", roll: "20IT023", branch: "IT", cgpa: 8.4, batch: 2025, registered: "Jan 12", status: "Active" },
    { name: "Ananya Verma", roll: "20CS089", branch: "CSE", cgpa: 9.5, batch: 2025, registered: "Jan 5", status: "Active" },
    { name: "Vikram Patel", roll: "20ME101", branch: "ME", cgpa: 7.8, batch: 2025, registered: "Jan 15", status: "Blocked" },
  ];

  const filtered = students.filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="su">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-0 border-b border-gray-200">
          {["Students", "Recruiters"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t.toLowerCase())}
              className="px-5 py-3 text-sm font-medium border-b-2 transition-all"
              style={{ borderColor: tab === t.toLowerCase() ? "#4f46e5" : "transparent", color: tab === t.toLowerCase() ? "#4f46e5" : "#6b7280" }}
            >
              {t} {t === "Students" ? "(2,847)" : "(124)"}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input placeholder="Search..." prefix={Search} className="w-48" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Btn variant="secondary" size="sm" icon={Upload}>
            Bulk Import CSV
          </Btn>
          <Btn variant="secondary" size="sm" icon={Download}>
            Export
          </Btn>
          <Btn size="sm" icon={Plus}>
            Add User
          </Btn>
        </div>
      </div>
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Student", "Roll No.", "Branch", "CGPA", "Batch", "Registered", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.roll} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Av name={s.name} size={30} />
                    <span className="font-medium text-gray-800">{s.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-500">{s.roll}</td>
                <td className="py-3 px-4 text-gray-600">{s.branch}</td>
                <td className="py-3 px-4 font-medium" style={{ color: s.cgpa >= 8.5 ? "#10b981" : s.cgpa >= 7.5 ? "#f59e0b" : "#ef4444" }}>
                  {s.cgpa}
                </td>
                <td className="py-3 px-4 text-gray-600">{s.batch}</td>
                <td className="py-3 px-4 text-gray-500">{s.registered}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: s.status === "Active" ? "#d1fae5" : "#fee2e2", color: s.status === "Active" ? "#065f46" : "#991b1b" }}>
                    {s.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    <Btn size="sm" variant="ghost" icon={Eye}>
                      View
                    </Btn>
                    <Btn size="sm" variant="ghost" icon={Edit3} />
                    <Btn size="sm" variant="ghost" icon={s.status === "Active" ? Lock : Unlock} />
                    <Btn size="sm" variant="ghost" icon={Trash2} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
