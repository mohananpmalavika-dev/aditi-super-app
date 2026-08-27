# Changelog — Aditi Super App

## [1.0.0-prod.2] - 2026-08-27

### Security & Hardening
- **Deleted `databaseEngine.ts`**: Completely removed client-side password hashing, static salts, and browser-stored password records in IndexedDB/localStorage.
- **Fixed `deviceLockService.ts`**: Enforced strict WebAuthn assertion check. Any unsupported, cancelled, or failed hardware assertion now returns `success: false` with zero simulation bypasses.
- **Hardened PostgreSQL RLS**: Split all `FOR ALL` policies into explicit `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies with strict `WITH CHECK` clauses in `20260827_initial_schema.sql`.
- **Tutor Double-Booking Prevention**: Added PostgreSQL `btree_gist` exclusion constraint `no_overlapping_tutor_bookings` to prevent time slot collisions at the database engine level.
- **Service Worker Multi-Strategy**: Rewrote `public/sw.js` with `NetworkOnly` for auth/credentials, `CacheFirst` for static assets, `StaleWhileRevalidate` for images, and `NetworkFirst` for HTML navigation.
- **Security Headers**: Added production security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options) in `vercel.json`, `netlify.toml`, and `public/_headers`.
- **Automated Testing & CI/CD**: Added Vitest test runner with 12 automated unit tests across auth validation, chat schemas, and device lock security. Added `.github/workflows/ci.yml`.
