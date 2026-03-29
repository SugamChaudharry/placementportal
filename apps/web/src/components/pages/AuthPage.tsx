import { useState } from "react";
import { GraduationCap, Mail, Lock, User, Building2, Shield } from "lucide-react";

// Assuming these are imported from shared files
// import { P } from "@/lib/constants";
// import { Card, Input, Btn } from "@/components/ui";

const P = "#4f46e5"; // temporary, move to constants

// Temporary definitions, move to ui components
type CardProps = { children: React.ReactNode; className?: string; style?: React.CSSProperties };
function Card({ children, className = "", style }: CardProps) {
  return <div className={`bg-white rounded-xl ${className}`} style={style}>{children}</div>;
}

type InputProps = {
  placeholder?: string;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
  className?: string;
  prefix?: React.ComponentType<{ size?: string | number }>;
};
function Input({ placeholder, value, onChange, type = "text", className = "", prefix: Prefix }: InputProps) {
  return (
    <div className="relative">
      {Prefix && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Prefix size={15} /></div>}
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        className={`w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all ${Prefix ? "pl-9" : "pl-3"} py-2 ${className}`}
        style={{ "--tw-ring-color": P } as React.CSSProperties & { [key: string]: any }} />
    </div>
  );
}

type BtnProps = {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  icon?: React.ComponentType<{ size?: string | number }>;
};
function Btn({ children, variant = "primary", onClick, className = "", size = "md", disabled = false, icon: Icon }: BtnProps) {
  const base = "inline-flex items-center gap-1.5 rounded-lg font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";
  const sz = size === "sm" ? "px-3 py-1.5 text-xs" : size === "lg" ? "px-5 py-2.5 text-sm" : "px-4 py-2 text-sm";
  const variants: Record<string, string> = {
    primary: "text-white hover:opacity-90 active:scale-95",
    secondary: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 active:scale-95",
    ghost: "text-gray-700 hover:bg-gray-50 active:scale-95",
  };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`${base} ${sz} ${variants[variant]} ${className}`}
      style={variant === "primary" ? { background: P } : {}}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

export default function AuthPage({ onLogin }: { onLogin: (role: string) => void }) {
  const [tab, setTab] = useState("login");
  const [selectedRole, setRole] = useState("student");
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("arjun@iit.ac.in");
  const [pass, setPass] = useState("password123");
  const [passStrength, setPassStrength] = useState(0);

  const checkStrength = (p: string) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    setPassStrength(s);
  };

  const roles = [
    { id: "student", icon: GraduationCap, title: "Student", desc: "Looking for placements & internships" },
    { id: "recruiter", icon: Building2, title: "Recruiter", desc: "Hire from campus" },
    { id: "admin", icon: Shield, title: "Admin", desc: "Placement cell coordinator" },
  ];

  const strengthColors = ["#d1d5db", "#ef4444", "#f59e0b", "#10b981", "#059669"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg,#eef2ff 0%,#f0f9ff 50%,#fdf4ff 100%)" }}>
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute" style={{ width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(79,70,229,.08),transparent)", top: -200, right: -100 }} />
        <div className="absolute" style={{ width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,.06),transparent)", bottom: -150, left: -50 }} />
      </div>

      <div className="w-full max-w-md su">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-lg"
            style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
            <GraduationCap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-700" style={{ fontWeight: 700, color: "#1e293b" }}>PlaceMe</h1>
          <p className="text-sm text-gray-500 mt-1">Campus Placement Portal</p>
        </div>

        <Card className="p-7 shadow-xl" style={{ border: "1px solid rgba(79,70,229,.1)" }}>
          {/* Tabs */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            {["login", "register"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="flex-1 py-2 text-sm rounded-md capitalize font-medium transition-all"
                style={{ background: tab === t ? "#fff" : "transparent", color: tab === t ? "#1e293b" : "#6b7280", fontWeight: tab === t ? 600 : 400, boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,.1)" : "none" }}>
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {tab === "login" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Email address</label>
                <Input placeholder="you@college.edu" value={email} onChange={e => setEmail(e.target.value)} prefix={Mail} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-700">Password</label>
                  <button className="text-xs" style={{ color: P }}>Forgot password?</button>
                </div>
                <div className="relative">
                  <Input placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} type={showPass ? "text" : "password"} prefix={Lock} />
                  <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" id="rem" />
                <label htmlFor="rem" className="text-sm text-gray-600">Remember me</label>
              </div>
              <Btn onClick={() => onLogin(selectedRole)} className="w-full justify-center" size="lg">Sign in to your account</Btn>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or continue with</span></div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <div className="w-5 h-5 rounded-full" style={{ background: "#4285F4" }} />
                Sign in with Google
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Full name</label>
                <Input placeholder="Arjun Kumar" prefix={User} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
                <Input placeholder="you@college.edu" prefix={Mail} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
                <Input placeholder="Min. 8 characters" type="password" prefix={Lock} onChange={e => checkStrength(e.target.value)} />
                {passStrength > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="h-1 flex-1 rounded-full transition-all" style={{ background: i <= passStrength ? strengthColors[passStrength] : "#e5e7eb" }} />
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: strengthColors[passStrength] }}>{strengthLabels[passStrength]}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">I am a...</label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map(r => (
                    <button key={r.id} onClick={() => setRole(r.id)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-center"
                      style={{ borderColor: selectedRole === r.id ? P : "#e5e7eb", background: selectedRole === r.id ? "#eef2ff" : "#fff" }}>
                      <r.icon size={20} style={{ color: selectedRole === r.id ? P : "#9ca3af" }} />
                      <span className="text-xs font-medium" style={{ color: selectedRole === r.id ? P : "#6b7280" }}>{r.title}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" className="rounded mt-0.5" id="terms" />
                <label htmlFor="terms" className="text-xs text-gray-500">I agree to the <span style={{ color: P }}>Terms of Service</span> and <span style={{ color: P }}>Privacy Policy</span></label>
              </div>
              <Btn onClick={() => onLogin(selectedRole)} className="w-full justify-center" size="lg">Create account</Btn>
            </div>
          )}
        </Card>
        <p className="text-center text-xs text-gray-400 mt-6">© 2025 PlaceMe · Powered by Anthropic Claude</p>
      </div>
    </div>
  );
}