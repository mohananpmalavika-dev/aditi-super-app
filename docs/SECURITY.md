# Aditi Super App — Security Architecture & Threat Model

## 1. Threat Model & Mitigations

| Threat | Attack Vector | Production Mitigation |
|---|---|---|
| **Account Takeover** | Credential stuffing, brute force | Supabase Auth rate limiting, strong bcrypt/argon2 on auth server |
| **Client-Side Credential Theft** | Malicious script scraping localStorage | Zero password hashes stored in browser storage (IndexedDB/localStorage) |
| **Insecure Direct Object Reference (IDOR)** | Modifying user ID in client requests | PostgreSQL Row Level Security (RLS) policies enforcing `auth.uid() = user_id` |
| **Cross-Site Scripting (XSS)** | Malicious chat or post payloads | Plain React text escaping, input sanitization via Zod runtime schemas |
| **Spam / Harassment** | Mass messaging, fake profiles | Disposable email blocking, anti-spam message rate limits, user blocking table |
| **Biometric Bypass** | Simulating camera/fingerprint callbacks | Removal of timer-based simulation; authentications require genuine JWT sessions |

## 2. Content Security Policy (CSP) Guidelines
For production deployment via Cloudflare / Netlify / Vercel:
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://api.qrserver.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https://images.unsplash.com https://api.qrserver.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.qrserver.com; font-src 'self' https://fonts.gstatic.com; media-src 'self' blob: data:; object-src 'none'; frame-ancestors 'none';
```
