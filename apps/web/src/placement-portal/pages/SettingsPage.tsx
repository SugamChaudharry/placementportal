"use client";

import { useState } from "react";
import { Bell, Download, FileText, Monitor, Shield, Trash2, User } from "lucide-react";
import { Btn, Card, ColorBdg, Input, Toggle } from "@/placement-portal/components/atoms";
import { PRIMARY } from "@/placement-portal/constants";

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const sections = [
    { id: "profile", label: "Profile Settings", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Monitor },
    { id: "resume", label: "Resume Settings", icon: FileText },
  ];
  const notifTypes = [
    "New job matches",
    "Application updates",
    "Test reminders",
    "Interview schedule",
    "Chat messages",
    "Offer letters",
    "System announcements",
  ];
  const [theme, setTheme] = useState("Light");

  return (
    <div className="su flex gap-5">
      <Card className="w-52 flex-shrink-0 h-fit p-2">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all"
            style={{
              background: activeSection === s.id ? "#eef2ff" : "transparent",
              color: activeSection === s.id ? PRIMARY : "#6b7280",
              fontWeight: activeSection === s.id ? 600 : 400,
            }}
          >
            <s.icon size={15} />
            <span className="text-sm">{s.label}</span>
          </button>
        ))}
      </Card>

      <Card className="flex-1 p-6 fi">
        {activeSection === "profile" && (
          <div className="space-y-5 max-w-lg">
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>Profile Settings</h2>
            {[
              ["Full Name", "Arjun Kumar"],
              ["Email", "arjun@iit.ac.in"],
              ["Phone", "+91 98765 43210"],
            ].map(([l, v]) => (
              <div key={l}>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">{l}</label>
                <Input placeholder={l} value={v} onChange={() => {}} />
              </div>
            ))}
            <div className="pt-4 border-t border-gray-100">
              <p className="font-600 text-sm mb-3" style={{ fontWeight: 600 }}>
                Change Password
              </p>
              {["Current password", "New password", "Confirm new password"].map((l) => (
                <div key={l} className="mb-3">
                  <Input type="password" placeholder={l} />
                </div>
              ))}
              <Btn>Update Password</Btn>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <p className="font-600 text-sm mb-2" style={{ fontWeight: 600 }}>
                Connected Accounts
              </p>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full" style={{ background: "#4285F4" }} />
                  <span className="text-sm">Google</span>
                  <ColorBdg label="Connected" color="#10b981" />
                </div>
                <Btn variant="secondary" size="sm">
                  Disconnect
                </Btn>
              </div>
            </div>
            <div className="pt-4 border-t border-red-100" style={{ borderColor: "#fee2e2" }}>
              <p className="font-600 text-sm mb-1 text-red-600" style={{ fontWeight: 600 }}>
                Danger Zone
              </p>
              <p className="text-xs text-gray-500 mb-3">Permanently delete your account and all data</p>
              <Btn variant="danger" size="sm" icon={Trash2}>
                Delete Account
              </Btn>
            </div>
          </div>
        )}

        {activeSection === "notifications" && (
          <div className="max-w-2xl">
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Notification Preferences</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 pr-6 text-xs font-medium text-gray-500">Notification Type</th>
                    {["Email", "SMS", "Push", "In-app"].map((c) => (
                      <th key={c} className="py-3 px-4 text-xs font-medium text-gray-500">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {notifTypes.map((type, i) => (
                    <tr key={type} className="border-b border-gray-50">
                      <td className="py-3 pr-6 text-gray-700">{type}</td>
                      {[true, i % 2 === 0, true, true].map((on, j) => (
                        <td key={j} className="py-3 px-4 text-center">
                          <Toggle on={on} onToggle={() => {}} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === "privacy" && (
          <div className="space-y-5 max-w-lg">
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>Privacy Settings</h2>
            {[
              ["Profile visibility", ["Public", "Only recruiters", "Private"], "Public"],
              ["Show CGPA on public profile", null, true],
              ["Show contact info on public profile", null, false],
            ].map(([label, opts, val]) => (
              <div key={label as string} className="flex items-center justify-between py-3 border-b border-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-800">{label as string}</p>
                </div>
                {opts ? (
                  <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5">
                    {(opts as string[]).map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <Toggle on={val as boolean} onToggle={() => {}} />
                )}
              </div>
            ))}
            <Btn variant="secondary" icon={Download}>
              Download my data
            </Btn>
          </div>
        )}

        {activeSection === "appearance" && (
          <div className="space-y-5 max-w-lg">
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>Appearance</h2>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Theme</p>
              <div className="flex gap-3">
                {["Light", "Dark", "System"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className="flex-1 py-3 border-2 rounded-xl text-sm font-medium transition-all"
                    style={{
                      borderColor: theme === t ? PRIMARY : "#e5e7eb",
                      color: theme === t ? PRIMARY : "#6b7280",
                      background: theme === t ? "#eef2ff" : "#fff",
                    }}
                  >
                    {t === "Light" ? "☀️" : t === "Dark" ? "🌙" : "💻"} {t}
                  </button>
                ))}
              </div>
            </div>
            {[
              ["Collapsed sidebar by default", false],
              ["Compact density", false],
            ].map(([l, v]) => (
              <div key={l as string} className="flex items-center justify-between py-3 border-b border-gray-50">
                <span className="text-sm text-gray-700">{l as string}</span>
                <Toggle on={v as boolean} onToggle={() => {}} />
              </div>
            ))}
          </div>
        )}

        {activeSection === "resume" && (
          <div className="space-y-5 max-w-lg">
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>Resume Settings</h2>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Default Resume Version</label>
              <select className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2">
                <option>Arjun_Kumar_SDE_2025.pdf</option>
                <option>Arjun_Kumar_ML_2025.pdf</option>
              </select>
            </div>
            {[
              ["Auto-update resume from profile changes", true],
              ["ATS Aggressive Optimization", false],
            ].map(([l, v]) => (
              <div key={l as string} className="flex items-center justify-between py-3 border-b border-gray-50">
                <span className="text-sm text-gray-700">{l as string}</span>
                <Toggle on={v as boolean} onToggle={() => {}} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
