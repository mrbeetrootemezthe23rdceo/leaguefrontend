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
  const mostPlayedChampion = await getMostPlayedChampion();

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
              <SectionCards mostPlayedChampion={mostPlayedChampion} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Champion Leaderboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LeaderboardTable data={leaderboard} />
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
