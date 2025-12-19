# Deployment & Development Guide

This guide explains how to develop locally and deploy the J.J Thai Spa website to Firebase.

## 1. Local Development

### Prerequisites
- **Node.js**: (LTS version recommended)
- **Install Dependencies**: 
  ```bash
  npm install
  ```

### Environment Variables
For local builds, variables are read from `.env.local`. 
- Prefix client-side variables with `VITE_` (e.g., `VITE_GEMINI_API_KEY`).

### Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 2. Firebase Deployment

### 1. Build the Project
Always build the project before deploying to ensure you are deploying the latest optimized code.
```bash
npm run build
```
This generates the `dist/` folder.

### 2. Deploy to Firebase
Ensure you have the [Firebase CLI](https://firebase.google.com/docs/cli) installed and are logged in (`firebase login`).

#### Deploy Everything (Hosting, Functions, Firestore Rules)
```bash
firebase deploy
```

#### Deploy Hosting Only (Standard for Frontend Changes)
```bash
firebase deploy --only hosting
```
*Note: You can also use the shortcut `npm run deploy` which builds and then deploys only hosting.*

#### Deploy Functions Only
```bash
firebase deploy --only functions
```

---

## Troubleshooting

**Build fails:**
- Clear cache: `rm -rf node_modules dist && npm install`.
- Check for TypeScript errors during `npm run build`.

**Firebase Authentication Error:**
- Run `firebase login --reauth` if your credentials expire.

**Changes not appearing:**
- Firebase Hosting uses strong caching. You may need to clear your browser cache or wait a few minutes after a successful deploy.
