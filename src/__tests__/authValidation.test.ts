import { describe, it, expect } from 'vitest';
import { LoginSchema, RegisterSchema } from '../lib/validation/authSchemas';
import { isDummyOrDisposableAccount } from '../services/cloudDatabaseService';

describe('Authentication & Registration Validation', () => {
  it('validates genuine login credentials successfully', () => {
    const validLogin = {
      email: 'user@malabarbazaar.shop',
      password: 'StrongPassword123!'
    };
    const result = LoginSchema.safeParse(validLogin);
    expect(result.success).toBe(true);
  });

  it('rejects malformed or short email logins', () => {
    const invalidLogin = {
      email: 'invalid-email',
      password: '123'
    };
    const result = LoginSchema.safeParse(invalidLogin);
    expect(result.success).toBe(false);
  });

  it('rejects passwords shorter than 6 characters', () => {
    const shortPassword = {
      email: 'user@example.org',
      password: '123'
    };
    const result = LoginSchema.safeParse(shortPassword);
    expect(result.success).toBe(false);
  });

  it('validates comprehensive user registration', () => {
    const validReg = {
      name: 'Aditi Tester',
      email: 'aditi.tester@gmail.com',
      password: 'SecretPassword99',
      handle: '@adititester',
      zodiacSign: 'Leo',
      location: 'Kozhikode, Kerala'
    };
    const result = RegisterSchema.safeParse(validReg);
    expect(result.success).toBe(true);
  });

  it('blocks disposable and fake test emails strictly', () => {
    expect(isDummyOrDisposableAccount('test@mailinator.com')).toBe(true);
    expect(isDummyOrDisposableAccount('fakeuser@trashmail.com')).toBe(true);
    expect(isDummyOrDisposableAccount('12345@test.com')).toBe(true);
    expect(isDummyOrDisposableAccount('demo@example.com')).toBe(true);
    expect(isDummyOrDisposableAccount('real.user@gmail.com')).toBe(false);
  });
});
