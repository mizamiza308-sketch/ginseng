# Workspace

## Overview

Mobile-first casino website (KASINOKU) — Indonesian online casino/lottery platform styled after tunasjitu.com. Features user registration/login, dashboard, deposit/withdraw, and admin panel.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/casino), dark green/gold casino theme
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Auth**: Cookie-based sessions (SHA-256 hashed passwords)
- **Animation**: Framer Motion
- **Forms**: react-hook-form + @hookform/resolvers

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── casino/             # React+Vite casino frontend (previewPath: /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
└── scripts/                # Utility scripts
```

## Casino Pages

- `/` — Homepage (public): hero banner, MASUK/DAFTAR buttons (logged out) or WITHDRAW/DEPOSIT (logged in), jackpot counter, game categories
- `/login` — Login page (MASUK)
- `/register` — Register page (DAFTAR AKUN) with bank selection
- `/user/profile` — User dashboard (auth required)
- `/user/deposit` — Deposit form (auth required)
- `/user/withdraw` — Withdraw form (auth required)
- `/admin` — Admin dashboard (admin role required)
- `/admin/users` — Manage users (admin role)
- `/admin/transactions` — Manage transactions (admin role)

## Admin Credentials

- Username: `admin`
- Password: `admin123`

## API Routes

All routes under `/api`:
- `POST /auth/register` — register
- `POST /auth/login` — login
- `POST /auth/logout` — logout
- `GET /auth/me` — get current session user
- `GET /user/profile` — user profile with totals
- `GET /transactions` — user transactions (type=deposit|withdraw|all, limit=N)
- `POST /transactions/deposit` — create deposit (min 10,000)
- `POST /transactions/withdraw` — create withdraw (min 50,000)
- `GET /admin/users` — admin: all users
- `PATCH /admin/users/:id/balance` — admin: update user balance
- `PATCH /admin/users/:id/status` — admin: update user status
- `GET /admin/transactions` — admin: all transactions
- `PATCH /admin/transactions/:id/status` — admin: approve/reject transaction (auto-updates user balance)

## DB Schema

- `users` — id, username, password (SHA-256), email, phone, bank_name, bank_account, bank_account_name, balance, role (user|admin), status (active|suspended)
- `sessions` — id, user_id, token, expires_at
- `transactions` — id, user_id, type (deposit|withdraw), amount, status (pending|approved|rejected), bank details, payment_method, promo_code, notes

## Auth System

- Cookie-based sessions (`session_token` httpOnly cookie)
- Password hashed with SHA-256 + salt (`casino_secret_2024` or `SECRET_SALT` env var)
- Sessions expire after 7 days
