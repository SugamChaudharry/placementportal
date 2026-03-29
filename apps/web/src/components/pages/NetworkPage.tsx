"use client";
import { TrendingUp, Users, Share2, Award } from "lucide-react";

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
const Av = ({ name, size = 40, className = "" }: { name: string; size?: number; className?: string }) => (
  <div className={`rounded-full flex items-center justify-center text-white font-medium text-sm ${className}`} style={{ width: size, height: size, background: P }}>
    {name.split(" ").map(n => n[0]).join("").toUpperCase()}
  </div>
);
const LogoCircle = ({ letter, color, size = 40 }: { letter: string; color: string; size?: number }) => (
  <div className="rounded-full flex items-center justify-center text-white font-bold" style={{ width: size, height: size, background: color, fontSize: size * 0.4 }}>
    {letter}
  </div>
);
const SectionHeader = ({ title }: { title: string }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
  </div>
);

function NetworkPage() {
  const alumni = [
    { name: "Priya Sharma", batch: "2023", company: "Google", role: "SDE-2", color: "#4285F4" },
    { name: "Rahul Gupta", batch: "2022", company: "Microsoft", role: "SDE-3", color: "#00A4EF" },
    { name: "Ananya Verma", batch: "2023", company: "Amazon", role: "SDE-1", color: "#FF9900" },
    { name: "Vikram Patel", batch: "2021", company: "Flipkart", role: "Senior SDE", color: "#2874F0" },
    { name: "Neha Singh", batch: "2022", company: "Zomato", role: "PM", color: "#E23744" },
    { name: "Aryan Kumar", batch: "2023", company: "Groww", role: "Backend Engineer", color: "#00D09C" },
  ];

  return (
    <div className="su flex gap-5">
      <div className="w-64 flex-shrink-0 space-y-4">
        <Card className="p-5">
          <p className="font-600 text-sm mb-4" style={{ fontWeight: 600 }}>Your Network</p>
          {(
            [
              ["Profile views this week", 24, TrendingUp, "#4f46e5"],
              ["Connections", 18, Users, "#0891b2"],
              ["Referrals sent", 3, Share2, "#f59e0b"],
              ["Referrals received", 1, Award, "#10b981"]
            ] as [string, number, React.ComponentType<{ size?: string | number; style?: React.CSSProperties }>, string][]
          ).map(([l, v, Icon, c]) => (
            <div key={l} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2"><Icon size={14} style={{ color: c }} /><span className="text-xs text-gray-600">{l}</span></div>
              <span className="font-600 text-sm" style={{ fontWeight: 600, color: "#1e293b" }}>{v}</span>
            </div>
          ))}
        </Card>
        <Card className="p-5">
          <p className="font-600 text-sm mb-3" style={{ fontWeight: 600 }}>Filter Alumni</p>
          {(
            [
              ["Company", ["All", "Google", "Microsoft", "Amazon"]],
              ["Batch", ["All", "2023", "2022", "2021"]]
            ] as [string, string[]][]
          ).map(([label, opts]) => (
            <div key={label} className="mb-3">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <select className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none">
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </Card>
      </div>
      <div className="flex-1">
        <SectionHeader title="Alumni Network" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {alumni.map((a, i) => (
            <Card key={i} className="p-4 text-center hl">
              <Av name={a.name} size={52} className="mx-auto mb-2" />
              <p className="font-600 text-sm" style={{ fontWeight: 600 }}>{a.name}</p>
              <p className="text-xs text-gray-500">Batch of {a.batch}</p>
              <div className="flex items-center justify-center gap-1 mt-1 mb-3">
                <LogoCircle letter={a.company[0]} color={a.color} size={16} />
                <span className="text-xs text-gray-600">{a.company} · {a.role}</span>
              </div>
              <div className="flex gap-2">
                <Btn size="sm" variant="secondary" className="flex-1 justify-center">Connect</Btn>
                <Btn size="sm" className="flex-1 justify-center" icon={Share2}>Referral</Btn>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NetworkPage;