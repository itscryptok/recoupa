# Recoupa API

Express + Postgres API behind the Recoupa claims board and the `/addy`
admin portal. It runs as a **separate Render web service** from the static
site (the static site calls it via `VITE_API_URL`).

## Endpoints

| Method | Path | Auth | Purpose |
| ------ | ---- | ---- | ------- |
| GET | `/api/health` | — | Health check (`{ ok: true }`) |
| GET | `/api/claims` | — | All claims, newest first |
| POST | `/api/claims` | — | File a claim (`walletAddress`, `lossTokenCa`; optional `claimNumber` + `dateFiled` for the one-time localStorage migration) |
| GET | `/api/admin/status` | — | `{ configured: boolean }` — whether an admin password is set |
| POST | `/api/admin/setup` | — | One-time admin password setup (8+ chars). 409 if already set |
| POST | `/api/admin/login` | — | Admin login, returns a 12h token |
| GET | `/api/admin/claims` | Admin token | All claims, newest first |
| PATCH | `/api/admin/claims/:id` | Admin token | Set status (`pending` / `rejected` / `paid`). Rejected requires a reason; paid requires a tx hash + chain |

Claim statuses: `pending` (open), `rejected` (with `rejection_reason`),
`paid` (with `tx_hash` + `tx_chain`). The frontend splits pending claims
into New (< 48h old) and Open (≥ 48h old) tabs by `created_at`.

## Environment variables

- `DATABASE_URL` — Postgres connection string (required).
- `SESSION_SECRET` — secret for signing admin tokens. Without it, tokens
  are only valid for the lifetime of the process (random per-boot secret),
  so set it in production.
- `PORT` — set by Render automatically.

## Database self-bootstrap

On boot the server creates the `claims` and `app_settings` tables if they
do not exist. If the database named in `DATABASE_URL` does not exist yet
(error `3D000`), it connects to the `postgres` maintenance database on the
same server, creates the database, then proceeds. No manual migration step.

## Admin password

The admin password is set by Yemi on his first visit to `/addy` (one-time
setup form) and stored bcrypt-hashed in `app_settings`. It is never
hardcoded, never logged, and never returned by any endpoint. The builder
never sets a production admin password.

## Local development

```sh
npm install
DATABASE_URL=postgres://user:pass@localhost:5432/recoupa SESSION_SECRET=dev-secret PORT=3001 node index.js
```

The static site talks to it with `VITE_API_URL=http://localhost:3001`
(a local `.env` file — never committed).
