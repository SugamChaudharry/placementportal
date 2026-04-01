"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Plus Jakarta Sans',-apple-system,sans-serif;background:#f8fafc;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:10px;}
      ` }} />
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "linear-gradient(135deg,#eef2ff 0%,#f0f9ff 50%,#fdf4ff 100%)" }}>
        {/* Background decoration */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute" style={{ width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(79,70,229,.08),transparent)", top: -200, right: -100 }} />
          <div className="absolute" style={{ width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,.06),transparent)", bottom: -150, left: -50 }} />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Brand */}
          <div className="text-center mb-8">
            <Link href="/">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-lg cursor-pointer"
                style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
                <GraduationCap size={28} className="text-white" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold" style={{ color: "#1e293b" }}>PlaceMe</h1>
            <p className="text-sm text-gray-500 mt-1">Campus Placement Portal</p>
          </div>

          {children}

          <p className="text-center text-xs text-gray-400 mt-6">© 2025 PlaceMe · Developed by Sugam</p>
        </div>
      </div>
    </>
  );
}
