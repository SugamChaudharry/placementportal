# Backend API & Data Requirements

This document outlines the detailed backend requirements based on the frontend UI specification. It maps each page and component back to the specific data it needs to fetch (GET) and the actions it needs to perform (POST/PUT/DELETE). You can use this as a blueprint for structuring your server, database models, and API endpoints (REST or GraphQL).

---

## 1. Authentication & Onboarding
**Pages**: `/login`, `/register`, `/onboarding`

### Core Features
- User login/registration with role-based routing (Student, Recruiter, Admin).
- OAuth integration (Google).
- Multi-step onboarding for profile and resume setup.
- AI-driven resume parsing.

### Backend Needs
- **POST `/api/auth/login`**: Authenticate using `email` + `password`. Returns JWT/session token and user role.
- **POST `/api/auth/register`**: Register new user. Payload includes `email`, `password`, `role`, and role-specific basic info (e.g., college name, company name).
- **POST `/api/auth/google`**: OAuth 2.0 handshake and login/registration.
- **POST `/api/auth/forgot-password`**: Initiate password reset via email.
- **GET `/api/colleges`**: Fetch a list of pre-approved colleges/universities for the dropdown.
- **POST `/api/users/onboarding`**: Save the 5-step wizard data (personal info, academic details, skills, preferences).
- **POST `/api/users/profile-photo`**: Upload and store avatar (multipart/form-data), return public URL.
- **POST `/api/resume/parse`**: Upload PDF resume. Backend passes PDF to AI parser and returns extracted structured JSON (skills, experience, education).
- **POST `/api/resume/generate`**: Trigger AI to generate a resume based on a student's profile data.
- **GET `/api/resume/ats-score`**: Calculate or retrieve the initial ATS score for the uploaded resume.

---

## 2. Student Experience

### Student Dashboard (`/dashboard`)
**Features**: Quick stats, upcoming events, active applications, job recommendations, practice streak, AI tips.
**Backend Needs**:
- **GET `/api/student/dashboard/stats`**: Fetch counts for applications, tests taken, interviews, offers received.
- **GET `/api/student/dashboard/events`**: Fetch the next 3 upcoming events (tests, interviews, deadlines).
- **GET `/api/student/dashboard/applications`**: Fetch top 5 active applications with their current status.
- **GET `/api/jobs/recommended`**: Fetch top recommended jobs based on the student's skills/preferences.
- **GET `/api/student/dashboard/streak`**: Fetch practice arena streak and weekly completion map.
- **GET `/api/student/dashboard/ai-tip`**: Generate or fetch the daily AI insight tip.

### My Profile (`/profile`)
**Features**: View/Edit profile, view activity timeline, manage preferences.
**Backend Needs**:
- **GET `/api/users/me`**: Fetch full detailed user profile.
- **PUT `/api/users/me`**: Update personal, academic, skills, or preference information inline.
- **GET `/api/users/me/activity`**: Fetch timeline of recent platform activity.

### Resume Editor (`/resume/edit`)
**Features**: Split-screen live preview, versioning, AI bullet improvements, ATS score.
**Backend Needs**:
- **GET `/api/resume/versions`**: Fetch list of user's saved resume versions.
- **PUT `/api/users/me/resume`**: Save updates made in the editor.
- **POST `/api/ai/resume/tailor`**: Payload: `job_description_text`. Returns tailored bullets/skills.
- **POST `/api/ai/resume/improve-bullet`**: Payload: `bullet_text`. Returns AI-improved text.
- **GET `/api/resume/render-pdf`**: Render current JSON resume to PDF format for the preview/download.

