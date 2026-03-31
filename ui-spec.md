# Placement Portal — Complete UI Specification

> This document is the single source of truth for every page, component, layout, and interaction in the placement portal. Use it as a prompt when building any page.

---

## Global Design System

### Layout Shell
- Left sidebar: 240px wide, fixed, dark background (`gray-900`), collapsible to 64px icon-only mode
- Top navbar: 60px tall, white, sticky, contains page title + right-side actions (notifications bell, avatar menu)
- Main content area: fluid, padding `24px`, background `gray-50`
- All cards: white background, `rounded-xl`, `shadow-sm`, `border border-gray-100`
- Max content width: 1280px, centered

### Typography
- Font: Inter (system fallback: sans-serif)
- Page titles: 24px, font-weight 600
- Section headings: 18px, font-weight 600
- Card titles: 15px, font-weight 500
- Body: 14px, font-weight 400, color `gray-700`
- Captions / metadata: 12px, color `gray-500`

### Color Palette
- Primary: `indigo-600` (buttons, active states, links)
- Success: `emerald-500`
- Warning: `amber-500`
- Danger: `red-500`
- Info: `blue-500`
- Neutral bg: `gray-50`
- Card bg: `white`
- Sidebar bg: `gray-900`
- Sidebar text active: `white`
- Sidebar text inactive: `gray-400`

### Component Standards
- Buttons: `rounded-lg`, `px-4 py-2`, `text-sm font-medium`
- Primary button: `bg-indigo-600 text-white hover:bg-indigo-700`
- Secondary button: `border border-gray-300 text-gray-700 hover:bg-gray-50`
- Danger button: `bg-red-600 text-white`
- Input fields: `border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500`
- Badges / pills: `rounded-full px-2.5 py-0.5 text-xs font-medium`
- Avatars: circular, initials fallback with colored bg based on name hash
- Tables: `text-sm`, alternating row hover `hover:bg-gray-50`, sticky header
- Modals: centered, max-w-lg, backdrop blur, `rounded-2xl`
- Toasts: bottom-right, slide-in, auto-dismiss 4s
- Skeleton loaders on every data-fetching card/table
- Empty states: centered illustration + heading + CTA button

### Sidebar Navigation (per role)

#### Student sidebar
- Dashboard (home icon)
- My Profile
- My Resume
- Jobs & Placements
- My Applications
- Calendar
- Chat
- Meetings
- Coding Tests
- Practice Arena
- Notifications
- Settings

#### Recruiter sidebar
- Dashboard
- Company Profile
- Post a Job / Drive
- Manage Drives
- Candidates
- Calendar
- Chat
- Meetings
- Create Test
- Analytics
- Notifications
- Settings

#### Admin sidebar
- Dashboard
- Users (Students / Recruiters)
- Companies
- All Drives
- All Applications
- Calendar
- Analytics & Reports
- Notifications
- System Settings

---

## Page 1 — Login / Register

### URL: `/login`, `/register`

### Layout
- Centered card, max-w-md, no sidebar, full-page gradient background (`indigo-50` to `white`)
- Logo top-center inside card
- Below logo: page title ("Sign in to your account")

### Login page fields
- Email input (autofocus)
- Password input (show/hide toggle button)
- "Remember me" checkbox
- "Forgot password?" link → modal with email input, sends reset email
- Primary CTA: "Sign in" button (full width)
- Divider: "or continue with"
- Google OAuth button (Google logo + "Sign in with Google")
- Bottom link: "Don't have an account? Register"

### Register page fields
- Full name
- Email
- Password + Confirm password (strength meter below password: weak/fair/strong)
- Role selector: three large cards — Student / Recruiter / Admin — with icon, title, description. Selected card gets `ring-2 ring-indigo-600`
- If Student: College name, Roll number, Branch (dropdown), Graduation year
- If Recruiter: Company name, Designation, Company size (dropdown)
- Terms checkbox: "I agree to Terms of Service and Privacy Policy"
- CTA: "Create account" button
- Back to login link

### Post-login
- Redirect to role-specific dashboard
- If profile incomplete: redirect to profile setup wizard

---

## Page 2 — Profile Setup Wizard (first-time only)

### URL: `/onboarding`

### Layout
- No sidebar during onboarding
- Progress bar at top: steps 1–5 with labels
- Card centered max-w-2xl
- "Back" and "Next / Finish" buttons at bottom

### Step 1 — Personal info (Student)
- Profile photo upload (circular crop, drag-and-drop or click)
- Full name (pre-filled from registration)
- Date of birth (date picker)
- Gender (radio: Male / Female / Prefer not to say)
- Phone number (with country code selector)
- LinkedIn URL
- GitHub URL
- Personal website URL
- Bio (textarea, 300 char limit with counter)

