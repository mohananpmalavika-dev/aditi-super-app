# Aditi Super App — Realtime Chat Architecture

## 1. Messaging Data Flow

```
Sender (Browser)
    │
    ▼ (Validated by ChatMessageSchema via Zod)
POST /messages (Supabase DB)
    │
    ▼
PostgreSQL `messages` Table (UUID Primary Key)
    │
    ▼ (Realtime Replication via postgres_changes)
Supabase Realtime WebSocket Broadcast
    │
    ▼
Recipient Client (Auto-appends message to conversation state)
```

## 2. Key Messaging Features
1. **Server-Authoritative Disappearing Messages**:
   - `expires_at` timestamp stored directly in PostgreSQL.
   - Client filtration hides expired messages immediately.
2. **Multi-User Group Channels**:
   - Explicit membership validation via `conversation_members` table and RLS.
3. **Anti-Spam 3-Message Limitation**:
   - Enforces a 3-message limit for non-friend direct contacts until accepted or replied to.
4. **Talking Portrait & Audio-Reactive Voice Player**:
   - Real-time client-side lip-sync facial morphing synchronized with audio playback and Web Audio API.
