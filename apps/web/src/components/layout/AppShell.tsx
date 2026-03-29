"use client";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { useUiStore } from "@/store/ui.store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1280px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
