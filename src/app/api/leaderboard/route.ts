import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { fetchLeaderboard } from '@/lib/queries/leaderboard';

export const revalidate = 120;

export async function GET() {
  try {
    const rows = await fetchLeaderboard(pool);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Leaderboard query failed:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}