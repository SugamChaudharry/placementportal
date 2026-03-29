"use client";

import { useState } from "react";
import {
  Brain,
  CheckCircle,
  Flame,
  Play,
  RefreshCw,
  Search,
} from "lucide-react";
import { Btn, Card, Input, LogoCircle, Tag } from "@/placement-portal/components/atoms";
import { PRIMARY } from "@/placement-portal/constants";
import { PRACTICE_PROBLEMS } from "@/placement-portal/mock-data";

export function PracticeArenaPage() {
  const [selectedProblem, setSelectedProblem] = useState(PRACTICE_PROBLEMS[1]);
  const [code] = useState(`def lengthOfLongestSubstring(s: str) -> int:\n    char_map = {}\n    left = 0\n    max_len = 0\n    \n    for right, char in enumerate(s):\n        if char in char_map and char_map[char] >= left:\n            left = char_map[char] + 1\n        char_map[char] = right\n        max_len = max(max_len, right - left + 1)\n    \n    return max_len`);
  const [activeTab, setActiveTab] = useState("problem");
  const [lang, setLang] = useState("Python");
  const [output, setOutput] = useState<{ passed: number; total: number; time: string; memory: string; status: string } | null>(null);
  const [filterDiff, setFilterDiff] = useState("All");

  const diffColors: Record<string, string> = { Easy: "#10b981", Medium: "#f59e0b", Hard: "#ef4444" };

  const runCode = () => {
    setOutput({ passed: 3, total: 3, time: "44ms", memory: "14.3 MB", status: "Accepted" });
  };

  return (
    <div className="su flex gap-4 h-full" style={{ height: "calc(100vh - 120px)", minHeight: 500 }}>
      <Card className="w-64 flex-shrink-0 flex flex-col">
        <div className="p-3 border-b border-gray-100">
          <Input placeholder="Search problems..." prefix={Search} />
          <div className="flex gap-1 mt-2 flex-wrap">
            {["All", "Easy", "Medium", "Hard"].map((d) => (
              <button
                key={d}
                onClick={() => setFilterDiff(d)}
                className="px-2 py-1 rounded-full text-xs font-medium transition-all"
                style={{ background: filterDiff === d ? diffColors[d] || PRIMARY : "#f1f5f9", color: filterDiff === d ? "#fff" : "#6b7280" }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {PRACTICE_PROBLEMS.filter((p) => filterDiff === "All" || p.difficulty === filterDiff).map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProblem(p)}
              className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 text-left border-b border-gray-50 transition-colors"
              style={{ background: selectedProblem?.id === p.id ? "#eef2ff" : "" }}
            >
              <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                {p.solved ? <CheckCircle size={16} className="text-emerald-500" /> : <div className="w-3 h-3 rounded-full border-2 border-gray-300" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">
                  {p.id}. {p.title}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-xs" style={{ color: diffColors[p.difficulty] }}>
                    {p.difficulty}
                  </span>
                  <span className="text-xs text-gray-400">· {p.acceptance}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-gray-100" style={{ background: "linear-gradient(135deg,#fef3c7,#fff7ed)" }}>
          <div className="flex items-center gap-2 mb-1">
            <Flame size={14} style={{ color: "#f59e0b" }} />
            <span className="text-xs font-600" style={{ fontWeight: 600, color: "#92400e" }}>
              5-day streak
            </span>
            <span className="ml-auto text-xs text-gray-500">Rank: Top 12%</span>
          </div>
          <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "68%", background: "linear-gradient(90deg,#f59e0b,#f97316)" }} />
          </div>
          <p className="text-xs text-gray-500 mt-1">342 / 500 XP to Level 8</p>
        </div>
      </Card>

      <div className="flex-1 min-w-0 flex flex-col gap-3">
        <Card className="p-1 flex gap-0">
          {["problem", "solution", "discuss"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className="flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all"
              style={{ background: activeTab === t ? PRIMARY : "transparent", color: activeTab === t ? "#fff" : "#6b7280" }}
            >
              {t}
            </button>
          ))}
        </Card>

        <Card className="p-5 flex-1 overflow-y-auto">
          {activeTab === "problem" && selectedProblem && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-700" style={{ fontWeight: 700, fontSize: 18 }}>
                  {selectedProblem.id}. {selectedProblem.title}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ background: diffColors[selectedProblem.difficulty] }}>
                  {selectedProblem.difficulty}
                </span>
                <span className="text-sm text-gray-500">Acceptance: {selectedProblem.acceptance}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                Given a string <code className="code bg-gray-100 px-1.5 py-0.5 rounded text-xs">s</code>, find the length of the{" "}
                <strong>longest substring</strong> without repeating characters.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2">EXAMPLE 1</p>
                <div className="code text-xs space-y-1">
                  <p>
                    <span className="text-gray-400">Input:</span> <span style={{ color: PRIMARY }}>s = &quot;abcabcbb&quot;</span>
                  </p>
                  <p>
                    <span className="text-gray-400">Output:</span> <span className="text-emerald-600">3</span>
                  </p>
                  <p>
                    <span className="text-gray-400">Explanation:</span> &quot;abc&quot; has length 3.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">{selectedProblem.tags.map((t) => <Tag key={t} label={t} color="#e0e7ff" textColor="#4338ca" />)}</div>
              <div className="mt-3 flex gap-2">
                {["Google", "Amazon", "Microsoft"].slice(0, selectedProblem.companies.length).map((c, i) => (
                  <div key={c} className="flex items-center gap-1 text-xs text-gray-500">
                    <LogoCircle letter={selectedProblem.companies[i]} color={["#4285F4", "#FF9900", "#00A4EF"][i]} size={16} />
                    {c}
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        <Card className="flex flex-col" style={{ height: 280 }}>
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100">
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none">
              {["Python", "JavaScript", "Java", "C++", "Go"].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
            <button className="text-xs text-gray-500 hover:text-gray-700">Dark</button>
            <button className="text-xs text-gray-500 hover:text-gray-700">
              <RefreshCw size={11} /> Reset
            </button>
            <div className="ml-auto flex gap-2">
              <Btn size="sm" variant="secondary" onClick={runCode} icon={Play}>
                Run
              </Btn>
              <Btn size="sm" onClick={runCode}>
                Submit
              </Btn>
            </div>
          </div>
          <div className="flex-1 bg-gray-950 rounded-b-xl p-4 overflow-auto">
            <pre className="code text-xs text-green-400 leading-relaxed whitespace-pre-wrap">{code}</pre>
          </div>
        </Card>
      </div>

      <Card className="w-56 flex-shrink-0 flex flex-col">
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Brain size={16} style={{ color: PRIMARY }} />
            <span className="text-xs font-600" style={{ fontWeight: 600 }}>
              AI Feedback
            </span>
          </div>
        </div>
        <div className="flex-1 p-3 overflow-y-auto">
          {output ? (
            <div className="space-y-3">
              <div className="p-2 rounded-lg" style={{ background: "#d1fae5" }}>
                <p className="text-xs font-600 text-emerald-700" style={{ fontWeight: 600 }}>
                  ✓ {output.status}
                </p>
                <p className="text-xs text-emerald-600">
                  {output.passed}/{output.total} test cases · {output.time}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">COMPLEXITY</p>
                <p className="text-xs text-gray-700">
                  Time: <strong>O(n)</strong> ✓
                </p>
                <p className="text-xs text-gray-700">
                  Space: <strong>O(min(n,m))</strong>
                </p>
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
