import React, { useState } from "react";
import {
  Search, MapPin, Bookmark, CheckCircle, Lock, Clock, Calendar, Share2,
  GraduationCap, Building2, Shield, Mail, Lock as LockIcon, User, Download
} from "lucide-react";

// ─── Temporary Shared Components ─────────────────────────────────────────────
const P = "#4f46e5";

const Card = ({ children, className = "", ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

const Input = ({ placeholder, value, onChange, prefix: Prefix, className = "", ...props }: {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: React.ComponentType<any>;
  className?: string;
  [key: string]: any;
}) => (
  <div className={`flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 ${className}`}>
    {Prefix && <Prefix size={16} className="text-gray-400" />}
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="flex-1 outline-none text-sm"
      {...props}
    />
  </div>
);

const Toggle = ({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) => (
  <button onClick={onToggle} className="flex items-center gap-2">
    <div className={`w-8 h-4 rounded-full transition-colors ${on ? "bg-indigo-600" : "bg-gray-300"}`}>
      <div className={`w-3 h-3 rounded-full bg-white transition-transform ${on ? "translate-x-4" : "translate-x-0.5"} mt-0.5`} />
    </div>
    <span className="text-sm text-gray-600">{label}</span>
  </button>
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

const LogoCircle = ({ letter, color, size }: { letter: string; color: string; size: number }) => (
  <div
    className="rounded-full flex items-center justify-center text-white font-bold"
    style={{ width: size, height: size, background: color, fontSize: size * 0.4 }}
  >
    {letter}
  </div>
);

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
const JOBS = [
  { id: 1, role: "SDE-1", company: "Google", logo: "G", color: "#4285F4", location: "Bangalore", ctc: "28-32 LPA", deadline: "Feb 15", eligible: true, type: "Full-time", skills: ["React", "Node.js", "Python"], desc: "Join Google's engineering team to build scalable web applications." },
  { id: 2, role: "Software Engineer", company: "Microsoft", logo: "M", color: "#00A4EF", location: "Hyderabad", ctc: "22-26 LPA", deadline: "Feb 20", eligible: true, type: "Full-time", skills: ["C#", ".NET", "Azure"], desc: "Work on Microsoft's cloud infrastructure and developer tools." },
  { id: 3, role: "SDE Intern", company: "Amazon", logo: "A", color: "#FF9900", location: "Bangalore", ctc: "1.2 LPA", deadline: "Mar 1", eligible: false, type: "Internship", skills: ["Java", "AWS", "Spring"], desc: "Summer internship opportunity at Amazon's Bangalore office." },
  { id: 4, role: "Frontend Developer", company: "Flipkart", logo: "F", color: "#2874F0", location: "Bangalore", ctc: "18-22 LPA", deadline: "Feb 25", eligible: true, type: "Full-time", skills: ["React", "TypeScript", "CSS"], desc: "Build user-facing features for Flipkart's e-commerce platform." },
  { id: 5, role: "Backend Engineer", company: "Paytm", logo: "P", color: "#00BAF2", location: "Noida", ctc: "20-24 LPA", deadline: "Mar 5", eligible: true, type: "Full-time", skills: ["Node.js", "MongoDB", "Express"], desc: "Develop scalable backend services for Paytm's payment systems." }
];

// ─── JobsPage Component ──────────────────────────────────────────────────────
function JobsPage({ setPage }: { setPage: (page: string) => void }) {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [filterType, setFilterType] = useState("All");
  const [showEligible, setShowEligible] = useState(false);
  const [search, setSearch] = useState("");
  const [savedJobs, setSavedJobs] = useState(new Set([2, 4]));
  const [appliedJobs, setAppliedJobs] = useState(new Set([3]));
  const [activeTab, setActiveTab] = useState("all");

  const filtered = JOBS.filter(j => {
    if (search && !j.role.toLowerCase().includes(search.toLowerCase()) && !j.company.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== "All" && j.type !== filterType) return false;
    if (showEligible && !j.eligible) return false;
    return true;
  });

  return (
    <div className="su flex gap-5 h-full" style={{ minHeight: 0 }}>
      {/* Filters */}
      <div className="w-64 flex-shrink-0">
        <Card className="p-4 sticky top-0">
          <p className="font-600 text-sm mb-4" style={{ fontWeight: 600 }}>Filters</p>
          <Input placeholder="Search jobs..." value={search} onChange={e => setSearch(e.target.value)} prefix={Search} />
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-500 mb-2">Job Type</p>
            {["All", "Full-time", "Internship"].map(t => (
              <button key={t} onClick={() => setFilterType(t)}
                className="flex items-center gap-2 w-full py-1.5 text-sm hover:bg-gray-50 rounded-lg px-2 transition-colors"
                style={{ color: filterType === t ? P : "#6b7280", fontWeight: filterType === t ? 600 : 400 }}>
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: filterType === t ? P : "#d1d5db" }}>
                  {filterType === t && <div className="w-2 h-2 rounded-full" style={{ background: P }} />}
                </div>
                {t}
              </button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">Eligibility</p>
            <Toggle on={showEligible} onToggle={() => setShowEligible(!showEligible)} label="Eligible only" />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">CTC Range</p>
            <input type="range" className="w-full" style={{ accentColor: P }} />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0 LPA</span><span>50 LPA</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Btn variant="secondary" size="sm" className="flex-1 justify-center" onClick={() => { setSearch(""); setFilterType("All"); setShowEligible(false); }}>Reset</Btn>
            <Btn size="sm" className="flex-1 justify-center">Apply</Btn>
          </div>
        </Card>
      </div>

      {/* Listings */}
      <div className="flex-1 min-w-0">
        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-white rounded-xl border border-gray-100 p-1.5 shadow-sm">
          {([["all", "All Jobs", filtered.length], ["applied", "Applied", 1], ["saved", "Saved", 2]] as [string, string, number][]).map(([id, label, count]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: activeTab === id ? P : "transparent", color: activeTab === id ? "#fff" : "#6b7280" }}>
              {label} ({count})
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-500">Showing <strong>{filtered.length}</strong> jobs</p>
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none" style={{ color: "#374151" }}>
            <option>Newest first</option><option>CTC: High to Low</option><option>Deadline</option>
          </select>
        </div>

        <div className="space-y-3">
          {filtered.map(j => (
            <Card key={j.id} className={`p-4 cursor-pointer transition-all duration-200 ${selectedJob?.id === j.id ? "ring-2" : "hover:shadow-md"}`}
              style={{ "--tw-ring-color": P, borderColor: selectedJob?.id === j.id ? P : undefined } as React.CSSProperties & { [key: string]: any }}
              onClick={() => setSelectedJob(selectedJob?.id === j.id ? null : j)}>
              <div className="flex items-start gap-4">
                <LogoCircle letter={j.logo} color={j.color} size={46} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-600 text-gray-900" style={{ fontWeight: 600 }}>{j.role}</p>
                      <p className="text-sm text-gray-500">{j.company} · <MapPin size={11} className="inline" /> {j.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={e => { e.stopPropagation(); setSavedJobs(s => { const n = new Set(s); n.has(j.id) ? n.delete(j.id) : n.add(j.id); return n; }); }}>
                        <Bookmark size={16} style={{ color: savedJobs.has(j.id) ? P : "#9ca3af", fill: savedJobs.has(j.id) ? P : "none" }} />
                      </button>
                      {j.eligible ? <CheckCircle size={16} className="text-emerald-500" /> : <Lock size={16} className="text-red-400" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="font-600 text-sm" style={{ fontWeight: 600, color: P }}>{j.ctc}</span>
                    <ColorBdg label={j.type} color="#4f46e5" />
                    <span className="text-xs text-red-500 flex items-center gap-1"><Clock size={11} /> Closes {j.deadline}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    {j.skills.slice(0, 4).map(s => <Tag key={s} label={s} />)}
                  </div>
                </div>
              </div>

              {/* Expanded detail */}
              {selectedJob?.id === j.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 fi">
                  <p className="text-sm text-gray-600 mb-4">{j.desc}</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[["Eligibility", j.eligible ? "✓ You meet all criteria" : "✗ CGPA below requirement"],
                      ["Application Deadline", j.deadline], ["Package", j.ctc], ["Location", j.location]].map(([k, v]) => (
                      <div key={k}>
                        <p className="text-xs text-gray-400">{k}</p>
                        <p className="text-sm font-medium text-gray-800">{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {appliedJobs.has(j.id) ? (
                      <Btn variant="success" className="flex-1 justify-center" disabled icon={CheckCircle}>Applied</Btn>
                    ) : (
                      <Btn className="flex-1 justify-center" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setAppliedJobs(s => new Set([...s, j.id])); }} disabled={!j.eligible}>
                        {j.eligible ? "Apply Now" : "Ineligible"}
                      </Btn>
                    )}
                    <Btn variant="secondary" size="md" icon={Calendar}>Add to Calendar</Btn>
                    <Btn variant="secondary" size="md" icon={Share2}>Share</Btn>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobsPage;