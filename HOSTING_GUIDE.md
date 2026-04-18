# Railway + Netlify + Supabase Deployment Guide

This guide explains how to deploy the restaurant website using:
- **Railway** - Backend hosting
- **Netlify** - Frontend hosting
- **Supabase** - PostgreSQL database

---

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│                      (Netlify)                               │
│                  https://your-site.netlify.app               │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ /api/* redirects
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│                       (Railway)                              │
│                 https://nujoom-api.railway.app               │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        Database                              │
│                      (Supabase)                              │
│              https://xxxxx.supabase.co                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Step 1: Create Supabase Project

### 1.1 Sign Up for Supabase

1. Go to https://supabase.com
2. Click **Start your project**
3. Sign up with GitHub

### 1.2 Create New Project

1. Click **New Project**
2. Configure:
   - **Name**: `nujoom-restaurant`
   - **Database Password**: `YourSecurePassword123!` (remember this!)
   - **Region**: Choose closest to your users (e.g., India - Mumbai)
3. Click **Create new project**
4. Wait for setup to complete (1-2 minutes)

### 1.3 Get API Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Find and copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 1.4 Create Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Copy the contents of `supabase/schema.sql` file
3. Paste into the SQL Editor
4. Click **Run**

You should see "Success" for each table created.

---

## Step 2: Push Code to GitHub

```bash
cd "D:\Programming\Web pages\nujoom restaurant\restaurant"

git init
git add .
git commit -m "Initial commit - Railway + Netlify + Supabase"
git remote add origin https://github.com/YOUR_USERNAME/nujoom-restaurant-supabase.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend to Railway

### 3.1 Create Railway Account

1. Go to https://railway.app
2. Click **Login** → **Login with GitHub**
3. Authorize the app

### 3.2 Create New Project

1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Find and select `nujoom-restaurant-supabase`
4. Railway auto-detects Node.js

### 3.3 Configure Environment Variables

1. In Railway dashboard, click **Variables** tab
2. Add these variables:

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | `https://xxxxx.supabase.co` (from Step 1) |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` (from Step 1) |
| `JWT_SECRET` | `nujoom_super_secret_key_2026_supabase!` |
| `JWT_EXPIRE` | `7d` |
| `ADMIN_EMAIL` | `admin@nujoombiriyani.com` |
| `ADMIN_PASSWORD` | `ChangeThisPassword123!` |
| `WHATSAPP_NUMBER` | `919876543210` |
| `RESTAURANT_PHONE` | `0491-252-1234` |
| `RESTAURANT_ADDRESS` | `Main Road, Near Clock Tower, Palakkad, Kerala 678001` |

### 3.4 Wait for Deployment

- Railway will build and deploy automatically
- Takes 2-3 minutes
- Check **Deployments** tab for status

### 3.5 Get Your Railway URL

After deployment:
```
https://nujoom-api.railway.app
```

### 3.6 Seed Database

Visit this URL once to seed the database:
```
https://nujoom-api.railway.app/api/seed
```

You should see:
```json
{"success":true,"message":"Database seeded successfully!"}
```

---

## Step 4: Deploy Frontend to Netlify

### 4.1 Create Netlify Account

1. Go to https://app.netlify.com
2. Click **Sign up** → **Continue with GitHub**
3. Authorize the app

### 4.2 Add New Site

1. Click **Add new site** → **Import an existing project**
2. Under **Authorize Netlify**, click your GitHub org
3. Find `nujoom-restaurant-supabase` repo
4. Configure build settings:

| Setting | Value |
|---------|-------|
| **Owner** | Your team |
| **Branch** | `main` |
| **Build command** | `echo "No build needed for static site"` |
| **Publish directory** | `public` |

5. Click **Deploy site**

### 4.3 Wait for Deployment

- Netlify will deploy automatically
- Takes 1-2 minutes

### 4.4 Get Your Netlify URL

After deployment:
```
https://random-name.netlify.app
```

---

## Step 5: Update API URLs

Replace `https://nujoom-api.railway.app` with your actual Railway URL:

### 5.1 Update Files

**public/js/main.js** (line 3):
```javascript
: 'https://YOUR_RAILWAY_URL.railway.app/api';
```

**public/menu.html** (line 115):
```javascript
: 'https://YOUR_RAILWAY_URL.railway.app/api';
```

**public/admin/js/admin.js** (line 3):
```javascript
: 'https://YOUR_RAILWAY_URL.railway.app/api';
```

**public/admin/login.html** (line 243):
```javascript
: 'https://YOUR_RAILWAY_URL.railway.app/api';
```

### 5.2 Push Changes

```bash
git add .
git commit -m "Update API URLs for production"
git push origin main
```

Netlify will auto-deploy!

---

## Step 6: Post-Deployment Checklist

### Test Everything

- [ ] Main website loads: `https://your-site.netlify.app`
- [ ] Menu page: `https://your-site.netlify.app/menu.html`
- [ ] Admin login: `https://your-site.netlify.app/admin/login.html`
- [ ] Menu items load correctly
- [ ] Reservation form works
- [ ] WhatsApp button works

### Admin Login Test

- [ ] Login with default credentials
- [ ] View dashboard
- [ ] Add test menu item
- [ ] Log out

---

## Troubleshooting

### Supabase Issues

**Connection Failed:**
1. Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
2. Verify project is not paused
3. Check browser console for CORS errors

**Table Not Found:**
1. Run schema.sql in SQL Editor
2. Check table names match

### Railway Issues

**Build Failed:**
1. Check **Logs** tab for errors
2. Verify environment variables
3. Common issues:
   - Missing `SUPABASE_URL`
   - Invalid Supabase key
   - Missing JWT_SECRET

### Netlify Issues

**API Errors:**
1. Check browser console (F12)
2. Verify redirect rules in netlify.toml
3. Check Network tab for failed requests

---

## Quick Reference

### URLs After Deployment

| Service | URL |
|---------|-----|
| Frontend | `https://your-site.netlify.app` |
| Backend API | `https://nujoom-api.railway.app` |
| Database | `https://xxxxx.supabase.co` |
| Health Check | `https://nujoom-api.railway.app/api/health` |
| Seed Endpoint | `https://nujoom-api.railway.app/api/seed` |

### Default Admin Credentials

| Field | Value |
|-------|-------|
| Email | `admin@nujoombiriyani.com` |
| Password | `ChangeThisPassword123!` |

### Important Credentials

| Service | Where to Find |
|---------|---------------|
| Supabase URL | Settings → API → Project URL |
| Supabase Key | Settings → API → anon public key |
| Railway URL | Railway dashboard → Service URL |
| Netlify URL | Netlify dashboard → Site URL |

---

## Cost Summary

| Service | Free Tier | Cost |
|---------|-----------|------|
| Railway | 500 hours/month, $5 credit | $0 |
| Netlify | 100GB bandwidth | $0 |
| Supabase | 500MB storage, 2GB transfer | $0 |
| **Total** | | **$0/month** |

---

## Support Links

| Service | Documentation | Support |
|---------|---------------|---------|
| Railway | https://docs.railway.app | Discord |
| Netlify | https://docs.netlify.com | Forum |
| Supabase | https://supabase.com/docs | Discord |

---

**Good luck with your deployment!**
