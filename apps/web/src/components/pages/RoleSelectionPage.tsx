"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/lib/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GraduationCap, Building2, Shield, Check, ArrowRight } from "lucide-react";

const P = "#4f46e5";

interface RoleSelectionPageProps {
  onComplete: (role: string) => void;
}

export default function RoleSelectionPage({ onComplete }: RoleSelectionPageProps) {
  const [selectedRole, setRole] = useState<string | null>(null);
  const [error, setError] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);
  const user = useAuthStore((state) => state.user);

  const roles = [
    { 
      id: "student", 
      icon: GraduationCap, 
      title: "Student",
      description: "Browse jobs, apply to companies, and track your applications",
      color: "#4f46e5"
    },
    { 
      id: "recruiter", 
      icon: Building2, 
      title: "Recruiter",
      description: "Post jobs, review candidates, and manage hiring process (requires verification)",
      color: "#059669"
    },
  ];

  const { mutate: handleRoleSelect, isPending: isLoading } = useMutation({
    mutationFn: async (role: string) => {
      // Update user role via API
      const response = await authService.updateRole(role);
      return response;
    },
    onSuccess: (data) => {
      // Update auth store with new role
      if (user && data.user) {
        setAuth(data.user, data.token || localStorage.getItem("token") || "");
      }
      onComplete(selectedRole!);
    },
    onError: (err: any) => {
      setError(err.message || "Failed to set role. Please try again.");
    },
  });

  const handleContinue = () => {
    if (!selectedRole) {
      setError("Please select a role to continue");
      return;
    }
    handleRoleSelect(selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg,#eef2ff 0%,#f0f9ff 50%,#fdf4ff 100%)" }}>
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute" style={{ width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(79,70,229,.08),transparent)", top: -200, right: -100 }} />
        <div className="absolute" style={{ width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,.06),transparent)", bottom: -150, left: -50 }} />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
            style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#1e293b" }}>Welcome to PlaceMe!</h1>
          <p className="text-gray-600">
            {user?.name ? `Hi ${user.name},` : "Hi there,"} let&apos;s get you set up
          </p>
        </div>

        <Card className="p-8 shadow-xl" style={{ border: "1px solid rgba(79,70,229,.1)" }}>
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2" style={{ color: "#1e293b" }}>Select Your Role</h2>
            <p className="text-sm text-gray-500">Choose how you&apos;ll be using PlaceMe</p>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="space-y-3 mb-6">
            {roles.map((r) => {
              const Icon = r.icon;
              const active = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => { setRole(r.id); setError(""); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left relative"
                  style={{ 
                    borderColor: active ? r.color : "#e5e7eb", 
                    background: active ? `${r.color}08` : "#fff",
                  }}
                >
                  <div 
                    className="flex items-center justify-center w-12 h-12 rounded-xl"
                    style={{ background: active ? `${r.color}15` : "#f3f4f6" }}
                  >
                    <Icon size={24} color={active ? r.color : "#6b7280"} />
                  </div>
                  <div className="flex-1">
                    <h3 
                      className="font-semibold mb-0.5"
                      style={{ color: active ? r.color : "#1e293b" }}
                    >
                      {r.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {r.description}
                    </p>
                  </div>
                  {active && (
                    <div 
                      className="flex items-center justify-center w-6 h-6 rounded-full"
                      style={{ background: r.color }}
                    >
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <Button
            onClick={handleContinue}
            className="w-full justify-center"
            size="lg"
            disabled={isLoading || !selectedRole}
          >
            {isLoading ? (
              "Setting up..."
            ) : (
              <>
                Continue as {selectedRole ? roles.find(r => r.id === selectedRole)?.title : "..."}
                <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </Button>

          <p className="text-center text-xs text-gray-400 mt-4">
            You can change this later in your profile settings
          </p>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-6">© 2025 PlaceMe · Developed by Sugam</p>
      </div>
    </div>
  );
}
