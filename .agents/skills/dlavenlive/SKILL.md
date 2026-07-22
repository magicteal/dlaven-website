---
name: dlavenlive
description: Automates full build & lint verification, git commit & push to GitHub main, SSH deployment to VPS (72.60.221.173), and verification of PM2 services. Triggered when the user types /dlavenlive or asks to deploy or push live.
---

# D'LAVÉN Live Push & Deployment Pipeline (/dlavenlive)

When the user triggers `/dlavenlive` or asks to deploy/push to live, execute the following 4-step pipeline automatically without skipping any verification step:

## Step 1: Local Build & Lint Verification
1. Run local build and lint in the Frontend directory:
   ```powershell
   cd Frontend
   npm run build ; npm run lint
   ```
2. Run local build in the Backend directory:
   ```powershell
   cd Backend
   npm run build
   ```
3. Ensure there are **no build errors or warnings**. If build/lint fails, fix the errors locally before committing or pushing.

## Step 2: Git Commit & Push to GitHub
1. Check repository status:
   ```powershell
   git status
   ```
2. Stage all modified and new files:
   ```powershell
   git add .
   ```
3. Commit with a clear, descriptive message summarizing recent changes:
   ```powershell
   git commit -m "Deploy: <summary of updates>"
   ```
4. Push directly to GitHub `main` branch:
   ```powershell
   git push origin main
   ```

## Step 3: VPS Remote Pull & Build Deployment
Execute the automated Python SSH deployment script from workspace root:
```powershell
python scripts/deploy.py
```

This script reads credentials from `.env.deploy` (gitignored), connects to VPS `72.60.221.173` via SSH, pulls latest `main` commit into `/home/deploy/myapp`, runs `npm run build` for both Backend and Frontend as user `deploy`, and restarts all PM2 processes.

## Step 4: VPS Verification & Status Report
1. Verify that `pm2 status` output shows both `myapp-backend` and `myapp-frontend` with status **`online`**.
2. Provide a clean summary report confirming:
   - ✅ Local build and lint verified (0 errors)
   - ✅ Pushed to GitHub repository `origin/main`
   - ✅ VPS updated to latest commit
   - ✅ PM2 services `myapp-backend` & `myapp-frontend` are **ONLINE**
