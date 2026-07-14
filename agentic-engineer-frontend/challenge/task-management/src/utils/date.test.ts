import { describe, it, expect } from 'vitest';
import { formatDate, getDateColor, getPointLabel } from './date';

/*
  TESTING UTILITIES
  ==================
  Empezamos testeando funciones puras (sin React).
  Son las mas faciles de testear porque no necesitan DOM.
  Dado un input, verificamos que el output es correcto.
*/

describe('formatDate', () => {
  it('formats a date string to readable format', () => {
    const result = formatDate('2026-07-20T00:00:00Z');
    expect(result).toContain('Jul');
    expect(result).toContain('20');
    expect(result).toContain('2026');
  });
});

describe('getDateColor', () => {
  it('returns "red" for past dates', () => {
    const pastDate = new Date(Date.now() - 86400000 * 5).toISOString();
    expect(getDateColor(pastDate)).toBe('red');
  });

  it('returns "yellow" for dates within 2 days', () => {
    const soonDate = new Date(Date.now() + 86400000).toISOString();
    expect(getDateColor(soonDate)).toBe('yellow');
  });

  it('returns "green" for dates more than 2 days away', () => {
    const futureDate = new Date(Date.now() + 86400000 * 10).toISOString();
    expect(getDateColor(futureDate)).toBe('green');
  });
});

describe('getPointLabel', () => {
  it('returns correct label for known values', () => {
    expect(getPointLabel('ZERO')).toBe('0 Points');
    expect(getPointLabel('ONE')).toBe('1 Point');
    expect(getPointLabel('FOUR')).toBe('4 Points');
    expect(getPointLabel('EIGHT')).toBe('8 Points');
  });

  it('returns the raw value for unknown inputs', () => {
    expect(getPointLabel('UNKNOWN')).toBe('UNKNOWN');
  });
});
