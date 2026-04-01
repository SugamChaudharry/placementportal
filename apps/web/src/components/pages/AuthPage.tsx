"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authService, GoogleCredentials } from "@/lib/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GraduationCap, Mail, Lock, User, Check } from "lucide-react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const P = "#4f46e5";

export default function AuthPage({ onLogin }: { onLogin: (params: { role: string; needsOnboarding?: boolean }) => void }) {
  const [tab, setTab] = useState("login");
  const [selectedRole, setRole] = useState("student");
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [passStrength, setPassStrength] = useState(0);
  const [error, setError] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);

  const checkStrength = (p: string) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    setPassStrength(s);
  };

  const { mutate: handleLogin, isPending: isLoginLoading } = useMutation({
    mutationFn: async () => {
      return await authService.login({ email, password: pass });
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      // If user needs onboarding (no role-specific profile), redirect to onboarding
      onLogin({ role: data.needsOnboarding ? "onboarding" : data.user.role, needsOnboarding: data.needsOnboarding });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || err.message || "Login failed";
      setError(message);
    },
  });

  const { mutate: handleRegister, isPending: isRegisterLoading } = useMutation({
    mutationFn: async () => {
      return await authService.register({
        name,
        email,
        password: pass,
        role: "student", // Default to student, can be changed during onboarding
      });
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      // New users always need onboarding after registration
      onLogin({ role: data.user.role, needsOnboarding: true });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || err.message || "Registration failed";
      setError(message);
    },
  });

  const { mutate: handleGoogle, isPending: isGoogleLoading } = useMutation({
    mutationFn: async (credentialResponse: any) => {
      const decoded: any = jwtDecode(credentialResponse.credential);
      const payload: GoogleCredentials = {
        email: decoded.email,
        name: decoded.name,
        avatar: decoded.picture,
        googleId: decoded.sub,
        role: "student", // Default to student, can be changed during onboarding
      };
      return await authService.google(payload);
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      // If user needs onboarding (no role-specific profile), redirect to onboarding
      onLogin({ role: data.needsOnboarding ? "onboarding" : data.user.role, needsOnboarding: data.needsOnboarding });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || err.message || "Google Authentication failed";
      setError(message);
    },
  });

  const strengthColors = ["#d1d5db", "#ef4444", "#f59e0b", "#10b981", "#059669"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "linear-gradient(135deg,#eef2ff 0%,#f0f9ff 50%,#fdf4ff 100%)" }}>
        {/* Background decoration */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute" style={{ width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(79,70,229,.08),transparent)", top: -200, right: -100 }} />
          <div className="absolute" style={{ width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,.06),transparent)", bottom: -150, left: -50 }} />
        </div>

        <div className="w-full max-w-md su">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-lg"
              style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
              <GraduationCap size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "#1e293b" }}>PlaceMe</h1>
            <p className="text-sm text-gray-500 mt-1">Campus Placement Portal</p>
          </div>

          <Card className="p-7 shadow-xl" style={{ border: "1px solid rgba(79,70,229,.1)" }}>
            {/* Tabs */}
            <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
              {["login", "register"].map(t => (
                <button key={t} onClick={() => { setTab(t); setError(""); }}
                  className="flex-1 py-2 text-sm rounded-md capitalize font-medium transition-all"
                  style={{ background: tab === t ? "#fff" : "transparent", color: tab === t ? "#1e293b" : "#6b7280", fontWeight: tab === t ? 600 : 400, boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,.1)" : "none" }}>
                  {t === "login" ? "Sign In" : "Register"}
                </button>
              ))}
            </div>

            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

            {tab === "login" ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Input prefix={Mail} placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                  <Input prefix={Lock} placeholder="Password" type={showPass ? "text" : "password"} value={pass} onChange={e => setPass(e.target.value)} />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" className="rounded" checked={showPass} onChange={() => setShowPass(!showPass)} />
                    Show password
                  </label>
                  <button className="text-sm font-medium hover:underline" style={{ color: P }}>Forgot password?</button>
                </div>
                <Button className="w-full mt-4 justify-center" disabled={isLoginLoading || !email || !pass} onClick={() => handleLogin()}>
                  {isLoginLoading ? "Signing in..." : "Sign In"}
                </Button>
                
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                  <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or continue with</span></div>
                </div>

                <div className="flex justify-center opacity-90 hover:opacity-100 transition-opacity">
                  {isGoogleLoading ? <p className="text-sm text-gray-500">Authenticating...</p> : 
                    <GoogleLogin 
                      onSuccess={credentialResponse => handleGoogle(credentialResponse)} 
                      onError={() => setError("Google Login Failed")} 
                    />
                  }
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Input prefix={User} placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
                  <Input prefix={Mail} placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                  <Input prefix={Lock} placeholder="Password (min 8 characters)" type="password" value={pass} onChange={e => { setPass(e.target.value); checkStrength(e.target.value); }} />
                </div>
                {pass.length > 0 && (
                  <div className="mt-2 text-left">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-1 flex-1 rounded-full transition-colors" style={{ background: i <= passStrength ? strengthColors[passStrength] : "#e5e7eb" }} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">Strength: <span style={{ color: strengthColors[passStrength] }}>{strengthLabels[passStrength]}</span></p>
                  </div>
                )}
                <div className="flex items-start gap-2 pt-2">
                  <input type="checkbox" className="rounded mt-0.5 cursor-pointer" id="terms" />
                  <label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer">I agree to the <span style={{ color: P }} className="hover:underline">Terms of Service</span> and <span style={{ color: P }} className="hover:underline">Privacy Policy</span></label>
                </div>
                <Button onClick={() => handleRegister()} className="w-full justify-center" size="lg" disabled={isRegisterLoading || passStrength < 2 || !name || !email}>
                  {isRegisterLoading ? "Creating account..." : "Create account"}
                </Button>

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                  <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or sign up with</span></div>
                </div>

                <div className="flex justify-center flex-col items-center">
                  {isGoogleLoading ? <p className="text-sm text-gray-500">Authenticating...</p> : 
                    <GoogleLogin 
                      text="signup_with"
                      onSuccess={credentialResponse => handleGoogle(credentialResponse)} 
                      onError={() => setError("Google Sign Up Failed")} 
                    />
                  }
                </div>
              </div>
            )}
          </Card>
          <p className="text-center text-xs text-gray-400 mt-6">© 2025 PlaceMe · Developed by Sugam</p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}