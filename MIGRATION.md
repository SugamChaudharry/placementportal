# Migration guide: App.tsx → proper codebase

## What was done
Your single-file App.tsx (~3500 lines) has been split into:

### packages/ui/src/components/
Shared primitives extracted:
- Button.tsx    ← was `Btn` component
- Card.tsx      ← was `Card` component  
- Badge.tsx     ← was status badge inline styles
- Toggle.tsx    ← was `Toggle` component
- Avatar.tsx    ← was inline initials logic
- Skeleton.tsx  ← new, replaces any loading states

### packages/types/src/index.ts
All TypeScript interfaces: User, Student, Job, Application, Notification, etc.

### apps/web/src/
- app/auth/login/page.tsx      ← was AuthPage()
- app/student/dashboard/page.tsx ← was StudentDashboard()
- app/student/jobs/page.tsx    ← was JobsPage()
- components/layout/Sidebar.tsx ← was Sidebar() with real Next.js Links
- components/layout/TopNav.tsx  ← was TopNav()
- lib/api.ts                   ← replaces all mock data with real API calls
- hooks/useJobs.ts             ← was JOBS constant
- hooks/useApplications.ts     ← was APPS constant
- store/auth.store.ts          ← was useState(loggedIn, role)
- store/ui.store.ts            ← was useState(collapsed, showNotifs)

### apps/server/src/modules/
- auth/  ← login, register, JWT
- jobs/  ← job listings with filtering
- applications/ ← apply, track status
- tests/ ← coding test management
- notifications/ ← real-time via Socket.io

## Pages still to migrate from App.tsx
Copy each function from App.tsx → corresponding page file:
- ProfilePage()      → apps/web/src/app/student/profile/page.tsx
- ResumeEditorPage() → apps/web/src/app/student/resume/page.tsx
- ApplicationsPage() → apps/web/src/app/student/applications/page.tsx
- CalendarPage()     → apps/web/src/app/calendar/page.tsx
- ChatPage()         → apps/web/src/app/chat/page.tsx
- MeetingsPage()     → apps/web/src/app/meetings/page.tsx
- TestsPage()        → apps/web/src/app/student/tests/page.tsx
- PracticeArenaPage()→ apps/web/src/app/practice/page.tsx
- MockInterviewPage()→ apps/web/src/app/mock-interview/page.tsx
- RecruiterDashboard() → apps/web/src/app/recruiter/dashboard/page.tsx
- AdminDashboard()   → apps/web/src/app/admin/dashboard/page.tsx
... (all others follow same pattern)

## Key changes when migrating each page
1. Add "use client"; at top
2. Wrap with <AppShell> instead of the shell being in App()
3. Replace setPage("jobs") with router.push("/student/jobs")
4. Replace JOBS constant with useJobs() hook
5. Replace APPS constant with useApplications() hook
6. Replace useState(loggedIn) with useAuth() hook
7. Import Button/Card/Badge from @portal/ui instead of inline
