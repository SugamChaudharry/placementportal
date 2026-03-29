"use client";

import React from "react";
import { Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { P } from "@/lib/constants";

export default function PostJobPage() {
  return (
    <div className="su max-w-2xl mx-auto space-y-5">
      <Card className="p-6 space-y-4">
        <h3 className="font-600 text-lg" style={{ fontWeight: 600 }}>Create drive / job posting</h3>
        {[
          ["Role title", "e.g. SDE-1"],
          ["CTC range", "e.g. 18–22 LPA"],
          ["Locations", "Multi-select"],
        ].map(([l, p]) => (
          <div key={l}>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">{l}</label>
            <Input placeholder={p as string} />
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Description</label>
          <textarea
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[120px] focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": P } as React.CSSProperties & { [key: string]: any }}
            placeholder="Role expectations, stack, interview process..."
          />
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="secondary">Save draft</Button>
          <Button icon={Zap}>Publish drive</Button>
        </div>
      </Card>
    </div>
  );
}
