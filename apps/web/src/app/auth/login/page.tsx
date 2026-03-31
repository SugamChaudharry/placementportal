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
import { Mail, Lock } from "lucide-react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const P = "#4f46e5";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const { mutate: handleLogin, isPending: isLoginLoading } = useMutation({
    mutationFn: async () => {
      return await authService.login({ email, password: pass });
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
      const message = err.response?.data?.message || err.message || "Login failed";
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
      const message = err.response?.data?.message || err.message || "Google Authentication failed";
      setError(message);
    },
  });

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Card className="p-7 shadow-xl" style={{ border: "1px solid rgba(79,70,229,.1)" }}>
        <h2 className="text-xl font-semibold mb-1" style={{ color: "#1e293b" }}>Welcome back</h2>
        <p className="text-sm text-gray-500 mb-6">Sign in to your account to continue</p>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

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

          <p className="text-center text-sm text-gray-500 mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-medium hover:underline" style={{ color: P }}>
              Create one
            </Link>
          </p>
        </div>
      </Card>
    </GoogleOAuthProvider>
  );
}
