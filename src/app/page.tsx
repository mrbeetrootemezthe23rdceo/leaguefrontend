import pool from '@/lib/db';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface LeaderboardRow {
  champion_name: string;
  role: string;
  games_played: string;
  wins: string;
  win_rate_pct: string;
  avg_kills: string;
  avg_deaths: string;
  avg_assists: string;
}

async function getLeaderboard(): Promise<LeaderboardRow[]> {
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Champion</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Games</TableHead>
                <TableHead className="text-right">Win Rate</TableHead>
                <TableHead className="text-right">K</TableHead>
                <TableHead className="text-right">D</TableHead>
                <TableHead className="text-right">A</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{row.champion_name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{row.role}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{row.games_played}</TableCell>
                  <TableCell className="text-right">{row.win_rate_pct}%</TableCell>
                  <TableCell className="text-right">{row.avg_kills}</TableCell>
                  <TableCell className="text-right">{row.avg_deaths}</TableCell>
                  <TableCell className="text-right">{row.avg_assists}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}