### Jobs & Applications (`/jobs`, `/applications`)
**Features**: Filtered job feeds, job details, bookmarking, application tracking.
**Backend Needs**:
- **GET `/api/jobs`**: Job feed supporting pagination, text search (`q`), and filters (`type`, `location`, `ctc_min`, `ctc_max`, `skills`, `company`, `eligible_only`).
- **GET `/api/jobs/:id`**: View detailed job posting and eligibility status matrix.
- **POST `/api/jobs/:id/apply`**: Submit an application.
- **POST `/api/jobs/:id/save`** & **DELETE `/api/jobs/:id/save`**: Bookmark/unbookmark a job.
- **GET `/api/jobs/saved`** & **GET `/api/jobs/applied`**: Distinct lists for saved and applied jobs.
- **GET `/api/applications`**: Fetch all applications with advanced status filtering.
- **GET `/api/applications/:id/timeline`**: Fetch the detailed status history (Applied -> Shortlisted -> Test -> Interview -> Offer) for a specific application.

---

## 3. Communication & Scheduling

### Placement Calendar (`/calendar`)
**Features**: Organization-wide and personal schedules, event detail.
**Backend Needs**:
- **GET `/api/calendar/events`**: Fetch events (tests, interviews, deadlines) for a given date range.
- **POST `/api/calendar/events`**: (Admin/Recruiter) Create a new calendar event.

### Chat (`/chat`)
**Features**: Direct messages, group placement rooms, real-time typing indicators, attachments.
**Backend Needs**:
- **GET `/api/chat/rooms` & `/api/chat/dms`**: Fetch user's active conversations.
- **GET `/api/chat/conversations/:id/messages`**: Fetch paginated message history.
- **POST `/api/chat/conversations/:id/messages`**: Send a new message (text or file attachment).
- **GET `/api/chat/users/search`**: Search directory for users to start a new DM.
- **WebSocket / SSE**: Need a real-time connection for receiving new messages, typing indicators (`typing_start`, `typing_stop`), and read receipts.

### Meeting Rooms (`/meetings`)
**Features**: Video calls, slot checking, pre-join checks, post-meeting feedback.
**Backend Needs**:
- **GET `/api/meetings/upcoming`**: Fetch user's scheduled meetings.
- **GET `/api/meetings/:id`**: Fetch detailed meeting info, interviewer details, and slot status.
- **POST `/api/meetings/:id/join`**: Get authentication payload/token for the video provider (e.g., WebRTC, Twilio, Zoom API).
- **POST `/api/meetings/:id/feedback`**: Submit post-interview ratings and notes.

---

## 4. Coding & Assessments

### Coding Tests (`/tests`, `/tests/:id`)
**Features**: Proctoring, timed environments, code execution, warning system (tab switches).
**Backend Needs**:
- **GET `/api/tests/candidate`**: List tests available to the student.
- **GET `/api/tests/:id`**: Fetch test instructions and environment config.
- **POST `/api/tests/:id/start`**: Initialize test session and start server-side timer.
- **POST `/api/tests/:id/run`**: Send code snippet and language ID to execution engine. Return execution time, memory, and sample test case results.
- **POST `/api/tests/:id/submit-question`**: Run against hidden test cases and save score.
- **POST `/api/tests/:id/flag`**: Log a proctoring violation (tab switch, face missing).
- **POST `/api/tests/:id/finish`**: Submit entire test.
- **GET `/api/tests/:id/result`**: Post-test score, percentile, and AI code review.

### Practice Arena (`/practice`)
**Features**: Un-proctored problem solving, hints, leaderboards.
**Backend Needs**:
- **GET `/api/practice/problems`**: Search & filter problem bank.
- **GET `/api/practice/problems/:id`**: Problem statement, constraints, sample I/O.
- **POST `/api/practice/problems/:id/run`** & **POST `/api/practice/problems/:id/submit`**: Execution endpoints similar to tests.
- **GET `/api/practice/problems/:id/solution`**: Fetch AI/Optimal solution (unlocked conditionally).
- **POST `/api/practice/problems/:id/hint`**: Deduct XP/marks and return a hint.
- **GET `/api/practice/leaderboard`**: Rankings based on XP and streak.

