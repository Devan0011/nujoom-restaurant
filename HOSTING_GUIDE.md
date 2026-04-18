# Hosting Guide (Simplified)

This project is now designed to run as one Node service (frontend + backend together).

## Recommended Platforms
- Railway
- Render
- Fly.io
- Any VPS with Node 18+

## Required Environment Variables
- `NODE_ENV=production`
- `PORT` (platform provided)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `JWT_EXPIRE=7d` (optional)
- `ADMIN_EMAIL` (optional)
- `ADMIN_PASSWORD` (optional)
- `SEED_TOKEN` (recommended for production)

## Deploy Steps
1. Push repository to GitHub.
2. Create a new web service on your host.
3. Build command: `npm install`
4. Start command: `npm start`
5. Set environment variables.
6. Deploy.

## Post Deploy
1. Open `https://your-domain/api/health`.
2. Seed once:
   - Send `POST https://your-domain/api/seed`
   - In production add header: `x-seed-token: <SEED_TOKEN>`
3. Visit `https://your-domain/admin/login.html`.

## Optional Docker Deploy
```bash
docker compose up --build
```

## Separate Frontend Hosting (Optional)
If you host frontend separately from API, set:
```html
<meta name="nujoom-api-base-url" content="https://your-api-domain/api">
```
in `index.html`, `menu.html`, and admin pages.
