# Overall Architecture & Frontend Design

This document details the high-level system architecture needed to power the Placement Portal, alongside a comprehensive breakdown of the Frontend Design system.

---

## 1. High-Level System Architecture

Given the complex requirements—real-time proctoring, AI integrations, code execution, and standard CRUD operations—the system should be structured into distinct layers to ensure scalability and separation of concerns.

### A. The Client Layer (Frontend)
- **Web Application**: Built on a modern reactive framework (e.g., Next.js or React) utilizing functional components and hooks.
- **State Management**: Context API or a lightweight store (Zustand/Jotai) for global state (user context, active theme, notifications) and Server-State management (React Query/SWR) for caching API responses.
- **UI Styling**: Tailwind CSS (as defined by the utility classes in your spec) for rapid, consistent styling inline.

### B. The API & Business Logic Layer (Backend)
- **Core HTTP API**: A RESTful or GraphQL server handling primary CRUD logic (Users, Jobs, Applications, Analytics).
- **Real-Time Engine**: A WebSocket server handling bi-directional data flow for the Chat module (typing indicators, unread counts) and the Live Monitor (streaming candidate proctoring snapshots/flags).
- **AI Orchestration Service**: A dedicated service or wrapper that interfaces with LLMs (OpenAI, Anthropic) to handle the AI Mock Interviews, Resume Parsing/Generation, and Candidate Shortlisting weights.
- **Code Execution Sandbox**: A highly isolated execution environment (e.g., Judge0, Piston API, or secure Docker containers) that safely compiles and runs student code submissions against hidden test cases without risking server security.

### C. Data Persistence & Storage Layer
- **Primary Database**: A relational database (PostgreSQL/MySQL) to guarantee ACID properties for critical data like Profiles, Job postings, and Applications.
- **In-Memory Store**: Redis to handle WebSocket session brokering, active proctoring state, and rate-limiting.
- **Object/Blob Storage**: AWS S3 (or similar like Cloudinary/GCP Storage) to store user Avatars, Resume PDFs, Chat attachments, and Company cover photos.
- **Search Engine**: Meilisearch or Elasticsearch for highly contextual, typo-tolerant global search ("Command Palette" or Job Filtering).

---

## 2. Frontend Design System

The frontend serves as the single pane of glass for all three distinct user types (Student, Recruiter, Admin). It follows a strict global design language to maintain consistency.

### Visual Identity
- **Color Palette**:
  - *Primary*: Indigo-600 (used for primary actions, active states, active Sidebar links).
  - *Neutrals*: Gray-50 (app background), White (card backgrounds), Gray-900 (sidebar).
  - *Semantic Alerts*: Emerald-500 (Success), Amber-500 (Warning), Red-500 (Danger).
- **Typography**: Inter (or system sans-serif fallback). Readability is prioritized via clear font hierarchies (24px Page Titles -> 18px Section Headings -> 14px Body).

### Layout Shell Structure
The desktop application embraces a fluid layout structured into three main zones:
1. **Left Sidebar**: Fixed structure (240px default). Collapsible to 64px (icon-only). Role-specific context (changes entirely if you are a Student vs Recruiter). Dark theme (`gray-900`).
2. **Top Navbar**: 60px height. Houses the global search bar, notification bell, and user avatar dropdown. Sticks to the top while scrolling.
3. **Main Content Area**: Fluid width, padded internally (`24px`). Content is generally restricted to a maximum width of `1280px` to prevent stretching on ultrawide monitors. Content sits on unified Card structures (`rounded-xl`, `border`, `shadow-sm`).

---

## 3. Core Frontend Modules

The frontend is not just a standard dashboard; it contains incredibly complex modules that feel like "apps within the app".

### A. The Assessment Engine (Coding Tests)
A locked-down, specialized UI that completely bypasses the standard layout shell.
- **Monitoring**: Integrates `face-api.js` for local browser-level face tracking to detect if a candidate leaves the camera frame.
- **Fullscreen Enforcement**: Utilizes the native HTML5 Fullscreen API. Attempting to exit or switch tabs triggers immediate visual warnings and hooks into the backend to log a "Flag".
- **Monaco Editor**: Integrates VS Code's native editor engine (Monaco) onto the web. Configured to disable copy-paste and right-clicking.

### B. Resume Editor
Operates heavily on a "Split Screen" paradigm.
- **Left Pane (Data Entry)**: Accordion-style forms integrated with AI helper buttons (e.g., "Improve this bullet point").
- **Right Pane (Live Preview)**: Renders a live PDF within ~500ms of any data change, allowing students to visualize exact ATS-optimized layout changes dynamically.

### C. Real-Time Meeting Rooms
Browser-based WebRTC interface.
- Includes a dedicated "Pre-join" waiting room (camera check, mic level visualizer).
- Features side-by-side or Picture-in-Picture UI to show interviewer video alongside the candidate's self-preview, with a side panel dedicated to note-taking or live-chatting.

### D. Chat & Networking
Modeled to feel intuitive, similar to Discord or Slack.
- **Layout**: 3-column flex layout (Conversations List -> Active Thread -> Context/Thread Info).
- Supports real-time text input auto-growth, emoji pickers, and infinite scroll for historical message fetching.

---

## 4. Mobile & Responsive Strategy

The layout is designed to degrade gracefully on smaller screens without losing core functionality.

- **Mobile View (< 768px)**: 
  - The Left Sidebar disappears completely. 
  - Navigation shifts to a native-feeling **Bottom Tab Bar** (Home, Jobs, Chat, Tests, Profile).
  - List items utilize swipe gestures (e.g., swipe to delete/archive a DM).
- **Tablet View (768px - 1024px)**:
  - The sidebar defaults to its collapsed `64px` icon-only state to maximize horizontal real estate.
- **Edge-Cases**:
  - UI strictly enforces landscape-mode recommendations when starting a coding test on a mobile device to prevent the Monaco editor from becoming unusable.

---

## 5. User Journeys (Role-Based Access)

1. **The Student Journey**: Log in -> Complete Onboarding Wizard -> Reach Dashboard. Core loop involves practicing coding problems, checking job feeds, building resumes, and executing secure code tests.
2. **The Recruiter Journey**: Dashboard focused entirely on "Drive" pipelines. High-level charts show candidates moving from Applied -> Shortlisted -> Offered. Unique UI access to the "Live Test Proctoring" view (grid of candidate camera thumbnails).
3. **The Admin Journey**: God-mode overview. UI relies heavily on data tables, CSV imports/exports, and system health metrics. Can masquerade or block users.
