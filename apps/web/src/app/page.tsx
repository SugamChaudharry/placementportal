"use client";

import { useState, useEffect } from "react";
import { authService } from "@/lib/services/auth.service";
import AuthPage from "@/components/pages/AuthPage";
import StudentDashboard from "@/components/pages/StudentDashboard";
import JobsPage from "@/components/pages/JobsPage";
import ApplicationsPage from "@/components/pages/ApplicationsPage";
import CalendarPage from "@/components/pages/CalendarPage";
import ChatPage from "@/components/pages/ChatPage";
import PracticeArenaPage from "@/components/pages/PracticeArenaPage";
import ProfilePage from "@/components/pages/ProfilePage";
import ResumeEditorPage from "@/components/pages/ResumeEditorPage";
import MeetingsPage from "@/components/pages/MeetingsPage";
import TestsPage from "@/components/pages/TestsPage";
import MockInterviewPage from "@/components/pages/MockInterviewPage";
import NetworkPage from "@/components/pages/NetworkPage";
import NotificationsPage from "@/components/pages/NotificationsPage";
import SettingsPage from "@/components/pages/SettingsPage";
import OnboardingPage from "@/components/pages/OnboardingPage";
import RecruiterOnboardingPage from "@/components/pages/RecruiterOnboardingPage";
import RoleSelectionPage from "@/components/pages/RoleSelectionPage";

// Recruiter pages
import RecruiterDashboard from "@/components/pages/recruiter/RecruiterDashboard";
import RecruiterCompanyPage from "@/components/pages/recruiter/RecruiterCompanyPage";
import PostJobPage from "@/components/pages/recruiter/PostJobPage";
import ManageDrivePage from "@/components/pages/recruiter/ManageDrivePage";
import RecruiterCandidatesPage from "@/components/pages/recruiter/RecruiterCandidatesPage";
import CreateTestPage from "@/components/pages/recruiter/CreateTestPage";
import RecruiterAnalyticsPage from "@/components/pages/recruiter/RecruiterAnalyticsPage";

// Admin pages
import AdminDashboard from "@/components/pages/admin/AdminDashboard";
import AdminUsersPage from "@/components/pages/admin/AdminUsersPage";
import AdminCompaniesPage from "@/components/pages/admin/AdminCompaniesPage";
import AdminDrivesPage from "@/components/pages/admin/AdminDrivesPage";
import AdminApplicationsPage from "@/components/pages/admin/AdminApplicationsPage";
import AdminAnalyticsPage from "@/components/pages/admin/AdminAnalyticsPage";
import AdminSettingsPage from "@/components/pages/admin/AdminSettingsPage";

import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";

