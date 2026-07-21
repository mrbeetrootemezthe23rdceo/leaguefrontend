import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LeaderboardTable from "@/components/leaderboard-table"
import pool from "@/lib/db"

async function getMostPlayedChampion() {
  const result = await pool.query(`
    SELECT
        c.name AS champion_name,
        COUNT(*) AS games_played
    FROM participants p
    JOIN champions c ON p.champion_id = c.champion_id
    GROUP BY c.name
    ORDER BY games_played DESC
    LIMIT 1;
  `);
  return result.rows[0];
}

async function getHighestWinRateChampion() {
  const result = await pool.query(`
    SELECT
        c.name AS champion_name,
        COUNT(*) AS games_played,
        ROUND(100.0 * SUM(CASE WHEN p.win THEN 1 ELSE 0 END) / COUNT(*), 1) AS win_rate_pct
    FROM participants p
    JOIN champions c ON p.champion_id = c.champion_id
    GROUP BY c.name
    HAVING COUNT(*) > 50
    ORDER BY win_rate_pct DESC
    LIMIT 1;
  `);
  return result.rows[0];
}

async function getTotalMatches() {
  const result = await pool.query(`SELECT COUNT(*) AS total_matches FROM matches;`);
  return Number(result.rows[0].total_matches);
}

async function getMatchesByMonth() {
  const result = await pool.query(`
    SELECT
        TO_CHAR(DATE_TRUNC('month', game_creation_ts), 'YYYY-MM-DD') AS match_month,
        COUNT(*) AS matches_count
    FROM matches
    GROUP BY match_month
    ORDER BY match_month;
  `);
  return result.rows.map((row) => ({
    month: row.match_month as string,
    matches: Number(row.matches_count),
  }));
}

async function getChampionLeaderboard() {
  const result = await pool.query(`
    SELECT
        c.name AS champion_name,
        COUNT(*) AS games_played,
        SUM(CASE WHEN p.win THEN 1 ELSE 0 END) AS wins,
        ROUND(100.0 * SUM(CASE WHEN p.win THEN 1 ELSE 0 END) / COUNT(*), 1) AS win_rate_pct,
        ROUND(AVG(p.kills), 1) AS avg_kills,
        ROUND(AVG(p.deaths), 1) AS avg_deaths,
        ROUND(AVG(p.assists), 1) AS avg_assists
    FROM participants p
    JOIN champions c ON p.champion_id = c.champion_id
    GROUP BY c.name
    HAVING COUNT(*) >= 5
    ORDER BY games_played DESC;
  `);
  return result.rows;
}

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

export default async function Page() {
  const leaderboard = await getLeaderboard();
  const championLeaderboard = await getChampionLeaderboard();
  const mostPlayedChampion = await getMostPlayedChampion();
  const highestWinRateChampion = await getHighestWinRateChampion();
  const totalMatches = await getTotalMatches();
  const matchesByMonth = await getMatchesByMonth();
  const mostActiveMonth = matchesByMonth.reduce<
    { month: string; matches: number } | undefined
  >((max, current) => (!max || current.matches > max.matches ? current : max), undefined);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards
                mostPlayedChampion={mostPlayedChampion}
                highestWinRateChampion={highestWinRateChampion}
                totalMatches={totalMatches}
                mostActiveMonth={mostActiveMonth}
              />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={matchesByMonth} />
              </div>
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Champion Leaderboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LeaderboardTable roleData={leaderboard} championData={championLeaderboard} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
