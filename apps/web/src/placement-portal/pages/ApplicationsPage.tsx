"use client";

import { Fragment, useState } from "react";
import {
  Check,
  ChevronDown,
  Code2,
  Download,
  Eye,
  MessageSquare,
  MoreHorizontal,
  Search,
  Video,
} from "lucide-react";
import { Av, Bdg, Btn, Card, Input, LogoCircle } from "@/placement-portal/components/atoms";
import { PRIMARY } from "@/placement-portal/constants";
import { APPS } from "@/placement-portal/mock-data";

export function ApplicationsPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Applied", "Shortlisted", "Test Scheduled", "Interview Scheduled", "Offered", "Rejected"];
  const steps = ["Applied", "Shortlisted", "Test Scheduled", "Test Completed", "Interview Scheduled", "Interview Completed", "Offered"];

  const filtered = filter === "All" ? APPS : APPS.filter((a) => a.status === filter);

  return (
    <div className="su">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{ background: filter === s ? PRIMARY : "#f1f5f9", color: filter === s ? "#fff" : "#6b7280" }}
          >
            {s}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <Input placeholder="Search..." prefix={Search} className="w-40" />
          <Btn variant="secondary" size="sm" icon={Download}>
            Export
          </Btn>
        </div>
      </div>

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Company", "Role", "Drive", "Applied On", "Last Updated", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <Fragment key={a.id}>
                <tr
                  className={`border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${expanded === a.id ? "bg-indigo-50" : ""}`}
                  onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <LogoCircle letter={a.logo} color={a.color} size={30} />
                      <span className="font-medium text-gray-800">{a.company}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{a.role}</td>
                  <td className="py-3 px-4 text-gray-500">{a.drive}</td>
                  <td className="py-3 px-4 text-gray-500">{a.date}</td>
                  <td className="py-3 px-4 text-gray-400">{a.updated}</td>
                  <td className="py-3 px-4">
                    <Bdg label={a.status} />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <Btn size="sm" variant="ghost" icon={Eye}>
                        View
                      </Btn>
                      <ChevronDown
                        size={14}
                        className="text-gray-400 self-center"
                        style={{ transform: expanded === a.id ? "rotate(180deg)" : "none", transition: "transform .2s" }}
                      />
                    </div>
                  </td>
                </tr>
                {expanded === a.id && (
                  <tr>
                    <td colSpan={7} className="px-6 py-5 bg-indigo-50 border-b border-indigo-100">
                      <div className="fi">
                        <p className="text-xs font-medium text-gray-500 mb-3">APPLICATION TIMELINE</p>
                        <div className="flex items-center gap-0 mb-5 overflow-x-auto">
                          {steps.map((s, i) => {
                            const stepIdx = steps.indexOf(a.status);
                            const done = i <= stepIdx;
                            const active = i === stepIdx;
                            return (
                              <div key={s} className="flex items-center">
                                <div className="flex flex-col items-center">
                                  <div
                                    className="w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all"
                                    style={{ borderColor: done ? PRIMARY : "#d1d5db", background: done ? PRIMARY : "#fff" }}
                                  >
                                    {done ? <Check size={13} className="text-white" /> : <span className="text-xs text-gray-400">{i + 1}</span>}
                                  </div>
                                  <p
                                    className="text-xs mt-1 whitespace-nowrap"
                                    style={{ color: active ? PRIMARY : "#9ca3af", fontWeight: active ? 600 : 400, fontSize: 10 }}
                                  >
                                    {s}
                                  </p>
                                </div>
                                {i < steps.length - 1 && <div className="h-0.5 w-10 mx-1 mb-4" style={{ background: i < stepIdx ? PRIMARY : "#e5e7eb" }} />}
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex gap-3 flex-wrap">
                          {a.status === "Interview Scheduled" && <Btn icon={Video}>Join Meeting</Btn>}
                          {a.status === "Test Scheduled" && <Btn icon={Code2}>Take Test</Btn>}
                          {a.status === "Offered" && (
                            <Btn icon={Download} variant="success">
                              Download Offer Letter
                            </Btn>
                          )}
                          {a.status === "Rejected" && (
                            <Btn variant="secondary" icon={MessageSquare}>
                              Request Feedback
                            </Btn>
                          )}
                          <Btn variant="secondary" icon={Eye}>
                            View Resume Submitted
                          </Btn>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
