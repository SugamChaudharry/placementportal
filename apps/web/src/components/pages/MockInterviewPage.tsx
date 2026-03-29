"use client";
import { useState, useEffect } from "react";
import { Brain, Play, Building2, Mic, CheckCircle, AlertTriangle, RefreshCw, Share2 } from "lucide-react";

// Temporary component definitions (to be moved to shared files later)
const P = "#4f46e5";
const Card = ({ children, className = "", ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <div className={`bg-white rounded-xl border border-gray-100 shadow-sm ${className}`} {...props}>{children}</div>
);
type BtnVariant = "primary" | "secondary" | "danger" | "ghost";
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
    danger: "bg-red-600 text-white hover:bg-red-700",
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
const Input = ({ placeholder, prefix: Prefix, ...props }: { placeholder?: string; prefix?: React.ComponentType<any>; [key: string]: any }) => (
  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2" style={{ "--tw-ring-color": P } as React.CSSProperties & { [key: string]: any }}>
    {Prefix && <Prefix size={16} className="text-gray-400" />}
    <input className="flex-1 text-sm focus:outline-none" placeholder={placeholder} {...props} />
  </div>
);

// Mock chart components (would need recharts in real implementation)
const ResponsiveContainer = ({ children, width, height }: { children: React.ReactNode; width: string; height: number }) => (
  <div style={{ width, height }} className="flex items-center justify-center bg-gray-50 rounded-lg">
    <p className="text-gray-500 text-sm">Chart visualization would render here</p>
  </div>
);
const RadarChart = ({ children, data }: { children: React.ReactNode; data: any[] }) => <div>{children}</div>;
const PolarGrid = ({ stroke }: { stroke: string }) => null;
const PolarAngleAxis = ({ dataKey, tick }: { dataKey: string; tick: any }) => null;
const Radar = ({ dataKey, fill, fillOpacity, stroke, strokeWidth }: { dataKey: string; fill: string; fillOpacity: number; stroke: string; strokeWidth: number }) => null;
const Tooltip = () => null;

function MockInterviewPage() {
  const [phase, setPhase] = useState("setup"); // setup, active, feedback
  const [role, setRole] = useState("Software Engineer");
  const [answer, setAnswer] = useState("");
  const [qIdx, setQIdx] = useState(0);
  const [timer, setTimer] = useState(1799);
  const questions = [
    "Tell me about yourself and your key projects.",
    "Design a URL shortener system like bit.ly. What are the key components?",
    "Given an array of integers, find all pairs that sum to a target value. What's the optimal approach?",
    "Tell me about a challenging technical problem you solved. Walk me through your thought process.",
  ];

  useEffect(() => {
    if (phase !== "active") return;
    const id = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(id);
  }, [phase]);

  const fmt = (t: number) => `${String(Math.floor(t/60)).padStart(2,"0")}:${String(t%60).padStart(2,"0")}`;

  if (phase === "setup") return (
    <div className="su max-w-xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
          <Brain size={32} className="text-white" />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>AI Mock Interview</h1>
        <p className="text-gray-500 mt-1">Get realistic interview practice powered by Claude AI</p>
      </div>
      <Card className="p-6 space-y-5">
        {(
          [
            ["Job Role", ["Software Engineer","Data Analyst","Product Manager","ML Engineer"], role, setRole] as [string, string[], string, (val: string) => void],
            ["Interview Type", ["Technical","HR","Mixed"], undefined, undefined] as [string, string[], undefined, undefined],
            ["Difficulty", ["Easy","Medium","Hard"], undefined, undefined] as [string, string[], undefined, undefined],
            ["Duration", ["15 min","30 min","45 min"], undefined, undefined] as [string, string[], undefined, undefined]
          ] as [string, string[], string?, ((val: string) => void)?][]
        ).map(([label, opts, val, setter]) => (
          <div key={label}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="flex gap-2 flex-wrap">
              {opts.map(o => (
                <button key={o} onClick={() => setter?.(o)}
                  className="px-3 py-1.5 rounded-lg border text-sm transition-all"
                  style={{ borderColor: val === o ? P : "#e5e7eb", background: val === o ? "#eef2ff" : "#fff", color: val === o ? P : "#374151", fontWeight: val === o ? 600 : 400 }}>
                  {o}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Company (optional)</label>
          <Input placeholder="e.g. Google, Amazon, Flipkart..." prefix={Building2} />
        </div>
        <Btn className="w-full justify-center" size="lg" icon={Play} onClick={() => setPhase("active")}>
          Start Interview
        </Btn>
      </Card>
    </div>
  );

  if (phase === "active") return (
    <div className="su flex gap-5 h-full" style={{ height: "calc(100vh - 120px)" }}>
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {/* Header */}
        <Card className="flex items-center px-5 py-3 gap-4">
          <div className="flex items-center gap-2">
            <Brain size={18} style={{ color: P }} />
            <span className="font-600 text-sm" style={{ fontWeight: 600 }}>AI Interviewer · {role}</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="code text-lg font-700" style={{ fontWeight: 700, color: timer < 300 ? "#ef4444" : "#1e293b" }}>{fmt(timer)}</div>
            <Btn variant="danger" size="sm" onClick={() => setPhase("feedback")}>End Interview</Btn>
          </div>
        </Card>

        {/* Question progress */}
        <div className="flex gap-2">
          {questions.map((_, i) => (
            <button key={i} onClick={() => setQIdx(i)}
              className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
              style={{ background: i < qIdx ? "#d1fae5" : i === qIdx ? P : "#f1f5f9", color: i <= qIdx ? "#fff" : "#9ca3af" }}>
              Q{i + 1}
            </button>
          ))}
        </div>

        {/* AI Question */}
        <Card className="p-5" style={{ background: "linear-gradient(135deg,#eef2ff,#fdf4ff)" }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
              <Brain size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: P }}>Question {qIdx + 1} of {questions.length}</p>
              <p className="text-gray-800 leading-relaxed">{questions[qIdx]}</p>
            </div>
          </div>
        </Card>

        {/* Answer */}
        <Card className="flex-1 p-5 flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">Your Answer</label>
          <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Type your answer here..."
            className="flex-1 w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 resize-none"
            style={{ "--tw-ring-color": P } as React.CSSProperties & { [key: string]: any }} />
          <div className="flex gap-2 mt-3">
            <Btn className="flex-1 justify-center" onClick={() => { setQIdx(q => Math.min(q + 1, questions.length - 1)); setAnswer(""); }}>
              {qIdx < questions.length - 1 ? "Next Question →" : "Submit All"}
            </Btn>
            <Btn variant="secondary" icon={Mic}>Voice Mode</Btn>
          </div>
        </Card>
      </div>
    </div>
  );

  // Feedback
  const radarData = [
    { subject: "Communication", A: 78 }, { subject: "Technical", A: 82 }, { subject: "Problem Solving", A: 74 },
    { subject: "Confidence", A: 68 }, { subject: "Clarity", A: 80 },
  ];
  return (
    <div className="su max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <div className="text-6xl font-700 mb-2" style={{ fontWeight: 700, color: P }}>78</div>
        <p className="text-xl font-600" style={{ fontWeight: 600 }}>Score — Grade B+</p>
        <p className="text-gray-500">You performed better than 65% of candidates for this role</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <Card className="p-5">
          <p className="font-600 mb-3" style={{ fontWeight: 600 }}>Performance Breakdown</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <Radar dataKey="A" fill={P} fillOpacity={0.2} stroke={P} strokeWidth={2} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <div className="mb-4">
            <p className="font-600 mb-2" style={{ fontWeight: 600 }}>✅ Key Strengths</p>
            {["Strong technical fundamentals in algorithms","Clear problem-solving approach with good examples","Confident delivery in most responses"].map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-700 mb-2">
                <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />{s}
              </div>
            ))}
          </div>
          <div>
            <p className="font-600 mb-2" style={{ fontWeight: 600 }}>📈 Areas to Improve</p>
            {["System design answers need more depth on scalability","Quantify project impact with metrics","Work on more concise explanations for behavioral questions"].map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-700 mb-2">
                <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />{s}
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="flex gap-3 justify-center">
        <Btn onClick={() => setPhase("setup")} icon={RefreshCw}>Retake Interview</Btn>
        <Btn variant="secondary" icon={Share2}>Share Report</Btn>
      </div>
    </div>
  );
}

export default MockInterviewPage;