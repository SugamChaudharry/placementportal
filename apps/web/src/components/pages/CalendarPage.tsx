import React, { useState } from "react";
import {
  ChevronLeft, ChevronRight, Calendar, Video, Code2, Bell,
  GraduationCap, Building2, Shield, Mail, Lock as LockIcon, User
} from "lucide-react";

// ─── Temporary Shared Components ─────────────────────────────────────────────
const P = "#4f46e5";

const Card = ({ children, className = "", ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

const Btn = ({ children, icon: Icon, variant = "primary", size = "md", className = "", ...props }: {
  children: React.ReactNode;
  icon?: React.ComponentType<any>;
  variant?: "primary" | "secondary" | "success" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  [key: string]: any;
}) => {
  const baseClasses = "inline-flex items-center gap-2 rounded-lg font-medium transition-all focus:outline-none disabled:opacity-50";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    success: "bg-green-600 text-white hover:bg-green-700",
    ghost: "text-gray-600 hover:bg-gray-100"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {Icon && <Icon size={size === "sm" ? 14 : size === "md" ? 16 : 18} />}
      {children}
    </button>
  );
};

// ─── Mock Data ──────────────────────────────────────────────────────────────
const eventColors = {
  interview: "#7c3aed",
  test: "#f59e0b",
  deadline: "#ef4444",
  meeting: "#10b981"
};

const CALENDAR_EVENTS: { [key: number]: Array<{ title: string; time: string; type: keyof typeof eventColors; company: string }> } = {
  5: [
    { title: "Google SDE Interview", time: "10:00 AM", type: "interview", company: "Google" },
    { title: "Microsoft Coding Test", time: "2:00 PM", type: "test", company: "Microsoft" }
  ],
  8: [
    { title: "Amazon Application Deadline", time: "11:59 PM", type: "deadline", company: "Amazon" }
  ],
  15: [
    { title: "Flipkart Technical Round", time: "3:00 PM", type: "interview", company: "Flipkart" }
  ],
  22: [
    { title: "Paytm HR Discussion", time: "11:00 AM", type: "meeting", company: "Paytm" }
  ]
};

// ─── CalendarPage Component ─────────────────────────────────────────────────
function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 1, 1)); // Feb 2025
  const [selectedDay, setSelectedDay] = useState(5);
  const [view, setView] = useState("month");

  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleString("en-IN", { month: "long", year: "numeric" });

  const views = ["Month", "Week", "Day", "Agenda"];

  return (
    <div className="su flex gap-5">
      <div className="flex-1">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
              <ChevronLeft size={16} />
            </button>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>{monthName}</h2>
            <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
              <ChevronRight size={16} />
            </button>
            <Btn variant="secondary" size="sm">Today</Btn>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {views.map(v => (
              <button key={v} onClick={() => setView(v.toLowerCase())}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                style={{ background: view === v.toLowerCase() ? "#fff" : "transparent", color: view === v.toLowerCase() ? "#1e293b" : "#6b7280", boxShadow: view === v.toLowerCase() ? "0 1px 3px rgba(0,0,0,.1)" : "none" }}>
                {v}
              </button>
            ))}
          </div>
        </div>

        <Card className="p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
              <div key={d} className="text-center text-xs font-medium text-gray-400 py-2">{d}</div>
            ))}
          </div>
          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} className="aspect-square" />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const events = CALENDAR_EVENTS[day] || [];
              const isSelected = selectedDay === day;
              const isToday = day === 28; // mock today
              return (
                <div key={day} onClick={() => setSelectedDay(day)}
                  className="aspect-square p-1 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                  style={{ background: isSelected ? "#eef2ff" : isToday ? "#f0fdf4" : "" }}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-xs font-medium mb-0.5 ${isToday ? "text-white" : ""}`}
                    style={{ background: isToday ? "#10b981" : isSelected ? P : "transparent", color: isToday ? "#fff" : isSelected ? P : "#374151" }}>
                    {day}
                  </div>
                  {events.slice(0, 2).map((ev, idx) => (
                    <div key={idx} className="rounded text-white text-center truncate" style={{ background: eventColors[ev.type], fontSize: 8, padding: "1px 3px", marginBottom: 1 }}>
                      {ev.company}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Day panel */}
      <div className="w-72 flex-shrink-0">
        <Card className="p-4">
          <h3 className="font-600 text-sm mb-4" style={{ fontWeight: 600 }}>Feb {selectedDay}, 2025</h3>
          {(CALENDAR_EVENTS[selectedDay] || []).length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-400">No events on this day</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(CALENDAR_EVENTS[selectedDay] || []).map((ev, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: eventColors[ev.type] + "15", borderLeft: `3px solid ${eventColors[ev.type]}` }}>
                  <p className="font-medium text-gray-900 text-sm">{ev.title}</p>
                  <p className="text-xs text-gray-500">{ev.time}</p>
                  <div className="flex gap-2 mt-2">
                    {ev.type === "interview" && <Btn size="sm" icon={Video}>Join</Btn>}
                    {ev.type === "test" && <Btn size="sm" icon={Code2}>Take Test</Btn>}
                    <Btn size="sm" variant="secondary" icon={Bell}>Remind</Btn>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Legend */}
        <Card className="p-4 mt-3">
          <p className="text-xs font-medium text-gray-500 mb-3">EVENT TYPES</p>
          {Object.entries(eventColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2 mb-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: color }} />
              <span className="text-xs text-gray-600 capitalize">{type}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

export default CalendarPage;