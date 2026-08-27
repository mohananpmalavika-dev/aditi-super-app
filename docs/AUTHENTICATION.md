# Aditi Super App — Authentication Architecture

## 1. Authoritative Identity Provider
Authentication is 100% managed by **Supabase Auth**. No password hashes or credentials are ever stored or verified inside browser localStorage or IndexedDB.

```
Client (React)
    │
    ├─► Supabase Auth (Sign Up / Sign In)
    │       │
    │       ▼
    │   PostgreSQL (auth.users)
    │       │
    │       ▼ (Postgres Trigger)
    │   public.profiles
    │
    └─► Google OAuth (Redirect)
            │
            ▼
        Google Identity Provider
            │
            ▼
        Supabase Token Exchange
            │
            ▼
        Verified JWT Session
```

## 2. Authentication Methods Supported
1. **Email & Password**:
   - Minimum 6 characters with RFC 5322 validation.
   - Verified server-side via `supabase.auth.signInWithPassword()`.
2. **Google / Gmail OAuth**:
   - Standard PKCE OAuth flow using `supabase.auth.signInWithOAuth({ provider: 'google' })`.
3. **Password Reset**:
   - Authoritative email reset dispatch via `supabase.auth.resetPasswordForEmail()`.

## 3. Dummy & Disposable Account Mitigation
- Keyword filtering and disposable email domain detection via `isDummyOrDisposableAccount()`.
- RFC 5322 regex checks.

## 4. Hardware WebAuthn Biometrics
- WebAuthn platform authenticator (`navigator.credentials.get()`) for hardware security key assertion.
- Pure timer-based simulation bypasses have been removed.
