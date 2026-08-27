import { describe, it, expect } from 'vitest';

/**
 * Validates time range overlap logic mirroring PostgreSQL's tstzrange && exclusion constraint
 */
function isOverlappingTimeSlot(
  slot1: { start: string; end: string },
  slot2: { start: string; end: string }
): boolean {
  const s1 = new Date(slot1.start).getTime();
  const e1 = new Date(slot1.end).getTime();
  const s2 = new Date(slot2.start).getTime();
  const e2 = new Date(slot2.end).getTime();

  return s1 < e2 && s2 < e1;
}

describe('Tutor Double-Booking & Time Slot Concurrency Protection', () => {
  const existingBooking = {
    tutorId: 'tutor-ananya',
    start: '2026-09-01T10:00:00.000Z',
    end: '2026-09-01T11:00:00.000Z'
  };

  it('detects direct collision on identical slot reservation', () => {
    const identicalBooking = {
      tutorId: 'tutor-ananya',
      start: '2026-09-01T10:00:00.000Z',
      end: '2026-09-01T11:00:00.000Z'
    };
    expect(isOverlappingTimeSlot(existingBooking, identicalBooking)).toBe(true);
  });

  it('detects partial overlap (10:30 to 11:30 vs 10:00 to 11:00)', () => {
    const overlappingBooking = {
      tutorId: 'tutor-ananya',
      start: '2026-09-01T10:30:00.000Z',
      end: '2026-09-01T11:30:00.000Z'
    };
    expect(isOverlappingTimeSlot(existingBooking, overlappingBooking)).toBe(true);
  });

  it('permits adjacent non-overlapping bookings (11:00 to 12:00)', () => {
    const adjacentBooking = {
      tutorId: 'tutor-ananya',
      start: '2026-09-01T11:00:00.000Z',
      end: '2026-09-01T12:00:00.000Z'
    };
    expect(isOverlappingTimeSlot(existingBooking, adjacentBooking)).toBe(false);
  });
});