### Step 2 — Academic details (Student)
- College / University (searchable dropdown — admin-managed list)
- Department / Branch
- Degree (B.Tech / M.Tech / MBA / BCA / MCA etc.)
- CGPA / Percentage (toggle between the two)
- Graduation year (dropdown)
- 10th percentage + board
- 12th percentage + board
- Any active backlogs (Yes/No toggle) — if Yes: number of backlogs

### Step 3 — Skills & experience
- Skills: tag input (type and press Enter, searchable from preset list, add custom)
- Technical skills section (auto-categorized: Languages, Frameworks, Tools, Cloud)
- Work experience: repeatable card — Company, Role, Start date, End date (or "Current"), Description (textarea)
- Projects: repeatable card — Title, Tech stack tags, Live URL, GitHub URL, Description
- Certifications: repeatable card — Title, Issuer, Date, Credential URL

### Step 4 — Resume upload or generate
- Two options as big cards:
  - "Upload existing resume" → file picker (PDF only, max 5MB) → shows PDF preview after upload → AI parses and fills profile fields from resume (shows a diff of what it found)
  - "Generate from profile" → button → AI builds resume from steps 1–3 → opens resume editor
- ATS score shown after upload/generate: circular progress (0–100), colored red/amber/green, with tips list below

### Step 5 — Preferences (Student)
- Job roles interested in (multi-select tag input)
- Preferred locations (multi-select)
- Expected CTC range (slider: 0–50 LPA)
- Open to: Full-time / Internship / Both (toggle chips)
- Notification preferences: Email / SMS / Push — toggles for each type

---

## Page 3 — Student Dashboard (Home)

### URL: `/dashboard`

### Layout
- Full sidebar visible
- Top: "Good morning, [Name]" + date
- Content in responsive grid

### Sections

#### Stats bar (4 cards, horizontal)
- Applications sent (number + "this month" sub-label)
- Tests taken
- Interviews scheduled
- Offers received
- Each card: icon, large number, sub-label, tiny sparkline trend

#### Upcoming events (calendar widget)
- Compact month calendar on left
- Right side: list of next 3 events (color-coded by type: test/interview/deadline)
- Each event: colored dot, title, date+time, company logo, "View details" link
- "View full calendar" button bottom

#### Active applications (table, max 5 rows)
- Columns: Company logo + name, Role, Applied date, Status (colored badge), Action
- Status badges: Applied (gray), Shortlisted (blue), Test scheduled (amber), Interview (purple), Offer (green), Rejected (red)
- Action: "Track" or "Prepare"
- "View all applications" link bottom-right

#### Recommended jobs (horizontal scroll cards)
- Each card: company logo, job title, location, package, deadline countdown, "Apply" button
- Tag if eligible/ineligible (green lock-open / red lock-closed icon)
- "View all jobs" link

#### Coding streak (Practice arena widget)
- Flame icon + current streak number + "day streak"
- This week: 7 mini squares (colored if solved that day)
- "Problems solved this week": number
- "Continue practicing" button → goes to Practice Arena

#### Notifications preview (last 3)
- Each: icon, message text, time ago
- "View all" link

#### AI tip of the day
- Card with robot icon
- One AI-generated tip based on profile gaps or upcoming events
- "Ask AI" button → opens AI chat modal

---

## Page 4 — My Profile

### URL: `/profile`

### Layout
- Two-column: left 1/3 (profile card + quick links), right 2/3 (tabbed sections)
- Edit mode toggle (pencil icon top-right of card) — inline editing, auto-save

### Left column — Profile card
- Large circular avatar (click to change)
- Full name (large, 20px)
- Role badge + Department
- College name
- CGPA badge
- Graduation year
- Contact icons: email, phone, LinkedIn, GitHub (clickable)
- Public profile link: `platform.com/u/username` with copy button
- Profile completion meter: circular progress, percentage, "Complete your profile" CTA if < 80%
- Resume quick actions: "View Resume" | "Download PDF" | "Edit Resume"

### Right column — Tabs

#### Tab: Personal
- All personal fields from onboarding step 1 + 2
- Editable inline — click field to edit, click away to save
- Academic details card: CGPA, 10th, 12th in a 3-column grid

#### Tab: Skills & Experience
- Skills section: tags with remove buttons in edit mode, "+ Add skill" button
- Work experience: timeline-style cards, each expandable
- Projects: card grid (2 columns), each with title, tech tags, live/GitHub links, description
- Certifications: list with issuer + date + credential link

#### Tab: Resume
- Embedded PDF viewer (full height of tab)
- Toolbar above viewer: "Edit", "Download", "Share link", "ATS Score"
- Version switcher dropdown if multiple resume versions exist
- ATS score panel on right: score ring + breakdown (keywords, format, length, sections)

#### Tab: Preferences
- All preference fields from onboarding step 5
- Notification preferences with individual toggles

