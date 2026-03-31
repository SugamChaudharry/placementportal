# 🌳 Git & Workflow Guide

Follow this simplified workflow to ensure our codebase stays healthy and easy to manage.

## 🌟 The 4 Golden Rules

1.  **Always Pull First**: Before you start working, make sure your code is up-to-date with everyone else's.
2.  **Work in Branches**: Never, ever, work directly on `main`. Each feature or bug fix should have its own branch.
3.  **Commit Often**: Small, frequent commits are better than one giant "Work Done" commit.
4.  **Pull Request (PR) for Review**: Always submit a PR before merging. Let a teammate double-check your code.

---

## 🛠 Daily Workflow: A Step-by-Step Guide

### 1. Sync with Main
Before starting a new task, get the latest code.
```bash
git checkout main
git pull origin main
```

### 2. Create a Branch
Branch names should be descriptive (e.g., `feature/login-ui`, `bugfix/api-error`).
```bash
git checkout -b feature/your-task-name
```

### 3. Save Your Work (Commit)
As you work, save your changes with meaningful messages.
```bash
git add .
git commit -m "Added login form validation"
```

### 4. Push to the Server
When you've finished or want to share your progress:
```bash
git push origin feature/your-task-name
```

### 5. Create a Pull Request (PR)
1. Go to the repository on GitHub/GitLab.
2. Click **New Pull Request**.
3. Select your branch as the source and `main` as the destination.
4. Add a description of what you did.
5. Tag a teammate to review!

---

## 💡 Quick Tips
- **Git Status**: Use `git status` anytime to see what's happening.
- **Git Log**: Use `git log --oneline` to see the history of commits.
- **Lost?**: If you're stuck, just ask! Everyone started with "little Git knowledge" at some point.
