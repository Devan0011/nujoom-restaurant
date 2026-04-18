# Client Handover Document - Railway + Netlify + Supabase

This document provides instructions for managing your restaurant website deployed on Railway, Netlify, and Supabase.

---

## Hosting Information

| Component | Provider | Dashboard |
|-----------|----------|----------|
| Backend API | Railway | https://railway.app/dashboard |
| Frontend Website | Netlify | https://app.netlify.com |
| Database | Supabase | https://supabase.com/dashboard |

---

## Website URLs

| Purpose | URL |
|---------|-----|
| Main Website | `https://your-site.netlify.app` |
| Menu Page | `https://your-site.netlify.app/menu.html` |
| Admin Login | `https://your-site.netlify.app/admin/login.html` |
| Admin Dashboard | `https://your-site.netlify.app/admin/dashboard.html` |
| Backend API | `https://nujoom-api.railway.app` |

---

## Admin Dashboard Guide

### Logging In

1. Go to `https://your-site.netlify.app/admin/login.html`
2. Enter credentials below
3. Click **Sign In**

### Default Credentials

| Field | Value |
|-------|-------|
| Email | `admin@nujoombiriyani.com` |
| Password | `ChangeThisPassword123!` |

**Important:** Change these credentials immediately after first login!

---

## Managing Content

### Menu Items

1. Click **Menu Items** in sidebar
2. View all dishes with prices
3. Click **+ Add Item** to add new dishes
4. Click edit icon to modify
5. Click delete icon to remove

### Reservations

1. Click **Reservations** in sidebar
2. View all bookings
3. Use filters to find specific reservations
4. Update status via dropdown
5. Click WhatsApp icon to notify customer

### Gallery

1. Click **Gallery** in sidebar
2. View all photos
3. Add new images with URL
4. Organize by category

### Reviews

1. Click **Reviews** in sidebar
2. Approve or delete customer reviews

---

## Updating Website Information

### Change Restaurant Details

1. **Railway Dashboard:**
   - Go to https://railway.app/dashboard
   - Select your project
   - Click **Variables**
   - Update:
     - `RESTAURANT_PHONE`
     - `RESTAURANT_ADDRESS`
     - `WHATSAPP_NUMBER`

2. **Code changes (for developers):**
   - Edit HTML files in `public/` folder
   - Push to GitHub
   - Netlify auto-deploys

---

## Common Tasks

### Adding a New Menu Item

1. Login to admin dashboard
2. Go to **Menu Items**
3. Click **+ Add Item**
4. Fill form:
   - Name, Description, Price
   - Category (Biriyani, Starters, etc.)
   - Image URL (from Imgur, etc.)
   - Spice Level
   - Check **Featured** for homepage
5. Click **Save**

### Handling Reservations

1. Check **Reservations** daily
2. Call customer to confirm
3. Update status to **Confirmed**
4. Send WhatsApp notification
5. After service, mark as **Completed**

### Updating Prices

1. Go to **Menu Items**
2. Find item
3. Click edit
4. Change price
5. Click **Update**

---

## Troubleshooting

### Website Down

**Frontend (Netlify):**
1. Check https://status.netlify.com
2. Check GitHub for deployment errors
3. Redeploy from Netlify dashboard

**Backend (Railway):**
1. Check https://status.railway.app
2. Check Railway logs for errors
3. Verify environment variables
4. Redeploy if needed

### WhatsApp Not Working

1. Verify `WHATSAPP_NUMBER` in Railway variables
2. Number format: `91XXXXXXXXXX` (with country code, no +)

### Menu Not Loading

1. Check browser console (F12)
2. Verify Railway backend is running
3. Check Network tab for failed requests

---

## Cost Summary

| Service | Free Tier | Cost |
|---------|-----------|------|
| Railway | 500 hours/month | $0 |
| Netlify | 100GB bandwidth | $0 |
| MongoDB Atlas | 512MB storage | $0 |
| **Total** | | **$0/month** |

---

## Getting Help

### Railway Support
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

### Netlify Support
- Docs: https://docs.netlify.com
- Community: https://community.netlify.com

### MongoDB Atlas Support
- Docs: https://docs.atlas.mongodb.com
- Community: https://community.mongodb.com

---

## Security Checklist

- [ ] Changed default admin password
- [ ] Updated WhatsApp number
- [ ] Verified MongoDB IP whitelist
- [ ] Enabled HTTPS (automatic on Netlify/Railway)

---

## Document Version

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | April 2026 | Initial document |

---

**End of Document**

*Confidential - For Nujoom Biriyani House only*
