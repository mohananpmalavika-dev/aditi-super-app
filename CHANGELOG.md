# Changelog — Aditi Super App

## [1.0.0-prod] - 2026-08-27

### Added
- Authoritative Supabase Auth integration (Email/Password, Google OAuth, Password Reset).
- Production PostgreSQL database schema migration with 24 normalized tables and full Row Level Security (`20260827_initial_schema.sql`).
- Runtime input validation with `zod` for registration, authentication, chat messages, and polls.
- Full architectural and security documentation in `docs/` (`ARCHITECTURE.md`, `DATABASE.md`, `AUTHENTICATION.md`, `SECURITY.md`, `CHAT_ARCHITECTURE.md`, `WEBRTC.md`, `PWA.md`, `DEPLOYMENT.md`, `PRIVACY.md`, `TESTING.md`, `PRODUCTION_CHECKLIST.md`).

### Removed / Hardened
- Removed client-side browser password database and static-salt `hashPassword()` in IndexedDB/localStorage.
- Removed timer-based simulated authentications in Face Unlock and Fingerprint modals.
- Removed fake automatic bot replies (`setTimeout`) in live chat messenger.
- Removed hardcoded `INITIAL_USER` query dependencies in favor of dynamic `auth.uid()`.
- Accurate labeling for Personalized TTS Voice Profiles and Sandbox Demo Wallet.
