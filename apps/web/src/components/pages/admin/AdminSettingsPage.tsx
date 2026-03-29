"use client";

import React from "react";
import { Settings } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";

export default function AdminSettingsPage() {
  return (
    <div className="su max-w-2xl space-y-4">
      <Card className="p-5">
        <p className="font-600 mb-4" style={{ fontWeight: 600 }}>Platform</p>
        {([
          ["Maintenance mode", false],
          ["Allow new recruiter signups", true],
          ["Require email verification", true],
        ] as [string, boolean][]).map(([l, v], idx) => (
          <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-50">
            <span className="text-sm text-gray-700">{l}</span>
            <Toggle on={v} onToggle={() => {}} />
          </div>
        ))}
      </Card>
      <Card className="p-5">
        <p className="font-600 mb-4" style={{ fontWeight: 600 }}>Integrations</p>
        <p className="text-sm text-gray-500 mb-3">SMTP, SMS gateway, and SSO placeholders for demo.</p>
        <Button variant="secondary" size="sm" icon={Settings}>Configure</Button>
      </Card>
    </div>
  );
}
