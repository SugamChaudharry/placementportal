# 🤝 Collaboration & Task Division Guide

Working on a monorepo (multiple apps in one repo) requires a bit of extra care to avoid merge conflicts.

## 🧱 Task Division Strategy

To keep the development "clean," try to divide tasks by **Module** or **Feature Area**. For example:

- **Developer A**: Focuses on `auth` (login, signup, JWT) in `apps/server/src/modules/auth`.
- **Developer B**: Focuses on `users` (profiles, data) in `apps/server/src/modules/users`.
- **Developer C**: Focuses on the `web` frontend for the login page.

This way, everyone works in separate directories, and conflicts in `main` are minimized.

---

## 🏗 Working with shared code

### Types
We share TypeScript types between the frontend (`web`) and backend (`server`) using the `@portal/types` package.
- If you add a new API response, update the types in `packages/types`.
- Run `pnpm build` in the root to ensure types are available everywhere.

### Database Schema
Changes to `prisma/schema.prisma` should be discussed with the team first, as these changes affect everyone's local development database.

---

## 🏢 Communication Protocol

- **Reviewing PRs**: Don't just click "Approve." Read the code! Ask "Why did we do it this way?" and "Will this break anything else?"
- **Breaking Changes**: If you update a central component (like the API client or a shared UI component), notify the team in your chat/channel.

---

## 🧹 Keeping it Clean
- **Linting**: Before you commit, run `pnpm lint`.
- **Formatting**: We use Prettier. Most editors (like VS Code) can format-on-save.
- **Tests**: If you see a `tests` folder, run the tests before pushing!
