import { describe, it, expect } from 'vitest';
import { generateSvgAvatar, getSafeAvatarUrl, getInitials } from '../utils/avatarUtils';

describe('Avatar Safety & Fallback Utility Suite', () => {
  it('correctly extracts initials from single and multi-word names', () => {
    expect(getInitials('Aditi User')).toBe('AU');
    expect(getInitials('Priya Varma')).toBe('PV');
    expect(getInitials('John')).toBe('JO');
    expect(getInitials('')).toBe('A');
  });

  it('generates valid, non-empty inline SVG data URIs', () => {
    const svg = generateSvgAvatar('Aditi User');
    expect(svg.startsWith('data:image/svg+xml;utf8,')).toBe(true);
    expect(decodeURIComponent(svg)).toContain('AU');
    expect(decodeURIComponent(svg)).toContain('<svg');
    expect(decodeURIComponent(svg)).toContain('</svg>');
  });

  it('falls back to generated SVG avatar when avatar URL is null, empty, undefined or invalid', () => {
    const nullAvatar = getSafeAvatarUrl(null, 'John Doe');
    expect(nullAvatar.startsWith('data:image/svg+xml;utf8,')).toBe(true);
    expect(decodeURIComponent(nullAvatar)).toContain('JD');

    const emptyAvatar = getSafeAvatarUrl('', 'Sara Ali');
    expect(emptyAvatar.startsWith('data:image/svg+xml;utf8,')).toBe(true);
    expect(decodeURIComponent(emptyAvatar)).toContain('SA');

    const undefinedAvatar = getSafeAvatarUrl(undefined, 'Rahul');
    expect(undefinedAvatar.startsWith('data:image/svg+xml;utf8,')).toBe(true);
    expect(decodeURIComponent(undefinedAvatar)).toContain('RA');

    const stringUndefinedAvatar = getSafeAvatarUrl('undefined', 'Rahul');
    expect(stringUndefinedAvatar.startsWith('data:image/svg+xml;utf8,')).toBe(true);
  });

  it('preserves valid custom avatar URLs and data URLs', () => {
    const customUrl = 'https://custom.domain.com/avatar.jpg';
    expect(getSafeAvatarUrl(customUrl, 'John Doe')).toBe(customUrl);

    const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    expect(getSafeAvatarUrl(dataUrl, 'John Doe')).toBe(dataUrl);
  });
});