#### Tab: Activity
- Timeline of all platform activity: applications, tests taken, messages, profile edits
- Filterable by type

---

## Page 5 — Resume Editor

### URL: `/resume/edit`

### Layout
- Split screen: left editor (40%), right live PDF preview (60%)
- Top toolbar: Save, Download PDF, ATS Score, Template picker, Version history

### Left editor panels (accordion sections)
- Personal info (name, contact, links)
- Summary / Objective (rich text, AI "Improve" button)
- Education (repeatable, drag to reorder)
- Work experience (repeatable, drag to reorder, AI "Improve bullet" per bullet point)
- Projects (repeatable)
- Skills (tag input, grouped by category)
- Certifications (repeatable)
- Achievements / Extra-curricular (repeatable)

### Template picker (modal)
- Grid of 6 templates: Modern, Classic, Minimal, Creative, ATS-Optimized, Two-column
- Preview thumbnail per template
- "Apply" button — instantly re-renders right preview

### AI features in editor
- "Tailor to job" button: paste job description → AI rewrites experience bullets and skills to match
- Per-bullet "Improve" button: AI rewrites that bullet to be more impactful (action verb, numbers)
- "Generate summary" button: AI writes a 2-sentence professional summary from profile
- ATS score panel: live-updating score as you edit, list of issues (missing keywords, formatting problems)

### Right preview
- Live PDF render updates within 500ms of any edit
- Zoom in/out controls
- Page indicator if multi-page

---

## Page 6 — Jobs & Placements

### URL: `/jobs`

### Layout
- Left filter panel (260px), right job listings

### Filter panel
- Search bar (searches title, company, description)
- Job type: Full-time / Internship / Both (checkbox group)
- Location: multi-select searchable dropdown
- CTC range: dual-handle slider (0–50 LPA)
- Skills required: multi-select tag input
- Company: multi-select
- Eligible only toggle (hides ineligible jobs)
- Posted within: Today / This week / This month
- "Apply filters" + "Reset" buttons
- Active filters shown as dismissible chips below

### Job listings (right)
- Sort bar: "Newest first" dropdown + total count ("Showing 24 jobs")
- Job cards (list view):
  - Company logo (left)
  - Job title (bold), company name, location
  - CTC / Stipend badge
  - Deadline: "Closes in 3 days" (red if < 2 days)
  - Required skills: up to 4 tags, "+N more"
  - Eligibility indicator: green checkmark (eligible) or lock icon (ineligible — hover shows reason)
  - "Save" bookmark icon (top-right of card)
  - "View details" button
  - If already applied: "Applied" badge replaces button

