import { describe, it, expect } from 'vitest';
import { shapeMatchesByMonth, findMostActiveMonth } from './transform';

describe('shapeMatchesByMonth', () => {
  it('converts matches_count to a number and renames fields', () => {
    const rows = [{ match_month: '2026-01-01', matches_count: '42' }];
    expect(shapeMatchesByMonth(rows)).toEqual([{ month: '2026-01-01', matches: 42 }]);
  });
});

describe('findMostActiveMonth', () => {
  it('picks the month with the most matches', () => {
    const months = [
      { month: '2026-01-01', matches: 10 },
      { month: '2026-02-01', matches: 25 },
      { month: '2026-03-01', matches: 15 },
    ];
    expect(findMostActiveMonth(months)).toEqual({ month: '2026-02-01', matches: 25 });
  });

  it('returns undefined for an empty list', () => {
    expect(findMostActiveMonth([])).toBeUndefined();
  });
});