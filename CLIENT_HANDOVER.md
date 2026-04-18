# Client Handover - Nujoom Biriyani House

## What Was Rebuilt
- Backend and frontend now run from one deployable Node service.
- Frontend no longer uses hardcoded API domains.
- Legacy MongoDB files removed; project is Supabase-only.
- Seeding moved to reusable service (`npm run seed` or `POST /api/seed`).
- Added Docker support and improved env/config structure.

## Important URLs
- Website: `/`
- Menu page: `/menu.html`
- Admin login: `/admin/login.html`
- Admin dashboard: `/admin/dashboard.html`
- Health check: `/api/health`

## Environment Setup
Use `.env.example` as template and set:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- Optional: `SEED_TOKEN`, `ADMIN_SETUP_TOKEN`

## First-Time Go-Live Checklist
1. Deploy app.
2. Verify `/api/health` returns status `ok`.
3. Seed database once.
4. Login to admin and verify menu/reservation/gallery/reviews.
5. Change default admin password.

## Security Notes
- Keep `SUPABASE_SERVICE_ROLE_KEY` private (server only).
- Set `SEED_TOKEN` in production to protect the seed endpoint.
- Keep `ADMIN_SETUP_TOKEN` empty unless you intentionally enable `/api/admin/register`.
