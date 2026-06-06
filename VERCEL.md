# Deploying Studio Kloche & Co. to Vercel

This guide provides step-by-step instructions to deploy this full-stack React (Vite) + Express + Prisma application smoothly to **Vercel**.

---

## 🏗️ Architecture on Vercel

Vercel serves stateless serverless environments. To ensure maximum performance, low cost, and zero-cold starts, the project is configured as follows inside `vercel.json`:
1. **Frontend**: Built statically via Vite and served globally using Vercel's lightning-fast Edge CDN.
2. **Backend APIs**: The Express API endpoints inside `/api` are served by a Node.js Serverless Function.
3. **SPA Router**: All browser page routes (e.g., `/admin/clients`) fall back to `index.html` to allow React Router to manage the routing client-side.

---

## 🛠️ Step 1: Set Up a Production Database (PostgreSQL)

Since serverless functions are ephemeral, SQLite files (`dev.db`) inside Vercel are read-only and reset on every request. For production hosting, you need a cloud-hosted relational database (e.g., a free PostgreSQL database from **Neon**, **Supabase**, or **Vercel Postgres**).

### 1. Update your Prisma Provider
Open `prisma/schema.prisma` and update the database block from **sqlite** to **postgresql**:

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql" // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

### 2. Get your connection string
Get your PostgreSQL connection string (typically starts with `postgres://` or `postgresql://`) and set it up locally in your `.env` file first:
```env
DATABASE_URL="postgresql://username:password@your-host:5432/your-db?sslmode=require"
```

### 3. Generate Prisma and push the schema
In your terminal, run the following commands to generate the updated Prisma Client and push your database structure onto your new PostgreSQL cloud database:
```bash
npx prisma generate
npx prisma db push
```

---

## 🚀 Step 2: Deploy to Vercel

### Option A: Via GitHub (Recommended)
1. Push this workspace code to a remote repository on GitHub, GitLab, or Bitbucket.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your repository.
4. Vercel will automatically auto-detect the configuration:
   - **Framework Preset**: Vite (detected automatically)
   - **Build Command**: `vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`
   - **Output Directory**: `dist`
5. Click **Environment Variables** and add:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `GEMINI_API_KEY`: (Optional) If you have initialized any Gemini integration keys.
6. Click **Deploy**!

### Option B: Via Vercel CLI
If you prefer building and deploying straight from the command line:
1. Install Vercel CLI globally: `npm i -g vercel`
2. Run `vercel` in the project root directory and follow the interactive prompts to link and deploy.

---

## 🔑 Environment Variables Needed on Vercel

Inside your Vercel Project Dashboard under **Settings -> Environment Variables**, add:

| Name | Description | Example |
|------|-------------|---------|
| `DATABASE_URL` | Cloud SQL/Postgres Connection String (Required) | `postgresql://...` |
| `GEMINI_API_KEY` | Your Secure Google Gemini API Key (Optional) | `AIzaSy...` |
| `NODE_ENV` | Environment Type | `production` |

---

## 📋 Verifying Deployment
Once the deployment finishes, Vercel will grant you a production `https://*.vercel.app` URL. 
- Accessing `https://your-app.vercel.app/` will load your beautifully refined frontend client immediately.
- Frontend requests to `/api/*` (e.g., `/api/clients`) will securely call the serverless Node.js backend to fetch and update details in your PostgreSQL repository.