### Job detail — side panel (opens right when card clicked)
- Slides in from right (don't navigate away from list)
- Company logo + name + website link
- Job title, location, job type, CTC
- Application deadline with countdown
- Sections: About Role, Responsibilities, Requirements, About Company, Selection Process
- Eligibility checker: green ticks / red crosses for each criterion (CGPA, branch, backlogs)
- "Apply Now" button (full width, prominent) or "Applied on [date]" status
- "Add to calendar" button (adds deadline to placement calendar)
- "Save job" bookmark
- Share job link (copies URL)

### Applied tab
- Shows all jobs user has applied to
- Same card format but with status badge and timeline

### Saved tab
- Bookmarked jobs, same card format

---

## Page 7 — My Applications

### URL: `/applications`

### Layout
- Full-width table with filter bar above

### Filter bar
- Search by company/role
- Status filter (multi-select dropdown)
- Date range picker

### Table columns
- Company (logo + name)
- Role
- Drive / Batch
- Applied on
- Last updated
- Status (colored badge with icon)
- Actions dropdown

### Status flow (shown as stepper on row expand)
Applied → Shortlisted → Test Scheduled → Test Completed → Interview Scheduled → Interview Completed → Offer / Rejected

### Row expand (click row to expand)
- Full status stepper with dates at each stage
- Any notes from recruiter visible here
- Documents submitted (resume version used)
- Test score (if test completed and score released)
- Action buttons relevant to current status:
  - "Take test" (if test scheduled and open)
  - "Join meeting" (if interview now)
  - "Download offer letter" (if offer)
  - "Request feedback" (if rejected)

---

## Page 8 — Placement Calendar

### URL: `/calendar`

### Layout
- Top: view toggle (Month / Week / Day / Agenda) + navigation arrows + "Today" button + "Add event" (admin/recruiter only)
- Main: calendar grid

### Month view
- Standard calendar grid
- Events shown as colored pills on dates
- Colors: red = deadline, amber = test, purple = interview, teal = result day, blue = info session
- "+N more" if overflow on a day
- Click day → shows day panel on right with all events for that day
- Click event → event detail modal

### Week view
- Time-based grid (8am–8pm)
- Events as time blocks

### Day view
- Single column timeline
- Detailed event blocks

### Agenda view (best for mobile)
- Chronological list of upcoming events
- Grouped by date

### Event detail modal
- Event title, company, type
- Date, time, duration
- Location / meeting link
- Description / instructions
- Your slot (if interview with slot assignment)
- "Add to Google Calendar" button
- "Set reminder" (15min / 1hr / 1day before)
- "Join meeting" button if it's a video interview

### For admin/recruiter — Add event modal
- Title, type (dropdown), company, description
- Date + time + duration
- All-day toggle
- Target audience: all students / specific branches / specific eligibility
- Repeat: none / daily / weekly
- Reminder settings

---

## Page 9 — Chat

### URL: `/chat`

### Layout
- Three-column: conversation list (320px left), chat area (center, flex), member info (280px right, toggleable)

### Left column — Conversation list
- Search bar at top
- Tabs: "Rooms" | "Direct Messages"
- Rooms tab: list of placement group rooms the student is part of
  - Each item: company logo, room name, last message preview, time, unread count badge
  - Pinned rooms at top (admin-pinned)
- DMs tab: list of direct message threads
  - Each item: avatar, name, online indicator (green dot), last message, time
- "New DM" button (opens user search modal)

### Center — Chat area
- Top bar: room/user name, member count (for rooms), video call icon, info toggle icon
- Messages area (scrollable, infinite scroll up for history)
  - Date separators ("Today", "Yesterday", "Dec 20")
  - Message bubble: avatar left, name + time above (for rooms), message text
  - Own messages: right-aligned, indigo background
  - Others: left-aligned, white card
  - Reactions: hover message → emoji reaction picker (shows +, and 😀 icons)
  - Reply: hover → "Reply" button → quotes original message above reply input
  - Long messages: "Read more" truncation at 5 lines
  - File messages: file icon + name + size + download button
  - Image messages: inline thumbnail, click to open lightbox
  - Pinned message banner (if any) at top of chat area
- Announcement-only rooms: input area replaced with "Only admins can send messages" notice
- Input area (bottom):
  - Text input (auto-grows, max 4 lines)
  - Emoji picker button
  - File attachment button (images, PDF, max 10MB)
  - Send button (or Enter to send, Shift+Enter for newline)
  - Typing indicator shows when others are typing

### Right column — Info panel (toggleable)
- For rooms: room name, description, member list (avatar + name + role), pinned messages, files shared
- For DMs: user profile card (avatar, name, role, company/college), mutual rooms, files shared

### Message features
- Read receipts (single check = sent, double check = delivered, blue double = read) — DMs only
- Online/offline/away status
- Message search (magnifier icon in top bar → search input → results with "Jump to message")
- Auto-archive rooms: banner shows "This room was archived on [date]" for ended drives

---

## Page 10 — Meeting Rooms

### URL: `/meetings`

### Layout
- Two views: Upcoming Meetings list, and active meeting room

### Meetings list page
- Top: "Join by code" input + button (enter 6-digit room code)
- Upcoming meetings cards (sorted by date):
  - Company logo, meeting title, type (Technical / HR / Group Discussion)
  - Date + time + duration
  - Interviewer name + role
  - Your slot number
  - Status badge: Scheduled / Starting soon / Live / Completed
  - "Prepare" button → goes to meeting info page
  - "Join" button (active 10min before start)
- Past meetings section (collapsed by default)

### Meeting info page — `/meetings/[id]`
- Header: Company logo + meeting title + status badge
- Grid layout:
  - Left (2/3): meeting details card, preparation checklist, topics to prepare
  - Right (1/3): slot info card, pre-join check card

- Meeting details card:
  - Date, time, expected duration
  - Meeting type (Technical / HR / GD)
  - Round number (e.g., "Round 2 of 3")
  - Interviewer(s): avatar, name, designation
  - Instructions from recruiter (rich text)

- Slot info card:
  - Your slot: "Slot 4 of 12"
  - Estimated time: "~2:15 PM (if on schedule)"
  - Status: "On time" / "Running 10 minutes late"
  - Slots ahead of you (mini list showing statuses)

- Preparation checklist card:
  - AI-generated topics to prepare based on job role
  - Checkbox each item as done
  - "Generate mock questions" button → opens AI mock interview

- Pre-join check card:
  - Camera check: green/red with live preview thumbnail
  - Microphone check: level meter
  - Internet speed indicator
  - "Fix issues" guidance links
  - "Join meeting" button (prominent, indigo, full width) — disabled until 10min before

- React to recruiter:
  - "Running late" button → sends notification to recruiter
  - "Reschedule request" button → opens form with reason + preferred times

### Active meeting room — `/meetings/[id]/room`
- Full-screen layout (no sidebar)
- Video grid: large main video (interviewer), small self-preview (corner)
- Bottom control bar:
  - Mute/unmute mic
  - Camera on/off
  - Screen share
  - Chat (side panel)
  - Participants list
  - Leave meeting (red button, right)
- Top-right: recording indicator if being recorded (with consent banner on join)
- Post-meeting: auto-redirect to feedback page

### Post-meeting feedback page
- "How did the interview go?" — 5-star rating
- Short text: "Any notes for yourself?" (private, not sent to recruiter)
- "General feedback from recruiter" shown if recruiter published it (never shows scorecard)

---

## Page 11 — Coding Tests (Student)

### URL: `/tests`, `/tests/[id]`, `/tests/[id]/start`

### Tests list page
- Tabs: Upcoming / Active / Completed
- Each test card:
  - Company logo + test name
  - Date, time, duration
  - Number of questions
  - Languages allowed (tag chips)
  - Status badge
  - "View instructions" or "Start test" or "View result" button

### Test instructions page — `/tests/[id]`
- Full-screen card, no sidebar
- Sections:
  - Test overview: company, name, duration, questions count, marks
  - Rules (bulleted list):
    - Must use fullscreen
    - Tab switching is monitored (3 warnings then auto-submit)
    - Camera must be on at all times
    - No copy-paste
    - Code must run successfully (at least partially) before submitting
    - Timer continues even if you close the browser
  - Allowed languages list
  - Scoring: how marks are calculated per question (test cases)
  - "I have read and agree to the rules" checkbox
  - System check:
    - Camera: live preview, green tick when working
    - Microphone: level bar, green tick
    - Fullscreen: test fullscreen button, green tick when in fullscreen
    - Stable connection: indicator
  - "Begin Test" button (disabled until all checks pass + checkbox ticked)

### Active test page — `/tests/[id]/start`
- Forces fullscreen (Fullscreen API)
- No sidebar, no header, completely isolated UI

#### Layout
- Left panel (280px): Question navigator + test info
- Center: Question display + code editor
- Right panel (240px): Test case results + output

#### Left panel — Question navigator
- Timer: large countdown `HH:MM:SS`, turns red at <10min
- Camera feed: small thumbnail (face-api.js monitoring, blurs if face not detected)
- Flag counter: "Flags: 2" with warning icon (increments on each violation)
- Question list: numbered buttons (Q1, Q2, Q3...)
  - Color: gray = not visited, blue = attempted, green = completed, red = flagged (not sure)
- "Mark for review" toggle per question

#### Center — Question area (top) + Code editor (bottom)
- Question area:
  - Question number + difficulty badge (Easy/Medium/Hard) + marks
  - Problem statement (markdown rendered: can include code blocks, tables, examples)
  - Input/Output examples in code blocks
  - Constraints list
  - "Hints" button (limited, costs marks or admin-disabled for tests)

- Editor toolbar:
  - Language selector dropdown (only allowed languages)
  - Theme toggle (light/dark)
  - Font size +/- buttons
  - Reset code to template button

- Monaco code editor:
  - No autocomplete of full solutions (basic intellisense only)
  - Copy-paste intercept: shows warning toast, logs flag
  - Right-click disabled

- Below editor:
  - Custom input toggle (text area to provide manual test input)
  - "Run code" button (runs against sample test cases)
  - "Submit question" button (runs against hidden test cases)

#### Right panel — Output + results
- After Run:
  - Execution time + memory used
  - Sample test cases: green/red pass/fail per case
  - Actual output vs expected output diff
  - Compilation errors (if any) in red monospace

- After Submit:
  - Passed X/Y test cases
  - Score for this question
  - "View details" expander

#### Warning overlay
- Tab switch detected → full-screen orange overlay: "Warning! Tab switch detected. Warning 2/3. Next violation will auto-submit your test." + "Return to test" button
- Face not detected for 30s → same overlay
- Fullscreen exit → overlay + force re-enter fullscreen

#### Auto-submit
- When timer hits 0:00 → animated "Time's up! Submitting..." overlay → submits all code → redirects to test complete page

### Test complete page
- "Test submitted successfully" message + company logo
- Summary: questions attempted, estimated score (if shown immediately)
- "Result will be declared on [date]" info
- CTA: "Back to tests" or "Practice similar problems"

### Test result page (after recruiter releases)
- Score card: total score, percentile rank among all participants
- Per-question breakdown: score, test cases passed, time complexity
- Code review: your submitted code shown with line-by-line AI feedback
- Performance graph: your score vs average vs top scorer

---

## Page 12 — Recruiter: Create & Manage Test

### URL: `/recruiter/tests/create`, `/recruiter/tests/[id]/monitor`

### Create test page
- Step 1: Test details
  - Test name, company (pre-filled), associated drive (dropdown)
  - Duration (minutes), start datetime, end datetime
  - Allowed languages (multi-select)
  - Proctoring settings: camera required (toggle), tab switch limit (number), allow hints (toggle), show results immediately (toggle)

- Step 2: Add questions
  - Question bank: searchable, filterable by difficulty/tags/topic
  - Drag questions from bank to test
  - Or: "Create new question" → opens question editor:
    - Problem statement (rich text markdown)
    - Input/output format
    - Sample test cases (add multiple)
    - Hidden test cases (add multiple, never shown to candidate)
    - Difficulty, topic tags, time limit, memory limit
    - Expected time/space complexity
    - Solution (private, for reference)
  - Marks per question (editable per question in the test)
  - Total marks auto-calculated

- Step 3: Assign candidates
  - Select from eligible candidates list (based on drive applicants)
  - Or import CSV (roll numbers)
  - Preview: count of students assigned

- Step 4: Review + Publish
  - Full summary: settings, question list, candidate count
  - "Publish test" → students get notified immediately

### Live proctoring dashboard — `/recruiter/tests/[id]/monitor`
- Header: test name, timer (time remaining), candidate count
- Grid of candidate cards (responsive, 4-6 per row):
  - Candidate name + roll number
  - Camera thumbnail (live feed via WebSocket)
  - Status: Active / Submitted / Flagged / Disconnected
  - Flag count (red badge if > 0)
  - Progress: "Q2 of 3 attempted"
  - Click card → opens candidate detail modal
- Candidate detail modal:
  - Enlarged camera feed
  - Full flag log with timestamps ("Tab switch at 14:23", "Face not detected at 15:01")
  - Current question being worked on
  - "Flag candidate" button (manual flag with note)
  - "Disqualify" button (with confirmation)
- Filter bar: show All / Flagged / Submitted / Active
- "Export flags report" button

---

## Page 13 — Practice Arena

### URL: `/practice`

### Layout
- Left panel (280px): problem list + filters
- Center: problem view + editor (same layout as test but relaxed — no proctoring)
- Right panel (240px): hints + AI feedback

### Left panel
- Search problems
- Filters: Difficulty (Easy/Medium/Hard chips), Topics (tags multi-select), Company (dropdown: problems asked in company drives), Status (Solved/Attempted/Unsolved)
- Sort: Acceptance rate / Difficulty / Recently added
- Problem list items:
  - Number, title, difficulty badge, acceptance %
  - Green check if solved, yellow dot if attempted
  - Bookmark icon
  - Company tags (small logos)

### Center — Problem view
- Same structure as test but:
  - No timer (optional self-timer toggle)
  - No flag system
  - "Hints" available (up to 3 per problem, progressively revealing)
  - "Discuss" tab: community solutions and comments (after solving or after 5 attempts)
  - "Solution" tab: AI-generated optimal solution with explanation (unlocks after solving or 5 attempts)

### Right panel — AI feedback
- After running code: AI analyzes and shows:
  - Time complexity analysis ("Your solution is O(n²). Can you do better?")
  - Space complexity
  - Code quality tips (variable names, edge cases missed)
  - "What if n=10⁶?" stress test suggestion
- "Get hint" button (shows 1 of 3 hints, soft-locked until 2 min spent on problem)
- "Explain optimal solution" button (after solve)

### Gamification sidebar widget (bottom of left panel)
- XP bar: current XP / next level XP
- Streak: flame icon + number of days
- Rank: "Top 12%" badge
- Badges earned (mini icons, hover for name)
- Leaderboard: "View full leaderboard" link

### Leaderboard page `/practice/leaderboard`
- Tabs: Weekly / Monthly / All-time
- Table: Rank, Avatar, Name, Branch, Problems solved, XP, Streak
- Your rank highlighted
- Filter by branch/batch

### Mock test mode `/practice/mock`
- Select 3 random questions (or by topic/difficulty)
- Enable timer (90 min or 180 min)
- Same proctoring-like UI (no actual proctoring, just the UX)
- After submit: score + rank among others who did same mock + AI review

---

## Page 14 — Recruiter Dashboard

### URL: `/recruiter/dashboard`

### Sections
- Active drives: card per drive — title, applicants count, status, next milestone
- Pipeline funnel chart: how many students at each stage across all drives
- Candidate activity feed: recent applications, test completions, interview no-shows
- Upcoming interviews today: list sorted by time, each with candidate name + time + room join button
- Messages: unread DM count + preview
- Quick actions: "Post new job", "Create test", "Schedule interviews"

---

## Page 15 — Recruiter: Manage Drive

### URL: `/recruiter/drives/[id]`

### Tabs

#### Tab: Overview
- Drive details: title, description, open/close dates, eligibility criteria
- Metrics: total applicants, shortlisted, tests sent, interviews done, offers made
- Pipeline funnel visualization (horizontal bar chart)
- Drive timeline with editable milestones

#### Tab: Candidates
- Table with all applicants
- Columns: Avatar, Name, Roll no., Branch, CGPA, Applied date, Status, Actions
- Status filter + search
- Bulk actions: select multiple → bulk shortlist / bulk reject / bulk assign test / bulk schedule interview
- Per row actions: View profile, Change status, Send message, Schedule interview

#### Tab: Shortlisting
- AI-powered shortlisting panel:
  - Set weight sliders: CGPA (0–100%), Skills match (0–100%), Projects (0–100%)
  - "Auto-shortlist top N" button → AI ranks candidates → shows preview list
  - Manual override: drag candidates between "Shortlisted" and "Not shortlisted" columns
  - "Send notifications" button (notifies shortlisted students)

#### Tab: Test
- Assigned test card (with monitor button)
- Test performance stats: avg score, highest, lowest, pass rate
- Score distribution histogram
- Candidates who didn't attempt (with "Send reminder" button)

#### Tab: Interviews
- Schedule view: calendar or list
- Each interview: candidate, time slot, interviewer, room link, status
- "Schedule batch" button → opens scheduler:
  - Pick candidates (from shortlisted)
  - Set interview duration
  - Set interviewer(s)
  - Set date range + available times
  - System auto-generates slots → preview → confirm → students notified
- Join room buttons for live/upcoming interviews

#### Tab: Offers
- List of candidates who received offers
- Offer letter upload per candidate
- "Mark as joined" toggle
- Export offer data as CSV

---

## Page 16 — Notifications

### URL: `/notifications`

### Layout
- Full-width, single-column list
- Filter chips: All / Unread / Applications / Tests / Interviews / System

### Notification item
- Icon (colored by type)
- Title (bold) + description text
- Time ago
- Unread: left blue border + slightly highlighted bg
- Action button if actionable ("View test", "Join interview", "View offer")
- Click anywhere on item → marks as read + navigates to relevant page

### Settings link at top → `/settings/notifications`

---

## Page 17 — Settings

### URL: `/settings`

### Layout
- Left sub-nav (180px): settings categories
- Right: content panel

### Categories

#### Profile settings
- Change name, email, phone
- Change password (current password required)
- Connected accounts: Google OAuth status + disconnect button
- Delete account (danger zone, requires password confirmation)

#### Notification preferences
- Table of notification types × channels (Email / SMS / Push / In-app)
- Toggle each cell independently
- Notification types: Applications, Tests, Interviews, Offers, Chat messages, Reminders, System announcements

#### Privacy
- Profile visibility: Public / Only recruiters / Private
- Show CGPA on public profile: toggle
- Show contact info on public profile: toggle
- Data export: "Download my data" button (generates zip, emails link)

#### Appearance
- Theme: Light / Dark / System (radio)
- Sidebar collapsed by default: toggle
- Density: Comfortable / Compact (affects table row height and spacing)

#### Resume settings
- Default resume version (dropdown)
- Auto-update resume from profile changes: toggle
- ATS optimization level: Standard / Aggressive (affects AI resume rewrites)

---

## Page 18 — Admin Dashboard

### URL: `/admin/dashboard`

### Sections
- Platform stats (6 cards): Total students, Total recruiters, Active drives, Tests conducted, Offers made, Platform uptime
- Recent registrations feed (students + recruiters)
- Drive activity timeline (all active drives progress)
- Quick actions: Add user, Add company, Broadcast announcement
- System health: DB status, Redis status, Job queue length, Error rate (last 24h)

---

## Page 19 — Admin: Users

### URL: `/admin/users`

### Tabs: Students | Recruiters

### Students table
- Columns: Avatar, Name, Roll no., Branch, CGPA, Batch, Registration date, Status (Active/Blocked), Actions
- Bulk import via CSV button
- Per row: View profile, Edit, Block/Unblock, Delete
- Export as CSV/Excel

### Student detail modal
- Full profile read-only view
- All applications with statuses
- Test history + scores
- Activity log
- Edit eligibility overrides (manually override CGPA/backlog for specific drives)
- Block with reason (reason shown to student as banner)

---

## Page 20 — Admin: Analytics & Reports

### URL: `/admin/analytics`

### Tabs

#### Placement overview
- Placement rate: large % with trend vs last year
- Companies visited: count
- Average CTC (and median CTC)
- Highest/lowest package
- Branch-wise placement rates: horizontal bar chart
- Month-wise offers: line chart

#### Drive performance
- Table: Company, Drive name, Applicants, Shortlisted, Offered, Acceptance rate
- Sortable, filterable by batch/year

#### Student performance
- Avg test score across all tests
- Top performers leaderboard
- Skill gap analysis: what skills are students weakest in (from test tag analysis)

#### Company insights
- Repeat companies (who came back from last year)
- Company feedback scores (from student post-interview ratings)

#### Export
- "Generate NAAC report" button → PDF with all standard metrics
- "Generate placement brochure data" → Excel
- Custom date range picker for all charts

---

## Page 21 — Public Profile

### URL: `/u/[username]`

### Layout
- No sidebar, public page (no login required)
- Clean, resume-like layout

### Sections
- Header: avatar, name, role, college, graduation year, CGPA (if public)
- Contact icons (only those marked public)
- Bio
- Skills (grouped by category)
- Experience timeline
- Projects (card grid)
- Certifications list
- "Connect on LinkedIn" button
- "Send message" button (requires login → redirects to login then back)
- "Download resume" button (only if student enabled it)

---

## Page 22 — Company Profile (Public)

### URL: `/companies/[slug]`

### Layout
- Banner image area (company cover photo)
- Company logo + name + website + industry + size
- Tabs: About | Past Drives | Reviews

#### About tab
- Description (rich text)
- Key info: Founded, HQ location, Industry, Employees, Website
- Social links

#### Past drives tab
- Year-wise list of drives
- Each: title, year, roles offered, students hired, package range

#### Reviews tab
- Anonymous student reviews (submitted post-drive)
- Star rating (overall, interview experience, offer process)
- Review text
- "Write a review" button (only if you've applied to them)

---

## Page 23 — AI Mock Interview

### URL: `/ai/mock-interview`

### Layout
- Full-screen, clean, no sidebar (focused mode)
- Two modes: Text mode, Voice mode (toggle top-right)

### Setup screen
- "Configure your mock interview"
- Job role input (searchable: SDE, Data Analyst, PM etc.)
- Company targeting: optional (tailors questions to that company's style)
- Interview type: Technical / HR / Mixed
- Difficulty: Easy / Medium / Hard
- Duration: 15min / 30min / 45min
- "Start interview" button

### Active interview screen
- Top: role name, timer, "End interview" button
- AI interviewer panel:
  - Animated avatar or waveform (voice mode)
  - Current question displayed as text (always, even in voice mode)
  - Question number indicator
- User response area:
  - Text mode: large textarea, "Submit answer" button
  - Voice mode: waveform visualizer, press-and-hold mic button to speak, auto-transcribes
- Previous Q&A visible above (scrollable history)
- If technical: Monaco editor panel slides in for coding questions

### Feedback page (after interview ends)
- Overall score (0–100) with letter grade
- Breakdown radar chart: Communication, Technical accuracy, Problem-solving, Confidence, Clarity
- Per-question feedback:
  - Your answer (collapsible)
  - AI feedback paragraph
  - Score for that question
  - Model answer (what a great answer looks like)
- Key strengths: bullet list
- Areas to improve: bullet list with resources
- "Retake interview" and "Share report" buttons

---

## Page 24 — Referrals & Network

### URL: `/network`

### Layout
- Left: network stats + quick actions
- Center: feed of connections + alumni

### Stats
- Profile views this week
- Connections count
- Referrals sent / received

### Alumni network
- Grid of alumni cards: avatar, name, batch, current company, role
- Filter by company / batch / branch
- "Connect" button (sends connection request)
- "Request referral" button → opens modal: select company + message

### Referral requests panel
- Incoming referral requests (if you're an alumni/placed student)
- Each: requester name, target company, message, "Accept" / "Decline" buttons
- Outgoing requests: status tracking

---

## Global Components

### Notification bell (top navbar)
- Badge with unread count
- Click → dropdown of last 5 notifications
- "View all" link at bottom

### User avatar menu (top-right)
- Avatar + name + role
- Links: My Profile, My Resume, Settings, Help
- "Sign out" button (bottom, slightly red)

### Command palette (Ctrl+K)
- Modal search bar
- Searches: pages, jobs, candidates, settings
- Recent actions shown before typing
- Keyboard navigable results

### Global search (top navbar)
- Magnifier icon → expands to input
- Real-time results dropdown: Jobs, Candidates, Companies, Pages
- Powered by Meilisearch

### Onboarding tooltips
- First-time users get highlighted UI elements with tooltip explanations
- "Got it" to dismiss each, "Skip tour" to dismiss all
- Stored in localStorage

---

## Mobile Responsiveness

### Breakpoints
- Mobile: < 768px — sidebar becomes bottom tab bar (5 main tabs)
- Tablet: 768px–1024px — sidebar collapsible, content adapts
- Desktop: > 1024px — full layout

### Mobile-specific
- Bottom tab bar: Home, Jobs, Chat, Tests, Profile
- Swipe gestures: swipe right on chat list item to mark read, swipe left to delete
- Pull-to-refresh on lists
- Meeting room: single video (interviewer), self-preview as small overlay
- Code editor: landscape mode recommendation toast on test start

---

*End of UI Specification — v1.0*
*Total pages: 24 main pages + global components*
*Roles covered: Student, Recruiter, Admin*