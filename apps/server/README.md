# PlaceMe Backend API

Fastify-based backend server for the Placement Portal platform.

## Quick Start

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
pnpm db:migrate

# Generate Prisma client
pnpm db:generate

# Start development server
pnpm dev

# Start background workers (in separate terminals)
pnpm worker:email
pnpm worker:pdf
pnpm worker:ai

# Or start all workers
pnpm workers
```

## Tech Stack

- **Framework**: Fastify (2x faster than Express)
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL 16
- **Cache/Queue**: Redis 7 + Bull
- **Auth**: JWT with refresh tokens
- **AI**: Claude API (claude-sonnet-4-6)
- **Email**: Resend
- **Video**: Daily.co
- **Code Execution**: Judge0

## Architecture

### Modules (11)

| Module | Endpoints | Description |
|--------|-----------|-------------|
| Auth | 6 | Register, login, OAuth, password reset |
| Users | 8 | Profile, onboarding, activity, export |
| Resume | 8 | Versions, ATS score, PDF generation, AI tailoring |
| Jobs | 8 | CRUD, search, eligibility, recommendations |
| Applications | 4 | Apply, track, timeline |
| Calendar | 5 | Events, scheduling, reminders |
| Chat | 7 | Rooms, DMs, messages, search |
| Meetings | 5 | Video calls, Daily.co integration |
| Tests | 9 | Coding tests, Judge0, proctoring |
| Practice | 7 | Problem bank, leaderboard, hints |
| Recruiter | 6 | Dashboard, shortlisting, scheduling |
| AI | 5 | Mock interviews, resume help, code review |
| Admin | 7 | Stats, user management, system health |
| Notifications | 4 | Feed, settings, read status |

### WebSocket Events (8)

| Event | Direction | Description |
|-------|-----------|-------------|
| `chat:send` | C→S→C | Send message to room |
| `chat:typing` | C→S→C | Typing indicator |
| `chat:read` | C→S→C | Mark messages read |
| `proctor:flag` | C→S→C | Proctoring violation |
| `monitor:join` | C→S | Join test monitoring |
| `monitor:flag` | S→C | Flag broadcast to recruiter |
| `join:notifications` | C→S | Join personal notif room |
| `join:room` | C→S | Join chat room |

### Background Jobs (Bull)

| Queue | Jobs |
|-------|------|
| `email` | Send transactional emails via Resend |
| `pdf` | Generate resume PDFs via pdf-lib |
| `ai` | Claude API calls (resume, code review) |
| `ats-score` | Calculate ATS scores |
| `search-sync` | Sync to Meilisearch |
| `export` | User data export (GDPR) |

## API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/google
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
```

### Users
```
GET    /api/users/me
PUT    /api/users/me
POST   /api/users/onboarding
POST   /api/users/profile-photo
GET    /api/users/public/:username
GET    /api/users/me/activity
POST   /api/users/export-data
GET    /api/users/colleges
```

### Jobs
```
GET    /api/jobs
GET    /api/jobs/:id
GET    /api/jobs/recommended
POST   /api/jobs/:id/apply
POST   /api/jobs/:id/save
DELETE /api/jobs/:id/save
GET    /api/jobs/saved
```

### Resume
```
GET    /api/resume/versions
PUT    /api/resume/versions/:id
POST   /api/resume/versions
POST   /api/resume/parse
POST   /api/resume/generate
GET    /api/resume/ats-score/:id
POST   /api/resume/render-pdf
```

### AI
```
POST /api/ai/resume/tailor
POST /api/ai/resume/improve-bullet
POST /api/ai/mock/start
POST /api/ai/mock/chat
POST /api/ai/mock/finish
```

### Tests
```
GET  /api/tests/candidate
GET  /api/tests/:id
POST /api/tests/:id/start
POST /api/tests/:id/run
POST /api/tests/:id/submit-question
POST /api/tests/:id/flag
POST /api/tests/:id/finish
GET  /api/tests/:id/result
```

### Admin
```
GET  /api/admin/stats
GET  /api/admin/health
GET  /api/admin/users
PUT  /api/admin/users/:id/block
PUT  /api/admin/users/:id/unblock
GET  /api/admin/companies
GET  /api/admin/drives
```

## Environment Variables

```env
# Server
NODE_ENV=development
PORT=4000
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/placement_portal
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=minimum-32-character-random-secret-here

# Client
CLIENT_URL=http://localhost:3000

# AI
CLAUDE_API_KEY=sk-ant-...

# File storage
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET=placement-portal-assets
AWS_REGION=ap-south-1

# Email / SMS
RESEND_API_KEY=re_...

# Video
DAILY_API_KEY=

# Code execution
JUDGE0_URL=http://localhost:2358
JUDGE0_AUTH_TOKEN=

# Search
MEILISEARCH_URL=http://localhost:7700
MEILISEARCH_MASTER_KEY=
```

## Database Schema

Core models: User, Student, Recruiter, Company, Job, Application, CodingTest, ChatRoom, Message, Meeting, Notification

See `prisma/schema.prisma` for full schema.

## Development

```bash
# Run Prisma Studio (GUI for database)
pnpm db:studio

# Generate migration
pnpm db:migrate

# Build for production
pnpm build

# Start production
pnpm start
```

## Testing

```bash
# Health check
curl http://localhost:4000/health

# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123","role":"student"}'
```
