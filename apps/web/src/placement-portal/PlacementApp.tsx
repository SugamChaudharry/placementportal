"use client";

import { useState } from "react";
import { GlobalStyles } from "@/placement-portal/components/GlobalStyles";
import { PortalSidebar } from "@/placement-portal/components/layout/PortalSidebar";
import { PortalTopNav } from "@/placement-portal/components/layout/PortalTopNav";
import { AdminAnalyticsPage } from "@/placement-portal/pages/admin/AdminAnalyticsPage";
import { AdminApplicationsPage } from "@/placement-portal/pages/admin/AdminApplicationsPage";
import { AdminCompaniesPage } from "@/placement-portal/pages/admin/AdminCompaniesPage";
import { AdminDashboard } from "@/placement-portal/pages/admin/AdminDashboard";
import { AdminDrivesPage } from "@/placement-portal/pages/admin/AdminDrivesPage";
import { AdminSettingsPage } from "@/placement-portal/pages/admin/AdminSettingsPage";
import { AdminUsersPage } from "@/placement-portal/pages/admin/AdminUsersPage";
import { ApplicationsPage } from "@/placement-portal/pages/ApplicationsPage";
import { AuthPage } from "@/placement-portal/pages/AuthPage";
import { CalendarPage } from "@/placement-portal/pages/CalendarPage";
import { ChatPage } from "@/placement-portal/pages/ChatPage";
import { JobsPage } from "@/placement-portal/pages/JobsPage";
import { MeetingsPage } from "@/placement-portal/pages/MeetingsPage";
import { MockInterviewPage } from "@/placement-portal/pages/MockInterviewPage";
import { NetworkPage } from "@/placement-portal/pages/NetworkPage";
import { NotificationsPage } from "@/placement-portal/pages/NotificationsPage";
import { OnboardingPage } from "@/placement-portal/pages/OnboardingPage";
import { PracticeArenaPage } from "@/placement-portal/pages/PracticeArenaPage";
import { ProfilePage } from "@/placement-portal/pages/ProfilePage";
import { CreateTestPage } from "@/placement-portal/pages/recruiter/CreateTestPage";
import { ManageDrivePage } from "@/placement-portal/pages/recruiter/ManageDrivePage";
import { PostJobPage } from "@/placement-portal/pages/recruiter/PostJobPage";
import { RecruiterAnalyticsPage } from "@/placement-portal/pages/recruiter/RecruiterAnalyticsPage";
import { RecruiterCandidatesPage } from "@/placement-portal/pages/recruiter/RecruiterCandidatesPage";
import { RecruiterCompanyPage } from "@/placement-portal/pages/recruiter/RecruiterCompanyPage";
import { RecruiterDashboard } from "@/placement-portal/pages/recruiter/RecruiterDashboard";
import { ResumeEditorPage } from "@/placement-portal/pages/ResumeEditorPage";
import { SettingsPage } from "@/placement-portal/pages/SettingsPage";
import { StudentDashboard } from "@/placement-portal/pages/StudentDashboard";
import { TestsPage } from "@/placement-portal/pages/TestsPage";

export type PortalRole = "student" | "recruiter" | "admin";

export function PlacementApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<PortalRole>("student");
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [onboarding, setOnboarding] = useState(false);

  const handleLogin = (r: PortalRole) => {
    setRole(r);
    setPage(r === "student" ? "dashboard" : r === "recruiter" ? "rec-dashboard" : "admin-dashboard");
    setLoggedIn(true);
    setOnboarding(r === "student");
  };

  if (!loggedIn) {
    return (
      <div className="placement-portal-root min-h-screen bg-slate-50">
        <GlobalStyles />
        <AuthPage onLogin={handleLogin} />
      </div>
    );
  }

  if (onboarding) {
    return (
      <div className="placement-portal-root min-h-screen bg-slate-50">
        <GlobalStyles />
        <OnboardingPage onDone={() => setOnboarding(false)} />
      </div>
    );
  }

  const sp = { setPage };

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <StudentDashboard {...sp} />;
      case "profile":
        return <ProfilePage {...sp} />;
      case "resume":
      case "resume-editor":
        return <ResumeEditorPage />;
      case "jobs":
        return <JobsPage {...sp} />;
      case "applications":
        return <ApplicationsPage />;
      case "calendar":
        return <CalendarPage />;
      case "chat":
        return <ChatPage />;
      case "meetings":
        return <MeetingsPage />;
      case "tests":
        return <TestsPage />;
      case "practice":
        return <PracticeArenaPage />;
      case "mock-interview":
        return <MockInterviewPage />;
      case "network":
        return <NetworkPage />;
      case "notifications":
        return <NotificationsPage />;
      case "settings":
        return <SettingsPage />;
      case "rec-dashboard":
        return <RecruiterDashboard {...sp} />;
      case "rec-company":
        return <RecruiterCompanyPage />;
      case "rec-post":
        return <PostJobPage />;
      case "rec-drives":
        return <ManageDrivePage />;
      case "rec-candidates":
        return <RecruiterCandidatesPage />;
      case "rec-tests":
        return <CreateTestPage />;
      case "rec-analytics":
        return <RecruiterAnalyticsPage />;
      case "admin-dashboard":
        return <AdminDashboard {...sp} />;
      case "admin-users":
        return <AdminUsersPage />;
      case "admin-companies":
        return <AdminCompaniesPage />;
      case "admin-drives":
        return <AdminDrivesPage />;
      case "admin-applications":
        return <AdminApplicationsPage />;
      case "admin-analytics":
        return <AdminAnalyticsPage />;
      case "admin-settings":
        return <AdminSettingsPage />;
      default:
        return <StudentDashboard {...sp} />;
    }
  };

  return (
    <div className="placement-portal-root min-h-screen bg-slate-50">
      <GlobalStyles />
      <div className="flex h-screen overflow-hidden">
        <PortalSidebar role={role} setRole={setRole} page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
          <PortalTopNav page={page} role={role} setPage={setPage} showNotifs={showNotifs} setShowNotifs={setShowNotifs} />
          <main className="flex-1 overflow-y-auto p-6" style={{ maxWidth: 1280, margin: "0 auto", width: "100%" }}>
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  );
}
