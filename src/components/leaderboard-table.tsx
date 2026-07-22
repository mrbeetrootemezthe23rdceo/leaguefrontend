'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ArrowUpDown } from 'lucide-react';
import { championIconUrl } from '@/lib/ddragon';

interface RoleRow {
  champion_name: string;
  riot_id: string;
  role: string;
  games_played: string;
  wins: string;
  win_rate_pct: string;
  avg_kills: string;
  avg_deaths: string;
  avg_assists: string;
}

interface ChampionRow {
  champion_name: string;
  riot_id: string;
  games_played: string;
  wins: string;
  win_rate_pct: string;
  avg_kills: string;
  avg_deaths: string;
  avg_assists: string;
}

const ROLE_LABELS: Record<string, string> = {
  TOP: 'Top',
  JUNGLE: 'Jungle',
  MIDDLE: 'Mid',
  BOTTOM: 'Bottom',
  UTILITY: 'Support',
};

type SortKey = 'games_played' | 'win_rate_pct' | 'avg_kills' | 'avg_deaths' | 'avg_assists';
type ViewMode = 'role' | 'champion';

export default function LeaderboardTable({
  roleData,
  championData,
}: {
  roleData: RoleRow[];
  championData: ChampionRow[];
}) {
  const [view, setView] = useState<ViewMode>('role');
  const [sortKey, setSortKey] = useState<SortKey>('games_played');
  const [sortDesc, setSortDesc] = useState(true);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDesc(!sortDesc);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  }

  const activeData: (RoleRow | ChampionRow)[] = view === 'role' ? roleData : championData;

  const sorted = [...activeData].sort((a, b) => {
    const aVal = Number(a[sortKey]);
    const bVal = Number(b[sortKey]);
    return sortDesc ? bVal - aVal : aVal - bVal;
  });

  function SortableHead({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) {
    return (
      <TableHead className="text-right">
        <span
          className="inline-flex items-center gap-1 cursor-pointer select-none rounded px-2 py-1 -mx-2 -my-1 hover:bg-accent"
          onClick={() => handleSort(sortKeyName)}
        >
          {label}
          <ArrowUpDown className="h-3 w-3 opacity-50" />
        </span>
      </TableHead>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup
        multiple={false}
        value={[view]}
        onValueChange={(value) => {
          if (value.length > 0) {
            setView(value[0] as ViewMode);
          }
        }}
        variant="outline"
        className="self-start"
      >
        <ToggleGroupItem value="role" className="cursor-pointer data-[pressed]:cursor-default">
          Show role data
        </ToggleGroupItem>
        <ToggleGroupItem value="champion" className="cursor-pointer data-[pressed]:cursor-default">
          Show champion data
        </ToggleGroupItem>
      </ToggleGroup>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Champion</TableHead>
            {view === 'role' && <TableHead>Role</TableHead>}
            <SortableHead label="Games" sortKeyName="games_played" />
            <SortableHead label="Win Rate" sortKeyName="win_rate_pct" />
            <SortableHead label="K" sortKeyName="avg_kills" />
            <SortableHead label="D" sortKeyName="avg_deaths" />
            <SortableHead label="A" sortKeyName="avg_assists" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <img
                    src={championIconUrl(row.riot_id)}
                    alt={row.champion_name}
                    className="size-6 rounded-full"
                  />
                  {row.champion_name}
                </div>
              </TableCell>
              {view === 'role' && (
                <TableCell>
                  <Badge variant="secondary">
                    {ROLE_LABELS[(row as RoleRow).role] ?? (row as RoleRow).role}
                  </Badge>
                </TableCell>
              )}
              <TableCell className="text-right">{row.games_played}</TableCell>
              <TableCell className="text-right">{row.win_rate_pct}%</TableCell>
              <TableCell className="text-right">{row.avg_kills}</TableCell>
              <TableCell className="text-right">{row.avg_deaths}</TableCell>
              <TableCell className="text-right">{row.avg_assists}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
