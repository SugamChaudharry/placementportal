"use client";

import { useState } from "react";
import { Btn, Card } from "@/placement-portal/components/atoms";
import { PRIMARY } from "@/placement-portal/constants";
import { NOTIFS, type NotifItem } from "@/placement-portal/mock-data";

export function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Unread", "Applications", "Tests", "Interviews", "System"];
  const [notifs, setNotifs] = useState<NotifItem[]>(NOTIFS);

  return (
    <div className="su max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{ background: filter === f ? PRIMARY : "#f1f5f9", color: filter === f ? "#fff" : "#6b7280" }}
            >
              {f}
            </button>
          ))}
        </div>
        <Btn variant="secondary" size="sm" onClick={() => setNotifs((n) => n.map((x) => ({ ...x, unread: false })))}>
          Mark all read
        </Btn>
      </div>
      <Card>
        {notifs.map((n) => (
          <div
            key={n.id}
            onClick={() => setNotifs((ns) => ns.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))}
            className="flex gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
            style={{ borderLeft: n.unread ? `4px solid ${PRIMARY}` : "4px solid transparent" }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: n.color + "20" }}>
              <n.icon size={18} style={{ color: n.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-600 text-sm text-gray-900" style={{ fontWeight: n.unread ? 600 : 500 }}>
                  {n.title}
                </p>
                <span className="text-xs text-gray-400 flex-shrink-0">{n.time}</span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{n.msg}</p>
              {n.action && (
                <button className="mt-2 text-xs font-medium" style={{ color: PRIMARY }}>
                  {n.action} →
                </button>
              )}
            </div>
            {n.unread && <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: PRIMARY }} />}
          </div>
        ))}
      </Card>
    </div>
  );
}
