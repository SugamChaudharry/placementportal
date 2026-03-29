"use client";
import { useState } from "react";
import {
  Search,
  CheckCircle,
  Flame,
  Play,
  RefreshCw,
  Brain,
  X,
} from "lucide-react";

// ─── Constants ──────────────────────────────────────────────────────────────
const P = "#4f46e5";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const PRACTICE_PROBLEMS = [
  { id: 1, title: "Two Sum", difficulty: "Easy", acceptance: "72%", solved: true, tags: ["Array", "Hash Map"], companies: ["G", "F", "A"] },
  { id: 2, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", acceptance: "34%", solved: true, tags: ["String", "Sliding Window"], companies: ["A", "M"] },
  { id: 3, title: "Median of Two Sorted Arrays", difficulty: "Hard", acceptance: "21%", solved: false, tags: ["Binary Search", "Divide & Conquer"], companies: ["G"] },
  { id: 4, title: "Container With Most Water", difficulty: "Medium", acceptance: "48%", solved: false, tags: ["Two Pointers", "Array"], companies: ["F", "A"] },
  { id: 5, title: "Valid Parentheses", difficulty: "Easy", acceptance: "65%", solved: true, tags: ["Stack", "String"], companies: ["G", "M", "A", "F"] },
  { id: 6, title: "Merge K Sorted Lists", difficulty: "Hard", acceptance: "18%", solved: false, tags: ["Heap", "Linked List"], companies: ["A"] },
  { id: 7, title: "Coin Change", difficulty: "Medium", acceptance: "41%", solved: false, tags: ["DP", "BFS"], companies: ["G", "M"] },
];

// ─── Atom Components ─────────────────────────────────────────────────────────
type AvProps = {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
};
function Av({ name = "?", size = 32, color, className = "" }: AvProps) {
  const colors = ["#4f46e5","#7c3aed","#2563eb","#0891b2","#059669","#d97706","#dc2626"];
  const bg = color || colors[name.charCodeAt(0) % colors.length];
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className={`flex items-center justify-center rounded-full font-semibold text-white flex-shrink-0 ${className}`}
      style={{ width: size, height: size, background: bg, fontSize: size * 0.38 }}>
      {initials}
    </div>
  );
}

type BdgProps = {
  label: keyof typeof STATUSES | string;
  style?: React.CSSProperties;
};
function Bdg({ label, style = {} }: BdgProps) {
  const s = (STATUSES as Record<string, { bg: string; text: string }>)[label] || { bg: "#f1f5f9", text: "#64748b" };
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ background: s.bg, color: s.text, ...style }}>
      {label}
    </span>
  );
}

type BtnVariant = "primary" | "secondary" | "danger" | "ghost" | "success";
type BtnSize = "sm" | "md" | "lg";
type BtnProps = {
  children?: React.ReactNode;
  variant?: BtnVariant;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  size?: BtnSize;
  disabled?: boolean;
  icon?: React.ComponentType<{ size?: string | number }>;
};
function Btn({ children, variant = "primary", onClick, className = "", size = "md", disabled = false, icon: Icon }: BtnProps) {
  const base = "inline-flex items-center gap-1.5 rounded-lg font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";
  const sz = size === "sm" ? "px-3 py-1.5 text-xs" : size === "lg" ? "px-5 py-2.5 text-sm" : "px-4 py-2 text-sm";
  const variants: Record<BtnVariant, string> = {
    primary: "text-white hover:opacity-90 active:scale-95",
    secondary: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 active:scale-95",
    danger: "text-white bg-red-600 hover:bg-red-700 active:scale-95",
    ghost: "text-gray-600 hover:bg-gray-100 active:scale-95",
    success: "text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95",
  };
  return (
    <button disabled={disabled} onClick={onClick}
      className={`${base} ${sz} ${variants[variant]} ${className}`}
      style={variant === "primary" ? { background: "linear-gradient(135deg,#4f46e5,#6366f1)" } : {}}>
      {Icon && <Icon size={14} />}{children}
    </button>
  );
}

type CardProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};
function Card({ children, className = "", style = {}, onClick }: CardProps) {
  return (
    <div onClick={onClick}
      className={`bg-white rounded-xl border border-gray-100 shadow-sm ${className}`}
      style={style}>
      {children}
    </div>
  );
}

type InputProps = {
  placeholder?: string;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
  className?: string;
  prefix?: React.ComponentType<{ size?: string | number }>;
  suffix?: React.ComponentType<{ size?: string | number }>;
};
function Input({ placeholder, value, onChange, type = "text", className = "", prefix: Prefix, suffix: Suffix }: InputProps) {
  // Allow custom CSS variables in style
  const inputStyle: React.CSSProperties & { [key: string]: any } = { "--tw-ring-color": "#4f46e5" };
  return (
    <div className="relative">
      {Prefix && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Prefix size={15} /></div>}
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        className={`w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all ${Prefix ? "pl-9" : "pl-3"} ${Suffix ? "pr-9" : "pr-3"} py-2 ${className}`}
        style={inputStyle} />
      {Suffix && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><Suffix size={15} /></div>}
    </div>
  );
}

