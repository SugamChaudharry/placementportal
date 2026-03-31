# 🎓 Placement Portal

Welcome to the **Placement Portal**! This is a monorepo containing the frontend and backend of our placement management system.

## 📁 Project Structure

- `apps/server`: Node.js/Fastify backend API.
- `apps/web`: Next.js frontend application.
- `packages/types`: Shared TypeScript definitions.
- `docs/`: Developer and team documentation.

---

## 👩‍💻 For Developers

If you are joining the team, please read these guides in order:

1.  **[Team Setup Guide](docs/TEAM_SETUP.md)**: How to set up your local machine (Node, pnpm, Docker).
2.  **[Git & Workflow Guide](docs/GIT_WORKFLOW.md)**: Our simplified process for branching, committing, and PRs.
3.  **[Collaboration & Task Guide](docs/COLLABORATION_GUIDE.md)**: How we divide work and share code in the monorepo.

---

## 🚀 Quick Start (After Setup)

```bash
docker-compose up -d
pnpm install
pnpm dev
```

Happy coding! 🚀