// Global Styles Component
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    body,#root{font-family:'Plus Jakarta Sans',-apple-system,sans-serif;background:#f8fafc;}
    ::-webkit-scrollbar{width:4px;height:4px;}
    ::-webkit-scrollbar-track{background:transparent;}
    ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:10px;}
    .fi{animation:fi .25s ease both;}
    .su{animation:su .3s ease both;}
    @keyframes fi{from{opacity:0}to{opacity:1}}
    @keyframes su{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    .hl{transition:transform .2s,box-shadow .2s;}
    .hl:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(79,70,229,.12);}
    .gt{background:linear-gradient(135deg,#4f46e5,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
    .sb{background:linear-gradient(160deg,#0f172a 0%,#1a1150 100%);}
    .code{font-family:'JetBrains Mono',monospace;}
    input,textarea,select{font-family:'Plus Jakarta Sans',sans-serif;}
  ` }} />
);

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("student");
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
  const [onboarding, setOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restore auth state on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const user = await authService.getMe();
          setRole(user.role);
          setLoggedIn(true);
          // Check if onboarding is needed
          if (user.role === "student" && (!user.student || (user.student as any).profileComplete < 100)) {
            setOnboarding(true);
          } else if (user.role === "recruiter" && (!user.recruiter || !(user.recruiter as any).companyId)) {
            setOnboarding(true);
          }
        } catch (err) {
          // Token invalid or expired, clear it
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };
    restoreSession();
  }, []);

  if (isLoading) {
    return (
      <>
        <GlobalStyles />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </>
    );
  }

  const handleLogin = ({ role, needsOnboarding }: { role: string; needsOnboarding?: boolean }) => {
    if (role === "onboarding") {
      // User logged in with Google but needs to select a role
      setNeedsRoleSelection(true);
      setLoggedIn(true);
      return;
    }
    setRole(role);
    setPage(role === "student" ? "dashboard" : role === "recruiter" ? "rec-dashboard" : "admin-dashboard");
    setLoggedIn(true);
    setNeedsRoleSelection(false);
    setOnboarding(needsOnboarding ?? false);
  };

  if (!loggedIn) {
    return (
      <>
        <GlobalStyles />
        <AuthPage onLogin={handleLogin} />
      </>
    );
  }

  if (needsRoleSelection) {
    return (
      <>
        <GlobalStyles />
        <RoleSelectionPage onComplete={(selectedRole) => {
          setRole(selectedRole);
          setNeedsRoleSelection(false);
          setPage(selectedRole === "student" ? "dashboard" : selectedRole === "recruiter" ? "rec-dashboard" : "admin-dashboard");
          // Trigger onboarding for both students and recruiters after role selection
          setOnboarding(selectedRole === "student" || selectedRole === "recruiter");
        }} />
      </>
    );
  }

  if (onboarding) {
    return (
      <>
        <GlobalStyles />
        {role === "recruiter" ? (
          <RecruiterOnboardingPage onDone={() => setOnboarding(false)} />
        ) : (
          <OnboardingPage onDone={() => setOnboarding(false)} />
        )}
      </>
    );
  }

  const renderPage = () => {
    const sp = { setPage };
    switch (page) {
      case "dashboard": return <StudentDashboard {...sp} />;
      case "profile": return <ProfilePage {...sp} />;
      case "resume": return <ResumeEditorPage />;
      case "resume-editor": return <ResumeEditorPage />;
      case "jobs": return <JobsPage {...sp} />;
      case "applications": return <ApplicationsPage />;
      case "calendar": return <CalendarPage />;
      case "chat": return <ChatPage />;
      case "meetings": return <MeetingsPage />;
      case "tests": return <TestsPage />;
      case "practice": return <PracticeArenaPage />;
      case "mock-interview": return <MockInterviewPage />;
      case "network": return <NetworkPage />;
      case "notifications": return <NotificationsPage />;
      case "settings": return <SettingsPage />;
      case "rec-dashboard": return <RecruiterDashboard {...sp} />;
      case "rec-company": return <RecruiterCompanyPage />;
      case "rec-post": return <PostJobPage />;
      case "rec-drives": return <ManageDrivePage />;
      case "rec-candidates": return <RecruiterCandidatesPage />;
      case "rec-tests": return <CreateTestPage />;
      case "rec-analytics": return <RecruiterAnalyticsPage />;
      case "admin-dashboard": return <AdminDashboard {...sp} />;
      case "admin-users": return <AdminUsersPage />;
      case "admin-companies": return <AdminCompaniesPage />;
      case "admin-drives": return <AdminDrivesPage />;
      case "admin-applications": return <AdminApplicationsPage />;
      case "admin-analytics": return <AdminAnalyticsPage />;
      case "admin-settings": return <AdminSettingsPage />;
      default: return <StudentDashboard {...sp} />;
    }
  };

  return (
    <>
      <GlobalStyles />
      <div className="flex h-screen overflow-hidden">
        <Sidebar role={role} setRole={setRole} page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
          <TopNav page={page} role={role} setPage={setPage} showNotifs={showNotifs} setShowNotifs={setShowNotifs} />
          <main className="flex-1 overflow-y-auto p-6" style={{ maxWidth: 1280, margin: "0 auto", width: "100%" }}>
            {renderPage()}
          </main>
        </div>
      </div>
    </>
  );
}
