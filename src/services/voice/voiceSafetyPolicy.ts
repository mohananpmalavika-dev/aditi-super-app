/**
 * voiceSafetyPolicy.ts
 * Mandatory Safety, Privacy & Anti-Impersonation Policy for Aditi Voice Clone System
 * 
 * Safety Rules:
 * 1. Blocks synthetic voice generation for sensitive authentication data (OTP, PINs, Passwords, CVVs).
 * 2. Adds visual cautionary disclaimers for financial transfer instructions.
 * 3. Enforces that only messages authored and sent by the voice owner can be synthesized.
 * 4. Ensures synthetic voice audio is never used for biometric authentication or proof of identity.
 */

import { VoiceSafetyCheckResult } from '../../types/superApp';

// Patterns for sensitive authentication information
const SENSITIVE_PATTERNS = [
  /\b(otp|one[\s-]?time[\s-]?password)\b/i,
  /\b(password|passcode|secret\s*key|auth\s*token)\b/i,
  /\b(upi\s*pin|atm\s*pin|mpin|card\s*cvv|cvv2)\b/i,
  /\b(bank\s*otp|verification\s*code|security\s*code)\b/i,
  /\b\d{4,8}\b(?=.*\b(otp|pin|code|verify)\b)/i
];

// Patterns for financial and money transfer instructions
const FINANCIAL_PATTERNS = [
  /\b(send\s*money|transfer\s*money|pay\s*immediately|urgent\s*payment)\b/i,
  /\b(upi\s*id|gpay|phonepe|paytm|bank\s*account|ifsc)\b/i,
  /\b(₹\s*\d+|\b\d+\s*rupees?|rs\.?\s*\d+)\b/i
];

/**
 * Validates whether a message is eligible for synthetic voice generation under the safety policy.
 */
export function evaluateVoiceSafety(text: string): VoiceSafetyCheckResult {
  if (!text || !text.trim()) {
    return { isAllowed: false, reason: 'SENSITIVE_CONTENT_BLOCKED', warningMessage: 'Empty message' };
  }

  const cleanText = text.trim();

  // 1. Check for sensitive authentication codes / OTPs
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(cleanText)) {
      return {
        isAllowed: false,
        reason: 'SENSITIVE_CONTENT_BLOCKED',
        warningMessage: '🔒 Voice playback unavailable for sensitive authentication content (OTP/PIN/Password).'
      };
    }
  }

  // 2. Check for financial transaction mentions (Allowed, but with verification warning)
  for (const pattern of FINANCIAL_PATTERNS) {
    if (pattern.test(cleanText)) {
      return {
        isAllowed: true,
        reason: 'FINANCIAL_WARNING',
        warningMessage: '⚠️ AI-generated voice • Verify financial requests independently before proceeding.'
      };
    }
  }

  // 3. Normal safe message
  return {
    isAllowed: true
  };
}

/**
 * Asserts anti-impersonation policy:
 * Confirms that synthetic voice can only be generated for text authored by the voice owner.
 */
export function assertAntiImpersonation(
  messageSenderId: string,
  voiceOwnerId: string
): { isValid: boolean; error?: string } {
  if (!messageSenderId || !voiceOwnerId) {
    return { isValid: false, error: 'Invalid sender or voice profile identity.' };
  }

  const matches =
    messageSenderId === voiceOwnerId ||
    messageSenderId.toLowerCase() === voiceOwnerId.toLowerCase();

  if (!matches) {
    return {
      isValid: false,
      error: 'Security Policy Violation: Cannot synthesize voice for text not authored by the voice owner.'
    };
  }

  return { isValid: true };
}
