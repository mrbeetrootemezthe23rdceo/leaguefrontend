import pool from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LeaderboardTable from '@/components/leaderboard-table';

async function getLeaderboard() {
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
  return result.rows;
}

export default async function Home() {
  const leaderboard = await getLeaderboard();

  return (
    <main className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Champion Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <LeaderboardTable data={leaderboard} />
        </CardContent>
      </Card>
    </main>
  );
}