type TagProps = {
  label: string;
  onRemove?: () => void;
  color?: string;
  textColor?: string;
};
function Tag({ label, onRemove, color = "#e0e7ff", textColor = "#4f46e5" }: TagProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: color, color: textColor }}>
      {label}
      {onRemove && <button onClick={onRemove} className="hover:opacity-70"><X size={10} /></button>}
    </span>
  );
}

type LogoCircleProps = {
  letter: string;
  color: string;
  size?: number;
  className?: string;
};
function LogoCircle({ letter, color, size = 36, className = "" }: LogoCircleProps) {
  return (
    <div className={`rounded-lg flex items-center justify-center font-700 text-white flex-shrink-0 ${className}`}
      style={{ width: size, height: size, background: color, fontWeight: 700, fontSize: size * 0.42 }}>
      {letter}
    </div>
  );
}

// ─── Status Constants ────────────────────────────────────────────────────────
const STATUSES = {
  "Applied": { bg: "#dbeafe", text: "#1e40af" },
  "Shortlisted": { bg: "#fef3c7", text: "#92400e" },
  "Interview Scheduled": { bg: "#ddd6fe", text: "#5b21b6" },
  "Test Completed": { bg: "#fed7d7", text: "#b91c1c" },
  "Rejected": { bg: "#fee2e2", text: "#dc2626" },
  "Offered": { bg: "#d1fae5", text: "#065f46" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRACTICE ARENA
// ═══════════════════════════════════════════════════════════════════════════════
export default function PracticeArenaPage() {
  const [selectedProblem, setSelectedProblem] = useState(PRACTICE_PROBLEMS[1]);
  const [code, setCode] = useState(`def lengthOfLongestSubstring(s: str) -> int:\n    char_map = {}\n    left = 0\n    max_len = 0\n    \n    for right, char in enumerate(s):\n        if char in char_map and char_map[char] >= left:\n            left = char_map[char] + 1\n        char_map[char] = right\n        max_len = max(max_len, right - left + 1)\n    \n    return max_len`);
  const [activeTab, setActiveTab] = useState("problem");
  const [lang, setLang] = useState("Python");
  const [output, setOutput] = useState<{ passed: number; total: number; time: string; memory: string; status: string } | null>(null);
  const [filterDiff, setFilterDiff] = useState("All");

  const diffColors: { [key: string]: string } = { Easy: "#10b981", Medium: "#f59e0b", Hard: "#ef4444" };

  const runCode = () => {
    setOutput({ passed: 3, total: 3, time: "44ms", memory: "14.3 MB", status: "Accepted" });
  };

  return (
    <div className="su flex gap-4 h-full" style={{ height: "calc(100vh - 120px)", minHeight: 500 }}>
      {/* Problem list */}
      <Card className="w-64 flex-shrink-0 flex flex-col">
        <div className="p-3 border-b border-gray-100">
          <Input placeholder="Search problems..." prefix={Search} />
          <div className="flex gap-1 mt-2 flex-wrap">
            {["All","Easy","Medium","Hard"].map(d => (
              <button key={d} onClick={() => setFilterDiff(d)}
                className="px-2 py-1 rounded-full text-xs font-medium transition-all"
                style={{ background: filterDiff === d ? (diffColors[d] || P) : "#f1f5f9", color: filterDiff === d ? "#fff" : "#6b7280" }}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {PRACTICE_PROBLEMS.filter(p => filterDiff === "All" || p.difficulty === filterDiff).map(p => (
            <button key={p.id} onClick={() => setSelectedProblem(p)}
              className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 text-left border-b border-gray-50 transition-colors"
              style={{ background: selectedProblem?.id === p.id ? "#eef2ff" : "" }}>
              <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                {p.solved ? <CheckCircle size={16} className="text-emerald-500" /> : <div className="w-3 h-3 rounded-full border-2 border-gray-300" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">{p.id}. {p.title}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-xs" style={{ color: diffColors[p.difficulty] }}>{p.difficulty}</span>
                  <span className="text-xs text-gray-400">· {p.acceptance}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        {/* Gamification */}
        <div className="p-3 border-t border-gray-100" style={{ background: "linear-gradient(135deg,#fef3c7,#fff7ed)" }}>
          <div className="flex items-center gap-2 mb-1">
            <Flame size={14} style={{ color: "#f59e0b" }} />
            <span className="text-xs font-600" style={{ fontWeight: 600, color: "#92400e" }}>5-day streak</span>
            <span className="ml-auto text-xs text-gray-500">Rank: Top 12%</span>
          </div>
          <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "68%", background: "linear-gradient(90deg,#f59e0b,#f97316)" }} />
          </div>
          <p className="text-xs text-gray-500 mt-1">342 / 500 XP to Level 8</p>
        </div>
      </Card>

      {/* Problem + Editor */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        {/* Tabs */}
        <Card className="p-1 flex gap-0">
          {["problem","solution","discuss"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className="flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all"
              style={{ background: activeTab === t ? P : "transparent", color: activeTab === t ? "#fff" : "#6b7280" }}>
              {t}
            </button>
          ))}
        </Card>

        <Card className="p-5 flex-1 overflow-y-auto">
          {activeTab === "problem" && selectedProblem && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-700" style={{ fontWeight: 700, fontSize: 18 }}>{selectedProblem.id}. {selectedProblem.title}</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ background: diffColors[selectedProblem.difficulty] }}>{selectedProblem.difficulty}</span>
                <span className="text-sm text-gray-500">Acceptance: {selectedProblem.acceptance}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">Given a string <code className="code bg-gray-100 px-1.5 py-0.5 rounded text-xs">s</code>, find the length of the <strong>longest substring</strong> without repeating characters.</p>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2">EXAMPLE 1</p>
                <div className="code text-xs space-y-1">
                  <p><span className="text-gray-400">Input:</span> <span style={{ color: P }}>s = "abcabcbb"</span></p>
                  <p><span className="text-gray-400">Output:</span> <span className="text-emerald-600">3</span></p>
                  <p><span className="text-gray-400">Explanation:</span> "abc" has length 3.</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {selectedProblem.tags.map(t => <Tag key={t} label={t} color="#e0e7ff" textColor="#4338ca" />)}
              </div>
              <div className="mt-3 flex gap-2">
                {["Google","Amazon","Microsoft"].slice(0, selectedProblem.companies.length).map((c, i) => (
                  <div key={c} className="flex items-center gap-1 text-xs text-gray-500">
                    <LogoCircle letter={selectedProblem.companies[i]} color={["#4285F4","#FF9900","#00A4EF"][i]} size={16} />
                    {c}
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* Editor */}
        <Card className="flex flex-col" style={{ height: 280 }}>
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100">
            <select value={lang} onChange={e => setLang(e.target.value)} className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none">
              {["Python","JavaScript","Java","C++","Go"].map(l => <option key={l}>{l}</option>)}
            </select>
            <button className="text-xs text-gray-500 hover:text-gray-700">Dark</button>
            <button className="text-xs text-gray-500 hover:text-gray-700"><RefreshCw size={11} /> Reset</button>
            <div className="ml-auto flex gap-2">
              <Btn size="sm" variant="secondary" onClick={runCode} icon={Play}>Run</Btn>
              <Btn size="sm" onClick={runCode}>Submit</Btn>
            </div>
          </div>
          <div className="flex-1 bg-gray-950 rounded-b-xl p-4 overflow-auto">
            <pre className="code text-xs text-green-400 leading-relaxed whitespace-pre-wrap">{code}</pre>
          </div>
        </Card>
      </div>

      {/* AI Feedback panel */}
      <Card className="w-56 flex-shrink-0 flex flex-col">
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Brain size={16} style={{ color: P }} />
            <span className="text-xs font-600" style={{ fontWeight: 600 }}>AI Feedback</span>
          </div>
        </div>
        <div className="flex-1 p-3 overflow-y-auto">
          {output ? (
            <div className="space-y-3">
              <div className="p-2 rounded-lg" style={{ background: "#d1fae5" }}>
                <p className="text-xs font-600 text-emerald-700" style={{ fontWeight: 600 }}>✓ {output.status}</p>
                <p className="text-xs text-emerald-600">{output.passed}/{output.total} test cases · {output.time}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">COMPLEXITY</p>
                <p className="text-xs text-gray-700">Time: <strong>O(n)</strong> ✓</p>
                <p className="text-xs text-gray-700">Space: <strong>O(min(n,m))</strong></p>
              </div>
              <div className="p-2 rounded-lg bg-amber-50">
                <p className="text-xs text-amber-700">💡 Consider using a deque for slightly better memory in edge cases.</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Brain size={28} className="mx-auto mb-2 text-gray-300" />
              <p className="text-xs text-gray-400">Run your code to get AI feedback</p>
            </div>
          )}
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-500 mb-2">HINTS</p>
            {["Use a sliding window approach", "Track character positions in a hash map"].map((h, i) => (
              <div key={i} className="p-2 mb-2 rounded-lg bg-blue-50 text-xs text-blue-700 cursor-pointer hover:bg-blue-100">
                💡 {h}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}