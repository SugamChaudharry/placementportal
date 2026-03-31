# 🚀 Team Setup Guide

Welcome to the **Placement Portal** project! This guide will help you set up your local development environment from scratch.

## 🛠 Prerequisites

Ensure you have the following installed on your machine:
1.  **Node.js**: v20 or higher (Check with `node -v`).
2.  **pnpm**: Version 9 (Install via `npm install -g pnpm`).
3.  **Docker Desktop**: To run the database and Redis locally.
4.  **Git**: To manage your code changes.

---

## 🏗 Local Setup Steps

### 1. Clone the repository
```bash
git clone <repository-url>
cd placementportal
```

### 2. Install Dependencies
We use `pnpm` for fast, efficient workspace management.
```bash
pnpm install
```

### 3. Environment Configuration
You need to create `.env` files for both the server and the web application. Templates are provided in the repo.

**Backend (Server):**
```bash
cp apps/server/.env.example apps/server/.env
```
*Open `apps/server/.env` and update the database URL if necessary (default should work with Docker).*

**Frontend (Web):**
```bash
cp apps/web/.env.example apps/web/.env.local
```

### 4. Start Infrastructure (Docker)
Run the following command to start PostgreSQL and Redis:
```bash
docker-compose up -d
```

### 5. Initialize the Database (Prisma)
Sync your database schema and generate the Prisma client:
```bash
cd apps/server
pnpm dlx prisma migrate dev --name init
pnpm dlx prisma generate
cd ../..
```

---

## 🏃‍♂️ Running the Project

To start both the frontend and backend in development mode:
```bash
pnpm dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Prisma Studio**: `npx prisma studio` (to view data visually)

---

## ❓ Troubleshooting
- If `pnpm` is not found, run `npm i -g pnpm`.
- Ensure Docker is running before executing `docker-compose up`.
- If ports are already in use, check if you have another instance of Postgres or Redis running.
