import React, { useState, useRef } from "react";
import {
  Search, Video, MoreHorizontal, Paperclip, Smile, Send, FileText, Download, Plus, CheckCircle,
  Brain, Play, RefreshCw, Flame, GraduationCap, Building2, Shield, Mail, Lock as LockIcon, User
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

const LogoCircle = ({ letter, color, size, className = "" }: { letter: string; color: string; size: number; className?: string }) => (
  <div
    className={`rounded-full flex items-center justify-center text-white font-bold ${className}`}
    style={{ width: size, height: size, background: color, fontSize: size * 0.4 }}
  >
    {letter}
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

const Av = ({ name, size, color }: { name: string; size: number; color: string }) => (
  <div
    className="rounded-full flex items-center justify-center text-white font-bold text-xs"
    style={{ width: size, height: size, background: color }}
  >
    {name}
  </div>
);

// ─── Mock Data ──────────────────────────────────────────────────────────────
const CHAT_MSGS = [
  { id: 1, sender: "Amazon HR", avatar: "AH", color: "#FF9900", text: "Hi Arjun! Thanks for applying to Amazon. Your profile looks great!", time: "10:30 AM", mine: false },
  { id: 2, sender: "me", avatar: "AK", color: P, text: "Thank you! I'm really excited about the opportunity.", time: "10:32 AM", mine: true },
  { id: 3, sender: "Amazon HR", avatar: "AH", color: "#FF9900", text: "We'd like to schedule a technical interview. Are you available next week?", time: "10:35 AM", mine: false },
  { id: 4, sender: "me", avatar: "AK", color: P, text: "Yes, I'm available Tuesday or Wednesday afternoon.", time: "10:36 AM", mine: true },
  { id: 5, sender: "Amazon HR", avatar: "AH", color: "#FF9900", text: "Perfect! I'll send the calendar invite shortly.", time: "10:37 AM", mine: false }
];

// ─── ChatPage Component ─────────────────────────────────────────────────────
function ChatPage() {
  const [activeRoom, setActiveRoom] = useState("amazon");
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState(CHAT_MSGS);
  const [tab, setTab] = useState("dms");
  const messagesEnd = useRef(null);

  const rooms = [
    { id: "google", name: "Google — SDE 2025", logo: "G", color: "#4285F4", last: "Interview slots sent!", unread: 3 },
    { id: "flipkart", name: "Flipkart — Data Analyst", logo: "F", color: "#2874F0", last: "Shortlist announced", unread: 0 },
  ];
  const dms = [
    { id: "amazon", name: "Amazon HR", logo: "A", color: "#FF9900", last: "Perfect! I'll send the...", unread: 1, online: true },
    { id: "tpo", name: "Placement Officer", logo: "PO", color: "#4f46e5", last: "Please submit your resume by...", unread: 0, online: false },
  ];

  const sendMsg = () => {
    if (!msg.trim()) return;
    setMessages(m => [...m, { id: Date.now(), sender: "me", avatar: "AK", color: P, text: msg, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), mine: true }]);
    setMsg("");
  };

  return (
    <div className="su flex gap-0 h-full" style={{ height: "calc(100vh - 120px)", minHeight: 500 }}>
      {/* Left: conversation list */}
      <Card className="w-72 flex-shrink-0 flex flex-col rounded-r-none border-r border-gray-100">
        <div className="p-3 border-b border-gray-100">
          <Input placeholder="Search conversations..." prefix={Search} />
        </div>
        <div className="flex gap-0 border-b border-gray-100">
          {["rooms", "dms"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-3 text-xs font-medium capitalize transition-all border-b-2"
              style={{ borderColor: tab === t ? P : "transparent", color: tab === t ? P : "#6b7280" }}>
              {t === "dms" ? "Direct Messages" : "Rooms"}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          {(tab === "rooms" ? rooms : dms).map(r => (
            <button key={r.id} onClick={() => setActiveRoom(r.id)}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
              style={{ background: activeRoom === r.id ? "#eef2ff" : "" }}>
              <div className="relative">
                <LogoCircle letter={r.logo} color={r.color} size={40} />
                {(r as any).online !== undefined && <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white" style={{ background: (r as any).online ? "#10b981" : "#9ca3af" }} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.name}</p>
                  {r.unread > 0 && <span className="text-white text-xs rounded-full px-1.5 py-0.5 flex-shrink-0" style={{ background: P, fontSize: 10 }}>{r.unread}</span>}
                </div>
                <p className="text-xs text-gray-400 truncate">{r.last}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-gray-100">
          <Btn variant="secondary" size="sm" className="w-full justify-center" icon={Plus}>New Message</Btn>
        </div>
      </Card>

      {/* Center: chat area */}
      <Card className="flex-1 flex flex-col rounded-none border-x border-gray-100 min-w-0">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <div className="relative">
            <LogoCircle letter="A" color="#FF9900" size={36} />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </div>
          <div>
            <p className="font-600 text-sm" style={{ fontWeight: 600 }}>Amazon HR</p>
            <p className="text-xs text-emerald-500">Online</p>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"><Video size={16} /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"><Search size={16} /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"><MoreHorizontal size={16} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-center"><span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Today</span></div>
          {messages.map(m => (
            <div key={m.id} className={`flex gap-3 ${m.mine ? "flex-row-reverse" : ""}`}>
              {!m.mine && <Av name={m.sender} size={32} color={m.color} />}
              <div className={`max-w-xs lg:max-w-md ${m.mine ? "items-end" : "items-start"} flex flex-col`}>
                {!m.mine && <p className="text-xs text-gray-400 mb-1">{m.sender} · {m.time}</p>}
                <div className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={{ background: m.mine ? P : "#f1f5f9", color: m.mine ? "#fff" : "#374151", borderTopRightRadius: m.mine ? 4 : undefined, borderTopLeftRadius: m.mine ? undefined : 4 }}>
                  {m.text}
                </div>
                {m.mine && <p className="text-xs text-gray-400 mt-1">{m.time} · ✓✓</p>}
              </div>
            </div>
          ))}
          <div ref={messagesEnd} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button className="text-gray-400 hover:text-gray-600"><Paperclip size={18} /></button>
            <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 flex items-center px-4 py-2.5 gap-2">
              <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()}
                placeholder="Type a message..." className="flex-1 text-sm bg-transparent focus:outline-none" />
              <button className="text-gray-400"><Smile size={16} /></button>
            </div>
            <button onClick={sendMsg}
              className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
              style={{ background: P }}>
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>
      </Card>

      {/* Right: info panel */}
      <Card className="w-64 flex-shrink-0 flex flex-col rounded-l-none border-l-0">
        <div className="p-4 border-b border-gray-100 text-center">
          <LogoCircle letter="A" color="#FF9900" size={56} className="mx-auto mb-2" />
          <p className="font-600 text-sm" style={{ fontWeight: 600 }}>Amazon HR</p>
          <p className="text-xs text-gray-500">Talent Acquisition · Pune</p>
        </div>
        <div className="p-4 flex-1">
          <p className="text-xs font-medium text-gray-500 mb-3">SHARED FILES</p>
          {["JD_SDE1_Amazon.pdf", "Interview_Schedule.pdf"].map(f => (
            <div key={f} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer mb-2">
              <FileText size={14} style={{ color: P }} />
              <span className="text-xs text-gray-600 flex-1 truncate">{f}</span>
              <Download size={12} className="text-gray-400" />
            </div>
          ))}
          <p className="text-xs font-medium text-gray-500 mb-3 mt-4">MUTUAL ROOMS</p>
          <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
            <div className="w-6 h-6 rounded" style={{ background: "#FF9900" }} />
            <span className="text-xs text-gray-600">Amazon SDE 2025</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ChatPage;