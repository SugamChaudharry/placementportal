"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Clock, Mail, CheckCircle, Building2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth.store";

const P = "#4f46e5";

export default function PendingVerificationPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  
  // Get admin email from env or use default
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@placementportal.com";

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg,#eef2ff 0%,#f0f9ff 50%,#fdf4ff 100%)" }}>
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute" style={{ width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(79,70,229,.08),transparent)", top: -200, right: -100 }} />
        <div className="absolute" style={{ width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,.06),transparent)", bottom: -150, left: -50 }} />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <Card className="p-8 shadow-xl text-center" style={{ border: "1px solid rgba(79,70,229,.1)" }}>
          {/* Status Icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
              style={{ background: "linear-gradient(135deg,#fbbf24,#f59e0b)" }}>
              <Clock size={40} className="text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-3" style={{ color: "#1e293b" }}>
            Verification Pending
          </h1>
          
          {/* Subtitle */}
          <p className="text-gray-600 mb-6">
            Hi {user?.name || "there"}, your recruiter profile has been submitted successfully!
          </p>

          {/* Info Card */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <Building2 size={20} color="#f59e0b" className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Your profile is under review
                </p>
                <p className="text-xs text-amber-700/80 mt-1">
                  Our admin team is reviewing your company information. This usually takes 1-2 business days.
                </p>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div className="space-y-3 mb-6 text-left">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">What happens next?</h3>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle size={16} color={P} />
              </div>
              <p className="text-sm text-gray-600">Profile submitted ✓</p>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Clock size={16} color="#f59e0b" />
              </div>
              <p className="text-sm text-gray-600">Admin verification in progress...</p>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg opacity-60">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <Mail size={16} color="#9ca3af" />
              </div>
              <p className="text-sm text-gray-500">Email notification once approved</p>
            </div>
          </div>

          {/* Contact Admin */}
          <div className="border-t border-gray-100 pt-6 mb-6">
            <p className="text-sm text-gray-500 mb-2">Need help or have questions?</p>
            <a 
              href={`mailto:${adminEmail}?subject=Recruiter Verification Query`}
              className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
              style={{ color: P }}
            >
              <Mail size={16} />
              Contact admin: {adminEmail}
            </a>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button 
              variant="secondary" 
              onClick={() => router.push("/")}
              className="w-full justify-center"
            >
              Go to Home
            </Button>
            <Button 
              onClick={() => router.push("/profile")}
              className="w-full justify-center"
            >
              View My Profile
            </Button>
          </div>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2025 PlaceMe · Developed by Sugam
        </p>
      </div>
    </div>
  );
}
