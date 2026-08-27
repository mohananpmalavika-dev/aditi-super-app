# Aditi Super App (LifeOS) 🚀

> **Production Multi-User Super App Platform** built with React 18, TypeScript, Supabase Auth & PostgreSQL, Row Level Security (RLS), Realtime WebSockets, WebRTC calling, and PWA capabilities.

---

## 🌟 Overview & Architecture

Aditi Super App integrates essential modern lifestyle utilities, communication tools, and local commerce into a single, cohesive, high-performance Progressive Web App.

```
                         ┌───────────────────────────┐
                         │   Cloudflare CDN / HTTPS  │
                         └─────────────┬─────────────┘
                                       │
                                       ▼
                         ┌───────────────────────────┐
                         │      React 18 + Vite      │
                         │   Progressive Web App     │
                         └─────────────┬─────────────┘
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            ▼                          ▼                          ▼
     Supabase Auth              Supabase DB                Supabase Storage
   (JWT / OAuth / RLS)      (PostgreSQL 15 + RLS)       (Encrypted S3 Buckets)
            │                          │                          │
            └─────────────┬────────────┴────────────┬─────────────┘
                          │                         │
                          ▼                         ▼
                   Edge Functions           Supabase Realtime
                 (Serverless APIs)         (WebSockets / PubSub)
```

---

## 🛡️ Security & Authentication Architecture

- **Authoritative Identity Boundary**: Managed 100% by Supabase Auth (`signUp`, `signInWithPassword`, Google PKCE OAuth, and authoritative password resets).
- **Zero Browser Passwords**: Passwords and cryptographic hashes are never stored or verified inside browser localStorage or IndexedDB.
- **Hardware Device Re-authentication**: Real WebAuthn platform authenticator integration (`deviceLockService.ts`) requiring genuine hardware assertions (Face ID / Touch ID / Windows Hello / Android Biometrics).
- **Runtime Validation**: Powered by `zod` for strict runtime boundary validation (`authSchemas.ts`, `chatSchemas.ts`).
- **Disposable Email Protection**: Real-time domain and keyword filter engine blocking dummy and throwaway emails (`isDummyOrDisposableAccount`).

---

## 🗄️ Database & Row Level Security (RLS)

- **PostgreSQL 15 Engine**: Full version-controlled schema in [`supabase/migrations/20260827_initial_schema.sql`](supabase/migrations/20260827_initial_schema.sql).
- **Separated Operation Policies**: Explicit `SELECT`, `INSERT`, `UPDATE`, and `DELETE` RLS rules with `WITH CHECK (auth.uid() = ...)` isolation across:
  - `profiles`, `friendships`, `user_blocks`, `user_reports`
  - `conversations`, `conversation_members`, `messages`, `message_reactions`
  - `posts`, `post_likes`, `post_comments`
  - `properties`, `property_saves`
  - `matrimony_profiles`, `matrimony_interests`
  - `tutors`, `tutor_bookings`
  - `tasks`, `habits`, `habit_entries`
- **Double-Booking Prevention**: PostgreSQL `btree_gist` exclusion constraint (`no_overlapping_tutor_bookings`) rejecting concurrent overlapping bookings at the database level.

---

## 💬 Realtime Multi-User Messaging & PWA

- **Supabase Realtime WebSockets**: Live message broadcasts and channel subscriptions (`postgres_changes`).
- **Server-Authoritative Disappearing Messages**: Stored directly in PostgreSQL with `expires_at TIMESTAMPTZ`.
- **Multi-Strategy Service Worker (`public/sw.js`)**:
  - `NetworkOnly`: Remote auth tokens and Supabase API requests (zero private cache leakage).
  - `CacheFirst`: Bundled hashed JS/CSS assets and Google Fonts.
  - `StaleWhileRevalidate`: Media assets and image thumbnails.
  - `NetworkFirst`: HTML navigation requests with offline fallback.
- **Security Headers**: Strict CSP, HSTS, X-Frame-Options, and X-Content-Type-Options configured across Vercel, Netlify, and Cloudflare Pages.

---

## 🧪 Testing & CI/CD Pipeline

- **Automated Unit & Integration Testing**: Vitest test runner executing validation, device-lock security, tutor double-booking concurrency, and multi-user access control test suites.
- **Strict TypeScript Validation**: `tsc --noEmit` verified.
- **GitHub Actions**: Automated CI pipeline running linting, typechecking, tests, and production build on every push and pull request.

### Running Tests Locally

```bash
# Run unit & integration test suites
npm test

# Run strict TypeScript typecheck
npm run typecheck

# Run production build
npm run build
```

---

## 🚀 Live Deployment
- **Repository**: [github.com/mohananpmalavika-dev/aditi-super-app](https://github.com/mohananpmalavika-dev/aditi-super-app)
- **Production Domain**: [malabarbazaar.shop](https://malabarbazaar.shop)
