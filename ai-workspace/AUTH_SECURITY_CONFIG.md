# Quiz Maker — Authentication Security Configuration

This document records the session and security settings implemented for the Quiz Maker authentication module.

## Stack

| Component | Choice |
|-----------|--------|
| Auth | Custom server actions + D1 sessions |
| Session transport | HTTP-only cookie (`quizmaker.session`) |
| User storage | Cloudflare D1 (`quizmaker-db`, binding `DB`) |
| Password hashing | Web Crypto PBKDF2-SHA256 (`src/lib/auth/password.ts`) |
| Hosting runtime | Cloudflare Workers via OpenNext |

## `users` table columns

Only these columns exist on `users`:

| Column | Notes |
|--------|-------|
| `id` | Primary key (UUID) |
| `name` | Display name from sign-up |
| `email` | Unique login identifier |
| `password_hash` | Hashed password (never plain text) |

Not used on `users`: `email_verified`, `image`, `created_at`, `updated_at`.

## Environment variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `BETTER_AUTH_SECRET` | `.dev.vars` (local), Wrangler secret (production) | Reserved for future signed cookies if needed |
| `BETTER_AUTH_URL` | `wrangler.jsonc` `[vars]` | Canonical app URL for redirects |
| `NEXTJS_ENV` | `.dev.vars` | OpenNext development flag |

Never commit secrets. Keep `.dev.vars.example` updated with empty placeholders.

## Session policy

Configured in `src/lib/auth/session-store.ts`:

| Setting | Value | Description |
|---------|-------|-------------|
| `SESSION_MAX_AGE_SECONDS` | 7 days | Cookie and session row lifetime |
| Cookie name | `quizmaker.session` | HttpOnly session token |

Expired or missing sessions redirect unauthenticated users to `/sign-in`. Protected routes preserve the intended destination in `callbackUrl`.

## Cookie security

- **HttpOnly:** enabled
- **SameSite:** `Lax`
- **Secure:** enabled in production

## Rate limiting

Server action rate limiting (`signInAction`, `signUpAction`):

| Setting | Value |
|---------|-------|
| Storage | D1 (`auth_action_rate_limits` table) |
| Window | 60 seconds |
| Max attempts | 10 per IP per action |

Rate-limited requests show: *"Too many attempts. Please wait a minute and try again."*

## Protected routes

| Route | Access |
|-------|--------|
| `/dashboard` | Authenticated only (layout guard in `src/app/dashboard/layout.tsx`) |
| `/sign-in`, `/sign-up` | Guest only; authenticated users redirect to `/dashboard` |

## Validation and error handling

- All form input validated with Zod on the server (`src/lib/auth/validation.ts`)
- Invalid sign-in credentials return a generic message (no email enumeration)
- Duplicate email on sign-up returns an explicit field error (per PRD)
- Passwords are never logged or stored in plain text

## Database migrations

| Migration | Tables |
|-----------|--------|
| `0002_init_auth_tables.sql` | `users`, `sessions`, `accounts`, `verifications` |
| `0004_add_auth_action_rate_limits.sql` | `auth_action_rate_limits` |
| `0006_simplify_users_table.sql` | Simplifies `users` to `id`, `name`, `email`, `password` |
| `0007_rename_password_to_password_hash.sql` | Renames `password` to `password_hash` |

Apply locally: `npm run db:migrate:local`

## Key source files

| File | Responsibility |
|------|----------------|
| `src/lib/auth/session-store.ts` | Session cookie and D1 session CRUD |
| `src/lib/auth/session.ts` | Session read/require/redirect helpers |
| `src/lib/auth/actions.ts` | Sign-up, sign-in, logout server actions |
| `src/lib/services/users.ts` | User create and credential verification |
| `src/lib/auth/rate-limit.ts` | Server action rate limiting |
| `src/lib/auth/validation.ts` | Zod schemas and PRD error messages |
