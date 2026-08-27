# Aditi Super App — Architecture Overview

## 1. System Topology

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
                          │                         │
            ┌─────────────┴─────────────┐           │
            ▼                           ▼           ▼
     AI Media Studio              Web Push / PWA   WebRTC Signaling
   (Custom TTS / Canvas)          Notifications   (STUN / TURN Coturn)
```

## 2. Layered Structure

1. **Presentation Layer (`src/components/`)**:
   - Organized modularly by feature domain (`auth`, `chat`, `social`, `realestate`, `matrimony`, `tutor`, `productivity`, `astrology`, `wallet`, `media`).
2. **State & Orchestration (`src/context/SuperAppContext.tsx`)**:
   - Server-state synchronization, device session handling, active mini-app switching.
3. **Data Access & Backend APIs (`src/services/cloudDatabaseService.ts`)**:
   - Supabase PostgreSQL authoritative repository layer with `auth.uid()` security boundaries.
4. **Runtime Validation Layer (`src/lib/validation/`)**:
   - Zod schemas validating user registrations, logins, messages, bookings, and payloads before database ingestion.
5. **Database & Storage Layer (`supabase/migrations/`)**:
   - PostgreSQL schema with Row Level Security (RLS) policies on all tables.
