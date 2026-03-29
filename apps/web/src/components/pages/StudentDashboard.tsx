import React from "react";
import {
  ClipboardList, Code2, Video, Award, Sparkles, CheckCircle, Clock, Brain,
  GraduationCap, Building2, Shield, Mail, Lock, User, MapPin
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

const StatCard = ({ icon: Icon, value, label, sub, trend, color }: {
  icon: React.ComponentType<any>;
  value: string;
  label: string;
  sub: string;
  trend: number;
  color: string;
}) => (
  <Card className="p-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: color + "20" }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-xl font-700" style={{ fontWeight: 700, color: "#1e293b" }}>{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>
    </div>
    <div className="mt-2 flex items-center gap-1">
      <span className="text-xs text-green-600 font-medium">+{trend}%</span>
      <span className="text-xs text-gray-400">vs last month</span>
    </div>
  </Card>
);

const SectionHeader = ({ title, action, actionLabel }: {
  title: string;
  action?: () => void;
  actionLabel?: string;
}) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-sm font-600 text-gray-800" style={{ fontWeight: 600 }}>{title}</h3>
    {action && actionLabel && (
      <button onClick={action} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
        {actionLabel}
      </button>
    )}
  </div>
);

const LogoCircle = ({ letter, color, size }: { letter: string; color: string; size: number }) => (
  <div
    className="rounded-full flex items-center justify-center text-white font-bold"
    style={{ width: size, height: size, background: color, fontSize: size * 0.4 }}
  >
    {letter}
  </div>
);

const Bdg = ({ label }: { label: string }) => {
  const colors: { [key: string]: string } = {
    "Applied": "#3b82f6",
    "Shortlisted": "#f59e0b",
    "Test Scheduled": "#8b5cf6",
    "Interview Scheduled": "#10b981",
    "Offered": "#059669",
    "Rejected": "#ef4444"
  };
  return (
    <span
      className="px-2 py-1 rounded-full text-xs font-medium text-white"
      style={{ background: colors[label] || "#6b7280" }}
    >
      {label}
    </span>
  );
};

const ColorBdg = ({ label, color }: { label: string; color: string }) => (
  <span
    className="px-2 py-1 rounded-full text-xs font-medium text-white"
    style={{ background: color }}
  >
    {label}
  </span>
);

const Tag = ({ label }: { label: string }) => (
  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
    {label}
  </span>
);

// ─── Mock Data ──────────────────────────────────────────────────────────────
const APPS = [
  { id: 1, company: "Google", role: "SDE-1", logo: "G", color: "#4285F4", date: "Jan 15", updated: "2 days ago", status: "Interview Scheduled", drive: "Winter 2025" },
  { id: 2, company: "Microsoft", role: "Software Engineer", logo: "M", color: "#00A4EF", date: "Jan 12", updated: "5 days ago", status: "Test Scheduled", drive: "Winter 2025" },
  { id: 3, company: "Amazon", role: "SDE-2", logo: "A", color: "#FF9900", date: "Jan 10", updated: "1 week ago", status: "Shortlisted", drive: "Winter 2025" },
  { id: 4, company: "Flipkart", role: "Backend Developer", logo: "F", color: "#2874F0", date: "Jan 8", updated: "1 week ago", status: "Applied", drive: "Winter 2025" },
  { id: 5, company: "Paytm", role: "Full Stack Developer", logo: "P", color: "#00BAF2", date: "Jan 5", updated: "2 weeks ago", status: "Rejected", drive: "Winter 2025" }
];

const JOBS = [
  { id: 1, role: "SDE-1", company: "Google", logo: "G", color: "#4285F4", location: "Bangalore", ctc: "28-32 LPA", deadline: "Feb 15", eligible: true, type: "Full-time", skills: ["React", "Node.js", "Python"], desc: "Join Google's engineering team to build scalable web applications." },
  { id: 2, role: "Software Engineer", company: "Microsoft", logo: "M", color: "#00A4EF", location: "Hyderabad", ctc: "22-26 LPA", deadline: "Feb 20", eligible: true, type: "Full-time", skills: ["C#", ".NET", "Azure"], desc: "Work on Microsoft's cloud infrastructure and developer tools." },
  { id: 3, role: "SDE Intern", company: "Amazon", logo: "A", color: "#FF9900", location: "Bangalore", ctc: "1.2 LPA", deadline: "Mar 1", eligible: false, type: "Internship", skills: ["Java", "AWS", "Spring"], desc: "Summer internship opportunity at Amazon's Bangalore office." }
];

const NOTIFS = [
  { id: 1, title: "Google application shortlisted", time: "2 hours ago", color: "#10b981", icon: CheckCircle },
  { id: 2, title: "Microsoft coding test scheduled", time: "1 day ago", color: "#f59e0b", icon: Clock },
  { id: 3, title: "Amazon deadline approaching", time: "3 days ago", color: "#ef4444", icon: Award }
];

// ─── StudentDashboard Component ──────────────────────────────────────────────
function StudentDashboard({ setPage }: { setPage: (page: string) => void }) {
  const hours = new Date().getHours();
  const greet = hours < 12 ? "Good morning" : hours < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const streak = [true, true, false, true, true, true, false];

  return (
    <div className="su space-y-6">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1e293b" }}>{greet}, Arjun 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">{today}</p>
        </div>
        <Btn icon={Sparkles} onClick={() => setPage("mock-interview")}>AI Mock Interview</Btn>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ClipboardList} value="6" label="Applications Sent" sub="this month" trend={20} color="#4f46e5" />
        <StatCard icon={Code2} value="3" label="Tests Taken" sub="2 pending" trend={50} color="#7c3aed" />
        <StatCard icon={Video} value="2" label="Interviews Scheduled" sub="next: Feb 5" trend={15} color="#2563eb" />
        <StatCard icon={Award} value="1" label="Offers Received" sub="Groww Backend" trend={100} color="#059669" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming events */}
        <Card className="p-5 lg:col-span-2">
          <SectionHeader title="📅 Upcoming Events" action={() => setPage("calendar")} actionLabel="Full calendar" />
          <div className="space-y-3">
            {[
              { title: "Google SDE Interview", date: "Feb 5, 10:00 AM", company: "Google", color: "#4285F4", type: "interview", typeColor: "#7c3aed" },
              { title: "Microsoft Coding Test", date: "Feb 8, 2:00 PM", company: "Microsoft", color: "#00A4EF", type: "test", typeColor: "#f59e0b" },
              { title: "Amazon Application Deadline", date: "Feb 15, 11:59 PM", company: "Amazon", color: "#FF9900", type: "deadline", typeColor: "#ef4444" },
            ].map((ev, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <LogoCircle letter={ev.company[0]} color={ev.color} size={38} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{ev.title}</p>
                  <p className="text-xs text-gray-500">{ev.company} · {ev.date}</p>
                </div>
                <ColorBdg label={ev.type} color={ev.typeColor} />
              </div>
            ))}
          </div>
        </Card>

        {/* Coding streak */}
        <Card className="p-5">
          <SectionHeader title="🔥 Coding Streak" action={() => setPage("practice")} actionLabel="Practice" />
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl font-700" style={{ fontWeight: 700, color: "#f59e0b" }}>5</div>
            <div>
              <p className="text-sm font-medium text-gray-700">day streak</p>
              <p className="text-xs text-gray-500">Best: 12 days</p>
            </div>
          </div>
          <div className="flex gap-1 mb-4">
            {["M","T","W","T","F","S","S"].map((d, i) => (
              <div key={i} className="flex-1 text-center">
                <div className="w-full aspect-square rounded-lg mb-1" style={{ background: streak[i] ? "#f59e0b" : "#f1f5f9" }} />
                <span className="text-xs text-gray-400">{d}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">This week</span>
            <span className="font-600" style={{ fontWeight: 600, color: P }}>5/7 problems</span>
          </div>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "71%", background: "linear-gradient(90deg,#f59e0b,#f97316)" }} />
          </div>
        </Card>
      </div>

      {/* Active Applications */}
      <Card className="p-5">
        <SectionHeader title="📋 Active Applications" action={() => setPage("applications")} actionLabel="View all" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Company", "Role", "Applied", "Status", "Action"].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {APPS.slice(0, 5).map(a => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <LogoCircle letter={a.logo} color={a.color} size={28} />
                      <span className="font-medium text-gray-800">{a.company}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-600">{a.role}</td>
                  <td className="py-3 px-3 text-gray-500">{a.date}</td>
                  <td className="py-3 px-3"><Bdg label={a.status} /></td>
                  <td className="py-3 px-3">
                    <Btn size="sm" variant={a.status === "Interview Scheduled" ? "primary" : "secondary"}>
                      {a.status === "Interview Scheduled" ? "Prepare" : a.status === "Test Scheduled" ? "Take Test" : "Track"}
                    </Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recommended Jobs */}
      <div>
        <SectionHeader title="💼 Recommended Jobs" action={() => setPage("jobs")} actionLabel="Browse all jobs" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {JOBS.slice(0, 3).map(j => (
            <Card key={j.id} className="p-4 hl cursor-pointer" onClick={() => setPage("jobs")}>
              <div className="flex items-start gap-3 mb-3">
                <LogoCircle letter={j.logo} color={j.color} size={42} />
                <div className="flex-1 min-w-0">
                  <p className="font-600 text-gray-900" style={{ fontWeight: 600, fontSize: 14 }}>{j.role}</p>
                  <p className="text-xs text-gray-500">{j.company} · {j.location}</p>
                </div>
                <span className="text-green-500"><CheckCircle size={16} /></span>
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {j.skills.slice(0, 3).map(s => <Tag key={s} label={s} />)}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-600 text-sm" style={{ fontWeight: 600, color: P }}>{j.ctc}</span>
                <span className="text-xs text-red-500 flex items-center gap-1"><Clock size={10} /> {j.deadline}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Tip + Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5" style={{ background: "linear-gradient(135deg,#f0f0ff,#fdf4ff)", border: "1px solid #e0e7ff" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
              <Brain size={16} className="text-white" />
            </div>
            <span className="font-600 text-sm" style={{ fontWeight: 600, color: P }}>AI Tip of the Day</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">Your profile is missing 2 projects — recruiters at Google prioritize candidates with live project links. Add your GitHub projects to increase your ATS score by ~12 points.</p>
          <Btn size="sm" className="mt-3" icon={Sparkles}>Ask AI for help</Btn>
        </Card>
        <Card className="p-5">
          <SectionHeader title="🔔 Recent Notifications" action={() => setPage("notifications")} actionLabel="View all" />
          <div className="space-y-3">
            {NOTIFS.slice(0, 3).map(n => (
              <div key={n.id} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: n.color + "20" }}>
                  <n.icon size={13} style={{ color: n.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800">{n.title}</p>
                  <p className="text-xs text-gray-400">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default StudentDashboard;