"use client";

import { Zap } from "lucide-react";
import { Btn, Card, Input } from "@/placement-portal/components/atoms";
import { PRIMARY } from "@/placement-portal/constants";

export function PostJobPage() {
  return (
    <div className="su max-w-2xl mx-auto space-y-5">
      <Card className="p-6 space-y-4">
        <h3 className="font-600 text-lg" style={{ fontWeight: 600 }}>
          Create drive / job posting
        </h3>
        {["Role title", "CTC range", "Locations"].map((l) => (
          <div key={l}>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">{l}</label>
            <Input placeholder={l} />
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Description</label>
          <textarea
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[120px] focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": PRIMARY } as React.CSSProperties}
            placeholder="Role expectations, stack, interview process..."
          />
        </div>
        <div className="flex gap-2 pt-2">
          <Btn variant="secondary">Save draft</Btn>
          <Btn icon={Zap}>Publish drive</Btn>
        </div>
      </Card>
    </div>
  );
}
