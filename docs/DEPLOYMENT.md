# Aditi Super App — Production Deployment Guide

## 1. Environment Variables
Create `.env.production` with:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_URL=https://malabarbazaar.shop
```

## 2. Build Pipeline
```bash
npm install
npm run build
```

## 3. Custom Domain & DNS Configuration
- Domain: `https://malabarbazaar.shop`
- SSL: Automated Full (Strict) SSL via Cloudflare / Netlify / Vercel Edge.
