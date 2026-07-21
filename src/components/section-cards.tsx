"use client"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { championLoadingImageUrl } from "@/lib/ddragon"

interface MostPlayedChampion {
  champion_name: string
  riot_id: string
  games_played: string
}

interface HighestWinRateChampion {
  champion_name: string
  riot_id: string
  games_played: string
  win_rate_pct: string
}

interface MostActiveMonth {
  month: string
  matches: number
}

export function SectionCards({
  mostPlayedChampion,
  highestWinRateChampion,
  totalMatches,
  mostActiveMonth,
}: {
  mostPlayedChampion?: MostPlayedChampion
  highestWinRateChampion?: HighestWinRateChampion
  totalMatches?: number
  mostActiveMonth?: MostActiveMonth
}) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card relative overflow-hidden">
        <CardHeader className="relative z-10">
          <CardDescription>Most Played Champion</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {mostPlayedChampion?.champion_name ?? "—"}
          </CardTitle>
        </CardHeader>
        <CardFooter className="relative z-10 flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {mostPlayedChampion
              ? `${Number(mostPlayedChampion.games_played).toLocaleString("en-US")} games played`
              : "No data yet"}
          </div>
          <div className="text-muted-foreground">
            Across all roles and queues
          </div>
        </CardFooter>
        {mostPlayedChampion && (
          <img
            src={championLoadingImageUrl(mostPlayedChampion.riot_id)}
            alt=""
            className="absolute inset-y-0 right-0 w-28 object-cover object-top [mask-image:linear-gradient(to_left,black_60%,transparent)] [-webkit-mask-image:linear-gradient(to_left,black_60%,transparent)]"
          />
        )}
      </Card>
      <Card className="@container/card relative overflow-hidden">
        <CardHeader className="relative z-10">
          <CardDescription>Highest Win Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {highestWinRateChampion?.champion_name ?? "—"}
          </CardTitle>
        </CardHeader>
        <CardFooter className="relative z-10 flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {highestWinRateChampion
              ? `${highestWinRateChampion.win_rate_pct}% win rate`
              : "No data yet"}
          </div>
          <div className="text-muted-foreground">
            Min. 50 games played to qualify
          </div>
        </CardFooter>
        {highestWinRateChampion && (
          <img
            src={championLoadingImageUrl(highestWinRateChampion.riot_id)}
            alt=""
            className="absolute inset-y-0 right-0 w-28 object-cover object-top [mask-image:linear-gradient(to_left,black_60%,transparent)] [-webkit-mask-image:linear-gradient(to_left,black_60%,transparent)]"
          />
        )}
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Matches Tracked</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalMatches !== undefined ? totalMatches.toLocaleString("en-US") : "—"}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Matches ingested to date
          </div>
          <div className="text-muted-foreground">From the leaguepipeline ingestion job</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Most Active Month</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {mostActiveMonth
              ? new Date(mostActiveMonth.month).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              : "—"}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {mostActiveMonth
              ? `${mostActiveMonth.matches.toLocaleString("en-US")} games ingested`
              : "No data yet"}
          </div>
          <div className="text-muted-foreground">Busiest month tracked so far</div>
        </CardFooter>
      </Card>
    </div>
  )
}
