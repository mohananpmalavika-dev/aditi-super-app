import React, { useState } from 'react';

// Vibrant 3D gradient color pairs for deterministic avatar backgrounds
const AVATAR_GRADIENTS = [
  { from: '#6366f1', to: '#ec4899' }, // Indigo -> Pink
  { from: '#8b5cf6', to: '#3b82f6' }, // Violet -> Blue
  { from: '#06b6d4', to: '#3b82f6' }, // Cyan -> Blue
  { from: '#10b981', to: '#06b6d4' }, // Emerald -> Cyan
  { from: '#f59e0b', to: '#ef4444' }, // Amber -> Red
  { from: '#ec4899', to: '#f43f5e' }, // Pink -> Rose
  { from: '#a855f7', to: '#6366f1' }, // Purple -> Indigo
  { from: '#14b8a6', to: '#10b981' }, // Teal -> Emerald
  { from: '#f97316', to: '#f59e0b' }, // Orange -> Amber
  { from: '#3b82f6', to: '#6366f1' }, // Blue -> Indigo
];

/**
 * Deterministically generates initials from a name
 */
export function getInitials(name?: string): string {
  if (!name || !name.trim()) return 'A';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Returns a deterministic gradient index from string hash
 */
function getHashIndex(str: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % max;
}

/**
 * Generates an ultra-reliable, crisp inline SVG Data URI avatar with 3D bevel and initials
 */
export function generateSvgAvatar(name: string = 'Aditi User', seed?: string): string {
  const effectiveKey = seed || name || 'Aditi';
  const initials = getInitials(name);
  const colorIdx = getHashIndex(effectiveKey, AVATAR_GRADIENTS.length);
  const { from, to } = AVATAR_GRADIENTS[colorIdx];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="g_${colorIdx}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
    <linearGradient id="b_${colorIdx}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.35"/>
    </linearGradient>
    <filter id="shadow_${colorIdx}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.4"/>
    </filter>
  </defs>
  <rect width="100" height="100" rx="30" fill="url(#g_${colorIdx})"/>
  <rect width="100" height="100" rx="30" fill="url(#b_${colorIdx})"/>
  <text x="50" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="36" font-weight="900" fill="#ffffff" text-anchor="middle" dominant-baseline="middle" filter="url(#shadow_${colorIdx})">${initials}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Returns a guaranteed valid avatar URL. If avatar is missing or empty, returns an inline SVG avatar.
 */
export function getSafeAvatarUrl(avatar?: string | null, name?: string, seed?: string): string {
  if (avatar && typeof avatar === 'string' && avatar.trim().length > 0 && !avatar.includes('undefined') && !avatar.includes('null')) {
    return avatar.trim();
  }
  return generateSvgAvatar(name || 'Aditi Member', seed);
}

/**
 * Safe Image error event handler that swaps in the SVG avatar if an external URL fails or 404s
 */
export function handleAvatarError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  name: string = 'Aditi User',
  seed?: string
) {
  const fallback = generateSvgAvatar(name, seed);
  if (e.currentTarget.src !== fallback) {
    e.currentTarget.src = fallback;
  }
}

interface AvatarImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  name?: string;
  seed?: string;
  size?: number | string;
}

/**
 * Robust Avatar Component with automatic fallback and 3D styling
 */
export const AvatarImage: React.FC<AvatarImageProps> = ({
  src,
  name = 'Aditi User',
  seed,
  alt,
  className = '',
  ...props
}) => {
  const safeSrc = getSafeAvatarUrl(src, name, seed);
  const [currentSrc, setCurrentSrc] = useState(safeSrc);

  // Sync if prop changes
  React.useEffect(() => {
    setCurrentSrc(getSafeAvatarUrl(src, name, seed));
  }, [src, name, seed]);

  return (
    <img
      src={currentSrc}
      alt={alt || name}
      className={className}
      onError={() => {
        const fallback = generateSvgAvatar(name, seed);
        if (currentSrc !== fallback) {
          setCurrentSrc(fallback);
        }
      }}
      loading="lazy"
      {...props}
    />
  );
};
