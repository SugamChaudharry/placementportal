"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import {
  Edit3,
  X,
  Mail,
  Phone,
  Linkedin,
  Github,
  FileText,
  Download,
  Copy,
  ClipboardList,
  CheckCircle,
  Code2,
  Award,
  User,
  Share2,
  Plus,
} from "lucide-react";

// ─── Constants ──────────────────────────────────────────────────────────────
const P = "#4f46e5";

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

type ColorBdgProps = {
  label: string;
  color?: string;
};
function ColorBdg({ label, color = "#4f46e5" }: ColorBdgProps) {
  const alpha = color + "22";
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ background: alpha, color }}>
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

type ToggleProps = {
  on: boolean;
  onToggle: () => void;
  label?: string;
};
function Toggle({ on, onToggle, label }: ToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onToggle}
        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
        style={{ background: on ? P : "#d1d5db" }}>
        <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
          style={{ transform: on ? "translateX(18px)" : "translateX(2px)" }} />
      </button>
      {label && <span className="text-sm text-gray-600">{label}</span>}
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
// PROFILE
// ═══════════════════════════════════════════════════════════════════════════════
type ProfilePageProps = {
  setPage: (page: string) => void;
  user?: any;
};

export default function ProfilePage({ setPage, user: userProp }: ProfilePageProps) {
  const [tab, setTab] = useState("personal");
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const authUser = useAuthStore((state) => state.user);
  
  const user = userProp || userData || authUser;

  useEffect(() => {
    if (!userProp && !userData) {
      // Fetch profile data if not provided via props
      const fetchProfile = async () => {
        try {
          const { userService } = await import("@/lib/services/user.service");
          const response = await userService.getProfile();
          setUserData(response.data);
        } catch (err) {
          // Use auth store data as fallback
        }
      };
      fetchProfile();
    }
  }, [userProp, userData]);

  const tabs = ["personal", "skills", "resume", "preferences", "activity"];
  const displayInstitution = user?.student?.college?.name || user?.recruiter?.company?.name || null;
  const displayGradYear = user?.student?.graduationYear || null;
  const displayCGPA = user?.student?.cgpa || null;
  const skills = user?.student?.skills || {};
  const experiences = user?.student?.experiences || [];
  const activities = user?.activities || [];

  // Helper to get display name
  const displayName = user?.name || "User";
  const displayRole = user?.role || "student";
  const displayEmail = user?.email || "";
  const displayUsername = user?.username || "user";

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!user) return 0;
    
    const fields = [
      user.name,
      user.email,
      user.phone,
      user.avatar,
      user.student?.rollNumber,
      user.student?.branch,
      user.student?.cgpa,
      user.student?.graduationYear,
      user.student?.collegeId,
      user.student?.tenthPercentage,
      user.student?.twelfthPercentage,
      user.student?.backlogs !== undefined ? String(user.student.backlogs) : null,
      user.linkedin,
      user.github,
      user.resume?.url,
      user.student?.skills && Object.keys(user.student.skills).length > 0 ? "has_skills" : null,
    ];
    
    const filledFields = fields.filter(f => f && f !== "" && f !== "null" && f !== "undefined").length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const profileComplete = calculateProfileCompletion();

  return (
    <div className="su flex gap-6">
      {/* Left profile card */}
      <div className="w-72 flex-shrink-0 space-y-4">
        <Card className="p-6 text-center">
          <div className="relative inline-block mb-4">
            <Av name={displayName} size={80} />
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center" style={{ background: P }}>
              <Edit3 size={12} className="text-white" />
            </button>
          </div>
          <h2 style={{ fontWeight: 700, fontSize: 18 }}>{displayName}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{displayInstitution || <span className="text-gray-400 italic">No institution added</span>}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <ColorBdg label={displayRole} color="#4f46e5" />
            {displayGradYear && <ColorBdg label={`Class of ${displayGradYear}`} color="#0891b2" />}
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="text-center">
              <p className="font-700 text-lg" style={{ fontWeight: 700 }}>{displayCGPA || "-"}</p>
              <p className="text-xs text-gray-400">CGPA</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <p className="font-700 text-lg" style={{ fontWeight: 700 }}>{user?.applicationsCount || "-"}</p>
              <p className="text-xs text-gray-400">Applications</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <p className="font-700 text-lg" style={{ fontWeight: 700 }}>{user?.offersCount || "-"}</p>
              <p className="text-xs text-gray-400">Offers</p>
            </div>
          </div>
          <div className="flex justify-center gap-3 mt-4">
            {[Mail, Phone, Linkedin, Github].map((Icon, i) => (
              <button key={i} className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 hover:bg-gray-50 text-gray-500">
                <Icon size={15} />
              </button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Profile completion</span>
              <span className="text-xs font-600" style={{ fontWeight: 600, color: P }}>{profileComplete}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${profileComplete}%`, background: "linear-gradient(90deg,#4f46e5,#7c3aed)" }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {profileComplete < 100 
                ? `Complete ${Math.ceil((16 - (profileComplete / 100) * 16))} more fields to reach 100%` 
                : "Profile complete!"}
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-medium text-gray-500 mb-3">QUICK ACTIONS</p>
          <div className="space-y-2">
            {([["View Resume", FileText, "secondary"], ["Download PDF", Download, "secondary"], ["Edit Resume", Edit3, "primary"]] as [string, React.ComponentType, BtnVariant][]).map(([label, Icon, variant]) => (
              <Btn key={label} variant={variant} size="sm" className="w-full justify-center" icon={Icon} onClick={() => setPage("resume-editor")}>{label}</Btn>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Public profile link</p>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-xs text-gray-500 flex-1 truncate">placeme.io/u/{displayUsername}</span>
              <button className="text-gray-400"><Copy size={12} /></button>
            </div>
          </div>
        </Card>
      </div>

      {/* Right tabbed content */}
      <div className="flex-1 min-w-0">
        <Card>
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-5 py-4 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-all"
                style={{ borderColor: tab === t ? P : "transparent", color: tab === t ? P : "#6b7280" }}>
                {t}
              </button>
            ))}
            <button onClick={() => setEditMode(!editMode)} className="ml-auto px-4 flex items-center gap-1.5 text-sm" style={{ color: editMode ? "#ef4444" : P }}>
              {editMode ? <><X size={14} />Cancel</> : <><Edit3 size={14} />Edit</>}
            </button>
          </div>
          <div className="p-6 fi">
            {tab === "personal" && (
              <div className="grid grid-cols-2 gap-5">
                {[
                  ["Full Name", displayName],
                  ["Roll Number", user?.student?.rollNumber],
                  ["Branch", user?.student?.branch],
                  ["CGPA", user?.student?.cgpa ? `${user.student.cgpa} / 10` : null],
                  ["Graduation Year", user?.student?.graduationYear],
                  ["Phone", user?.phone],
                  ["Date of Birth", user?.dateOfBirth],
                  ["Gender", user?.gender],
                  ["10th Percentage", user?.student?.tenthPercentage],
                  ["12th Percentage", user?.student?.twelfthPercentage],
                  ["Active Backlogs", user?.student?.backlogs === 0 ? "None" : user?.student?.backlogs],
                  ["LinkedIn", user?.linkedin]
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs text-gray-400 mb-1">{k}</p>
                    {editMode ? <input defaultValue={v || ""} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none" style={{ "--tw-ring-color": P } as React.CSSProperties & { [key: string]: any }} />
                      : <p className="text-sm font-medium text-gray-800">{v || <span className="text-gray-400 italic">Not provided</span>}</p>}
                  </div>
                ))}
              </div>
            )}
            {tab === "skills" && (
              <div className="space-y-5">
                {Object.keys(skills).length > 0 ? (
                  Object.entries(skills).map(([cat, items]) => (
                    <div key={cat}>
                      <p className="text-xs font-medium text-gray-400 mb-2">{cat.toUpperCase()}</p>
                      <div className="flex flex-wrap gap-2">
                        {(items as string[]).map((s: string) => <Tag key={s} label={s} onRemove={editMode ? () => {} : undefined} />)}
                        {editMode && <button className="px-2.5 py-1 border border-dashed border-gray-300 rounded-full text-xs text-gray-400 hover:border-indigo-400">+ Add</button>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 italic">No skills added yet</p>
                    {editMode && <button className="mt-2 px-2.5 py-1 border border-dashed border-gray-300 rounded-full text-xs text-gray-400 hover:border-indigo-400">+ Add Skill</button>}
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-3">WORK EXPERIENCE</p>
                  <div className="space-y-3">
                    {experiences.length > 0 ? (
                      experiences.map((e: any, i: number) => (
                        <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-600 text-sm" style={{ fontWeight: 600 }}>{e.role}</p>
                              <p className="text-xs text-gray-500">{e.company} · {e.period}</p>
                            </div>
                            {editMode && <button className="text-gray-400"><Edit3 size={14} /></button>}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{e.desc}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 italic text-sm">No work experience added</p>
                    )}
                    {editMode && <Btn variant="secondary" size="sm" icon={Plus}>Add Experience</Btn>}
                  </div>
                </div>
              </div>
            )}
            {tab === "preferences" && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-600 mb-3" style={{ fontWeight: 600 }}>Job Preferences</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Interested Roles</p>
                      <div className="flex flex-wrap gap-2">
                        {user?.student?.preferredRoles?.length > 0 ? (
                          user.student.preferredRoles.map((r: string) => <Tag key={r} label={r} />)
                        ) : (
                          <span className="text-gray-400 italic text-sm">No roles selected</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Preferred Locations</p>
                      <div className="flex flex-wrap gap-2">
                        {user?.student?.preferredLocations?.length > 0 ? (
                          user.student.preferredLocations.map((l: string) => <Tag key={l} label={l} />)
                        ) : (
                          <span className="text-gray-400 italic text-sm">No locations selected</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-600 mb-3" style={{ fontWeight: 600 }}>Notifications</p>
                  <div className="space-y-2">
                    {[
                      { label: "Email updates for new jobs", key: "emailJobs" },
                      { label: "SMS for test reminders", key: "smsReminders" },
                      { label: "Push for shortlist results", key: "pushShortlist" },
                      { label: "In-app for messages", key: "inAppMessages" }
                    ].map((n) => (
                      <div key={n.key} className="flex items-center justify-between py-2 border-b border-gray-50">
                        <span className="text-sm text-gray-700">{n.label}</span>
                        <Toggle on={user?.notifications?.[n.key] || false} onToggle={() => {}} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {tab === "activity" && (
              <div className="space-y-3">
                {activities.length > 0 ? (
                  activities.map((a: any, i: number) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: a.color + "20" }}>
                        <a.icon size={14} style={{ color: a.color }} />
                      </div>
                      <div className="flex-1 pt-1.5 border-b border-gray-50 pb-3">
                        <p className="text-sm text-gray-700">{a.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 italic">No recent activity</p>
                  </div>
                )}
              </div>
            )}
            {tab === "resume" && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Btn icon={Edit3} onClick={() => setPage("resume-editor")}>Edit Resume</Btn>
                  <Btn variant="secondary" icon={Download}>Download PDF</Btn>
                  <Btn variant="secondary" icon={Share2}>Share Link</Btn>
                  {user?.resume?.atsScore ? (
                    <div className="ml-auto flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#d1fae5" }}>
                      <span className="font-700 text-emerald-700" style={{ fontWeight: 700, fontSize: 24 }}>{user.resume.atsScore}</span>
                      <div>
                        <p className="text-xs font-600 text-emerald-700" style={{ fontWeight: 600 }}>ATS Score</p>
                        <p className="text-xs text-emerald-600">{user.resume.atsScore >= 80 ? "Good match" : user.resume.atsScore >= 60 ? "Average" : "Needs improvement"}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="ml-auto flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#f1f5f9" }}>
                      <span className="font-700 text-gray-600" style={{ fontWeight: 700, fontSize: 24 }}>-</span>
                      <div>
                        <p className="text-xs font-600 text-gray-600" style={{ fontWeight: 600 }}>ATS Score</p>
                        <p className="text-xs text-gray-500">Upload resume to check</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 rounded-xl p-6 text-center" style={{ minHeight: 400 }}>
                  <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                  {user?.resume?.url ? (
                    <p className="text-gray-500 text-sm">Resume preview available</p>
                  ) : (
                    <>
                      <p className="text-gray-500 text-sm">No resume uploaded yet</p>
                      <p className="text-xs text-gray-400 mt-1">Click "Edit Resume" to add your resume</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}