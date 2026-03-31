"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService, GoogleCredentials } from "@/lib/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { User, Mail, Lock, Check } from "lucide-react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const P = "#4f46e5";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [passStrength, setPassStrength] = useState(0);
  const [error, setError] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const checkStrength = (p: string) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    setPassStrength(s);
  };

  const { mutate: handleRegister, isPending: isRegisterLoading } = useMutation({
    mutationFn: async () => {
      return await authService.register({
        name,
        email,
        password: pass,
        role: "student",
      });
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      // New users always need onboarding
      router.push("/onboarding/student");
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
        role: "student",
      };
      return await authService.google(payload);
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      // Redirect based on onboarding status
      if (data.needsOnboarding) {
        router.push("/onboarding/role");
      } else {
        router.push("/");
      }
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || err.message || "Google Sign Up Failed";
      setError(message);
    },
  });

  const strengthColors = ["#d1d5db", "#ef4444", "#f59e0b", "#10b981", "#059669"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Card className="p-7 shadow-xl" style={{ border: "1px solid rgba(79,70,229,.1)" }}>
        <h2 className="text-xl font-semibold mb-1" style={{ color: "#1e293b" }}>Create account</h2>
        <p className="text-sm text-gray-500 mb-6">Join PlaceMe to find your dream job</p>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

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

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium hover:underline" style={{ color: P }}>
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </GoogleOAuthProvider>
  );
}
