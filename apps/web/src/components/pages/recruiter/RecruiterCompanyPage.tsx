"use client";

import React from "react";
import { Edit3, Globe, Mail, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ColorBadge } from "@/components/ui/Badge";
import { LogoCircle } from "@/components/ui/LogoCircle";

export default function RecruiterCompanyPage() {
  return (
    <div className="su max-w-4xl space-y-5">
      <Card className="p-6 flex flex-col md:flex-row gap-6 items-start">
        <LogoCircle letter="T" color="#0891b2" size={72} />
        <div className="flex-1">
          <h2 className="text-xl font-700 text-gray-900" style={{ fontWeight: 700 }}>TechCorp India Pvt. Ltd.</h2>
          <p className="text-sm text-gray-500 mt-1">IT Services · 5,000+ employees · Founded 2008</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <ColorBadge label="Verified" color="#059669" />
            <ColorBadge label="Hiring 2025" color="#4f46e5" />
          </div>
        </div>
        <Button icon={Edit3}>Edit profile</Button>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-5">
          <p className="font-600 mb-3" style={{ fontWeight: 600 }}>About</p>
          <p className="text-sm text-gray-600 leading-relaxed">We partner with global enterprises on cloud transformation, data platforms, and product engineering. Our campus program focuses on full-stack and platform roles.</p>
        </Card>
        <Card className="p-5">
          <p className="font-600 mb-3" style={{ fontWeight: 600 }}>Contact</p>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2"><Globe size={14} /> www.techcorp.example</p>
            <p className="flex items-center gap-2"><Mail size={14} /> campus@techcorp.example</p>
            <p className="flex items-center gap-2"><MapPin size={14} /> Bangalore, Hyderabad</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
