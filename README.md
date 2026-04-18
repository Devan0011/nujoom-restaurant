# Nujoom Biriyani House - Restaurant Website

A full-stack restaurant website hosted on **Railway** (backend), **Netlify** (frontend), and **Supabase** (PostgreSQL database).

## Hosting Services Used

| Component | Service | Website | Free Tier |
|-----------|---------|---------|-----------|
| Backend API | Railway | https://railway.app | 500 hours/month |
| Frontend | Netlify | https://netlify.com | 100GB bandwidth |
| Database | Supabase | https://supabase.com | 500MB storage |

## Why Supabase?

- **PostgreSQL-based** - Reliable, ACID-compliant database
- **Built-in Authentication** - Ready to use auth system
- **Real-time Subscriptions** - Optional live updates
- **REST API** - No need to write custom CRUD
- **Better free tier** - More generous than MongoDB Atlas
- **Row Level Security** - Fine-grained access control

## Project Structure

```
restaurant/
├── public/                    # Frontend static files
│   ├── admin/                # Admin panel
│   ├── css/                  # Styles
│   ├── js/                   # JavaScript
│   ├── index.html            # Main page
│   └── menu.html             # Menu page
├── server/                   # Backend code
│   ├── middleware/           # Auth middleware
│   ├── routes/               # API routes
│   ├── index.js              # Server entry
├── supabase/
│   └── schema.sql           # Database schema
├── netlify.toml              # Netlify config
├── railway.json              # Railway config
├── package.json
└── .env.example
```

## Quick Start

### Prerequisites

- Node.js v18+
- Supabase account (free at https://supabase.com)
- Railway account (free tier)
- Netlify account (free tier)

### Local Development

```bash
# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your Supabase URL and key

# Seed database (via API endpoint after starting server)
npm run dev
# Then visit: http://localhost:3000/api/seed
```

---

## Deployment Guide

### Step 1: Set Up Supabase

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up with GitHub

2. **Create New Project**
   - Click **New Project**
   - Name: `nujoom-restaurant`
   - Database Password: (remember this!)
   - Region: Choose closest to you

3. **Get API Credentials**
   - Go to **Settings** → **API**
   - Copy:
     - **Project URL**: `https://xxxxx.supabase.co`
     - **anon public key**: `eyJhbG...`

4. **Create Database Schema**
   - Go to **SQL Editor**
   - Copy contents from `supabase/schema.sql`
   - Paste and click **Run**

### Step 2: Deploy Backend to Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click **New Project** → **Deploy from GitHub repo**
   - Select your repository
   - Railway auto-detects Node.js

3. **Add Environment Variables**
   | Variable | Value |
   |----------|-------|
   | `SUPABASE_URL` | Your Supabase Project URL |
   | `SUPABASE_ANON_KEY` | Your Supabase anon key |
   | `JWT_SECRET` | `your-secret-key-here` |
   | `JWT_EXPIRE` | `7d` |
   | `ADMIN_EMAIL` | `admin@nujoombiriyani.com` |
   | `ADMIN_PASSWORD` | `YourSecurePassword123!` |
   | `WHATSAPP_NUMBER` | `919876543210` |
   | `RESTAURANT_PHONE` | `0491-252-1234` |
   | `RESTAURANT_ADDRESS` | `Your Address` |

4. **Get Railway URL**
   ```
   https://nujoom-api.railway.app
   ```

5. **Seed Database**
   Visit: `https://nujoom-api.railway.app/api/seed`

### Step 3: Deploy Frontend to Netlify

1. **Create Netlify Account**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Deploy**
   - Click **Add new site** → **Import an existing project**
   - Configure:
     - Build command: `echo "No build needed"`
     - Publish directory: `public`
   - Click **Deploy site**

### Step 4: Update API URLs

Replace `https://nujoom-api.railway.app` with your Railway URL in:
- `public/js/main.js`
- `public/menu.html`
- `public/admin/js/admin.js`
- `public/admin/login.html`

---

## URLs After Deployment

| Service | URL |
|---------|-----|
| Frontend (Netlify) | `https://your-site.netlify.app` |
| Backend API (Railway) | `https://nujoom-api.railway.app` |
| Database (Supabase) | `https://xxxxx.supabase.co` |
| Admin | `https://your-site.netlify.app/admin/login.html` |

---

## Default Admin Credentials

- **Email:** `admin@nujoombiriyani.com`
- **Password:** `ChangeThisPassword123!`

---

## Troubleshooting

### Supabase Issues

**Connection Failed:**
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
- Check project is not paused (free tier sleeps after inactivity)
- Ensure RLS policies allow your requests

**Table Not Found:**
- Run the schema.sql in Supabase SQL Editor
- Check table names match exactly

### Railway Issues

**Build Failed:**
- Check Railway logs
- Verify environment variables are set
- Ensure package.json scripts are correct

### Netlify Issues

**API Not Working:**
- Verify netlify.toml redirect rules
- Check browser console for CORS errors

---

## Cost Summary

| Service | Free Tier | Cost |
|---------|-----------|------|
| Railway | 500 hours/month | $0 |
| Netlify | 100GB bandwidth | $0 |
| Supabase | 500MB storage, 2GB transfer | $0 |
| **Total** | | **$0/month** |

---

## Features

- Fully responsive design
- Admin dashboard for content management
- Menu management with categories
- Reservation system with WhatsApp notifications
- Gallery management
- Review system
- SEO optimized
- Dark theme with gold accents

---

## Support

| Service | Documentation |
|---------|---------------|
| Railway | https://docs.railway.app |
| Netlify | https://docs.netlify.com |
| Supabase | https://supabase.com/docs |
