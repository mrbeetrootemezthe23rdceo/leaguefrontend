import { describe, it, expect, vi } from 'vitest';
import type { Pool } from 'pg';
import { fetchLeaderboard } from './leaderboard';

function mockPool(queryImpl: any): Pool {
  return { query: vi.fn(queryImpl) } as unknown as Pool;
}

describe('fetchLeaderboard', () => {
  it('returns rows from the query', async () => {
    const pool = mockPool(() =>
      Promise.resolve({
        rows: [{ champion_name: 'Ashe', role: 'ADC', games_played: 10, wins: 7, win_rate_pct: 70 }],
      })
    );

    const result = await fetchLeaderboard(pool);

    expect(pool.query).toHaveBeenCalledOnce();
    expect(result).toEqual([
      { champion_name: 'Ashe', role: 'ADC', games_played: 10, wins: 7, win_rate_pct: 70 },
    ]);
  });

  it('propagates errors from the pool', async () => {
    const pool = mockPool(() => Promise.reject(new Error('connection lost')));

    await expect(fetchLeaderboard(pool)).rejects.toThrow('connection lost');
  });
});