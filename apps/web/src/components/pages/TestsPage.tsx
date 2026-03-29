"use client";
import { useState } from "react";
import { Trophy, Play, Eye, Info } from "lucide-react";

// Temporary component definitions (to be moved to shared files later)
const P = "#4f46e5";
const Card = ({ children, className = "", ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <div className={`bg-white rounded-xl border border-gray-100 shadow-sm ${className}`} {...props}>{children}</div>
);
type BtnVariant = "primary" | "secondary" | "ghost";
type BtnSize = "sm" | "md" | "lg";
const Btn = ({ children, variant = "primary", size = "md", icon: Icon, className = "", ...props }: {
  children: React.ReactNode;
  variant?: BtnVariant;
  size?: BtnSize;
  icon?: React.ComponentType<any>;
  className?: string;
  [key: string]: any;
}) => {
  const baseClasses = "inline-flex items-center gap-2 font-medium rounded-lg transition-colors focus:outline-none";
  const variantClasses = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    ghost: "text-indigo-600 hover:bg-indigo-50"
  };
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
};
const LogoCircle = ({ letter, color, size = 40 }: { letter: string; color: string; size?: number }) => (
  <div className="rounded-full flex items-center justify-center text-white font-bold" style={{ width: size, height: size, background: color, fontSize: size * 0.4 }}>
    {letter}
  </div>
);
const ColorBdg = ({ label, color }: { label: string; color: string }) => (
  <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ background: color }}>
    {label}
  </span>
);
const Tag = ({ label, color = "#e0e7ff", textColor = "#3730a3" }: { label: string; color?: string; textColor?: string }) => (
  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: color, color: textColor }}>
    {label}
  </span>
);

function TestsPage() {
  const [testTab, setTestTab] = useState("upcoming");
  const tests = [
    { id: 1, company: "Microsoft", logo: "M", color: "#00A4EF", name: "SDE-2 Online Assessment", date: "Feb 8, 2025", time: "2:00 PM", duration: "90 min", questions: 3, langs: ["Python","C++","Java"], status: "Upcoming" },
    { id: 2, company: "Flipkart", logo: "F", color: "#2874F0", name: "Data Analyst Test", date: "Jan 28, 2025", time: "3:00 PM", duration: "60 min", questions: 25, langs: ["SQL","Python"], status: "Completed", score: "84/100" },
    { id: 3, company: "Amazon", logo: "A", color: "#FF9900", name: "SDE-1 Coding Round", date: "Feb 15, 2025", time: "11:00 AM", duration: "120 min", questions: 2, langs: ["Python","Java","C++"], status: "Upcoming" },
  ];
  const filtered = tests.filter(t => t.status.toLowerCase() === testTab || testTab === "all");

  return (
    <div className="su">
      <div className="flex gap-1 bg-white rounded-xl border border-gray-100 shadow-sm p-1.5 mb-4 w-fit">
        {["upcoming","completed"].map(t => (
          <button key={t} onClick={() => setTestTab(t)}
            className="px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all"
            style={{ background: testTab === t ? P : "transparent", color: testTab === t ? "#fff" : "#6b7280" }}>
            {t}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(t => (
          <Card key={t.id} className="p-5 hl">
            <div className="flex items-start gap-3 mb-4">
              <LogoCircle letter={t.logo} color={t.color} size={46} />
              <div className="flex-1">
                <p className="font-600" style={{ fontWeight: 600 }}>{t.name}</p>
                <p className="text-xs text-gray-500">{t.company}</p>
              </div>
              <ColorBdg label={t.status} color={t.status === "Upcoming" ? "#4f46e5" : "#10b981"} />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[["Date", t.date], ["Time", t.time], ["Duration", t.duration]].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-gray-400">{k}</p>
                  <p className="text-xs font-medium text-gray-700">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {t.langs.map(l => <Tag key={l} label={l} color="#f0f9ff" textColor="#0369a1" />)}
              <span className="text-xs text-gray-500">{t.questions} questions</span>
            </div>
            {t.score && (
              <div className="mb-3 flex items-center gap-2 p-2 rounded-lg bg-emerald-50">
                <Trophy size={14} className="text-emerald-600" />
                <span className="text-sm font-600 text-emerald-700" style={{ fontWeight: 600 }}>Score: {t.score}</span>
              </div>
            )}
            <div className="flex gap-2">
              {t.status === "Upcoming" && <Btn className="flex-1 justify-center" icon={Play}>Start Test</Btn>}
              {t.status === "Completed" && <Btn className="flex-1 justify-center" variant="secondary" icon={Eye}>View Results</Btn>}
              <Btn variant="secondary" icon={Info}>Instructions</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default TestsPage;