# Aditi Super App — Testing Guide

## 1. Testing Layers
1. **Type Checking & Static Analysis**:
   - `npm run build` verifies full TypeScript type safety with zero compilation errors.
2. **Schema & Runtime Validation**:
   - Zod schemas in `src/lib/validation/` test inputs across auth and messaging boundaries.
3. **End-to-End Test Matrix**:
   - Multi-user chat delivery verification.
   - Disappearing message expiration validation.
   - Row Level Security isolation across different user sessions.
