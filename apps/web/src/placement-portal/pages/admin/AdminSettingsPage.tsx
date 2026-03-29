"use client";

import { Settings } from "lucide-react";
import { Btn, Card, Toggle } from "@/placement-portal/components/atoms";

export function AdminSettingsPage() {
  return (
    <div className="su max-w-2xl space-y-4">
      <Card className="p-5">
        <p className="font-600 mb-4" style={{ fontWeight: 600 }}>
          Platform
        </p>
        {[
          ["Maintenance mode", false],
          ["Allow new recruiter signups", true],
          ["Require email verification", true],
        ].map(([l, v]) => (
          <div key={l as string} className="flex items-center justify-between py-3 border-b border-gray-50">
            <span className="text-sm text-gray-700">{l as string}</span>
            <Toggle on={v as boolean} onToggle={() => {}} />
          </div>
        ))}
      </Card>
      <Card className="p-5">
        <p className="font-600 mb-4" style={{ fontWeight: 600 }}>
          Integrations
        </p>
        <p className="text-sm text-gray-500 mb-3">SMTP, SMS gateway, and SSO placeholders for demo.</p>
        <Btn variant="secondary" size="sm" icon={Settings}>
          Configure
        </Btn>
      </Card>
    </div>
  );
}