---

## 5. Recruiter Features

### Recruiter Dashboard & Manage Drives
**Features**: Pipeline charts, drive management, AI shortlisting, batch scheduling.
**Backend Needs**:
- **GET `/api/recruiter/dashboard/stats`**: High-level aggregated metrics for the company.
- **GET `/api/recruiter/drives/:id`**: Full drive details, pipeline funnels.
- **GET `/api/recruiter/drives/:id/candidates`**: List of applicants with sort/filter.
- **POST `/api/recruiter/drives/:id/shortlist/ai`**: Request backend to sort target candidates based on weights (CGPA, Skills).
- **PUT `/api/recruiter/drives/candidates/status`**: Bulk update candidate statuses (e.g., Reject, Move to Interview).
- **POST `/api/recruiter/drives/:id/schedule-batch`**: Auto-generate interview slots for N candidates given available time ranges.

### Test Management & Monitor (`/recruiter/tests`)
**Features**: Create question sets, live proctoring dashboard.
**Backend Needs**:
- **POST `/api/recruiter/tests`**: Create a new test configuration.
- **GET `/api/recruiter/questions`**: Search the global standard question bank.
- **POST `/api/recruiter/tests/:id/assign`**: Assign an array of student IDs to the test.
- **WebSocket `/api/recruiter/tests/:id/monitor`**: Real-time stream of candidate progress, live flags, and low-res automated camera thumbnail snapshots.

---

## 6. Admin, Public & Misc

### Notification & Settings
**Backend Needs**:
- **GET `/api/notifications`**: Paginated notification feed.
- **PUT `/api/notifications/read`**: Mark specific/all notifications as read.
- **PUT `/api/settings/notifications`**: Manage Notification channel matrix.
- **PUT `/api/settings/privacy`**: Manage Public visibility toggles.
- **POST `/api/users/export-data`**: Queue background job to compile ZIP of user's data.

### Admin Dashboard (`/admin/*`)
**Backend Needs**:
- **GET `/api/admin/stats`**: Global metrics (Total users, active drives, etc).
- **GET `/api/admin/users/students`** & **`/api/admin/users/recruiters`**: Manage user directories.
- **PUT `/api/admin/users/:id/block`**: Ban/restrict user operations.
- **GET `/api/admin/analytics/placement-report`**: Aggregated charting data (CTC trends, placement % by branch).

### AI Mock Interview (`/ai/mock-interview`)
**Backend Needs**:
- **POST `/api/ai/mock/start`**: Init context with role, diff, duration constraints.
- **POST `/api/ai/mock/chat`**: Standard chat interface. Send user message/transcription, get AI interviewer next query.
- **POST `/api/ai/mock/finish`**: Calculate and fetch final report, radar chart scores, and feedback.

### Network & Public Profile
**Backend Needs**:
- **GET `/api/users/public/:username`**: Fetch sanitized (public-only fields) user profile.
- **GET `/api/companies/:slug`**: Fetch public company profile & past reviews.
- **GET `/api/network/alumni`**: Fetch alumni directory.
- **POST `/api/network/connect`**: Send connection request.

---

### Core Technical Considerations for Backend
1. **Real-time Engine**: You need a reliable pub/sub or WebSockets server (e.g., Socket.io or native WebSockets + Redis) for Chat, Live Proctoring, and Interview Slot updates.
2. **Code Execution Environment**: A secure microservice/sandbox (like Piston, isolated Docker containers, or Judge0) is critical for evaluating code submissions during Tests and Practice.
3. **AI Integrations**: Requires wrapper APIs connecting to an LLM provider (OpenAI, Anthropic) for the AI-assisted Resume builder, AI Tips, Mock Interviewer, and AI Shortlisting.
4. **File Storage**: Object storage (AWS S3, Cloudinary, etc.) mapped to API routes for Profile Avatars, Resumes (PDF), and Chat Attachments.
