# Aditi Super App — Audio & Video Calling Architecture

## 1. WebRTC Calling Engine
Aditi incorporates WebRTC 1.0 audio/video calling with screen sharing and call merger capabilities.

```
Client A                                         Client B
   │                                                │
   ├────── SDP Offer / Answer (Supabase Realtime) ─►│
   │◄───── ICE Candidates Exchange ────────────────┤
   │                                                │
   ▼                                                ▼
┌──────────────────────────────────────────────────────┐
│ Direct P2P Media Stream (SRTP / DTLS Encryption)     │
│ Fallback: Coturn / TURN Relay Server for Symmetric NAT│
└──────────────────────────────────────────────────────┘
```

## 2. ICE Configuration
- **STUN Servers**: `stun:stun.l.google.com:19302`, `stun:stun1.l.google.com:19302`
- **TURN Relay**: Recommended deployment using `coturn` on port 3478 with TLS on port 5349.
