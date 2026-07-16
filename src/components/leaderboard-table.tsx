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
import { ArrowUpDown } from 'lucide-react';

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

const ROLE_LABELS: Record<string, string> = {
  TOP: 'Top',
  JUNGLE: 'Jungle',
  MIDDLE: 'Mid',
  BOTTOM: 'Bottom',
  UTILITY: 'Support',
};

type SortKey = 'games_played' | 'win_rate_pct' | 'avg_kills' | 'avg_deaths' | 'avg_assists';

export default function LeaderboardTable({ data }: { data: LeaderboardRow[] }) {
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

  const sorted = [...data].sort((a, b) => {
    const aVal = Number(a[sortKey]);
    const bVal = Number(b[sortKey]);
    return sortDesc ? bVal - aVal : aVal - bVal;
  });

  function SortableHead({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) {
    return (
      <TableHead
        className="text-right cursor-pointer select-none"
        onClick={() => handleSort(sortKeyName)}
      >
        <span className="inline-flex items-center gap-1">
          {label}
          <ArrowUpDown className="h-3 w-3 opacity-50" />
        </span>
      </TableHead>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Champion</TableHead>
          <TableHead>Role</TableHead>
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
            <TableCell className="font-medium">{row.champion_name}</TableCell>
            <TableCell>
              <Badge variant="secondary">{ROLE_LABELS[row.role] ?? row.role}</Badge>
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
  );
}