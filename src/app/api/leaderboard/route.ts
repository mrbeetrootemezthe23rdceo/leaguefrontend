import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const revalidate = 120; // revalidate this page every 2 minutes

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
          c.name AS champion_name,
          p.role,
          COUNT(*) AS games_played,
          SUM(CASE WHEN p.win THEN 1 ELSE 0 END) AS wins,
          ROUND(100.0 * SUM(CASE WHEN p.win THEN 1 ELSE 0 END) / COUNT(*), 1) AS win_rate_pct,
          ROUND(AVG(p.kills), 1) AS avg_kills,
          ROUND(AVG(p.deaths), 1) AS avg_deaths,
          ROUND(AVG(p.assists), 1) AS avg_assists
      FROM participants p
      JOIN champions c ON p.champion_id = c.champion_id
      WHERE p.role != ''
      GROUP BY c.name, p.role
      HAVING COUNT(*) >= 5
      ORDER BY games_played DESC;
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Leaderboard query failed:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}