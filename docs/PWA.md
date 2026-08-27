# Aditi Super App — Progressive Web App (PWA) Architecture

## 1. Web App Manifest
- Scope: `/`
- Display: `standalone`
- Theme Color: `#030712` (slate-950)
- Background Color: `#030712`

## 2. Service Worker Strategy
- **HTML / App Shell**: NetworkFirst with cache fallback.
- **Vite Bundled Assets (JS / CSS)**: CacheFirst with hashed asset invalidation.
- **User / Dynamic API Data**: NetworkOnly with in-memory store. Never cache authenticated private messages to public caches.
