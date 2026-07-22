export interface MatchesByMonthRow {
  match_month: string;
  matches_count: string | number;
}

export interface MatchesByMonth {
  month: string;
  matches: number;
}

export function shapeMatchesByMonth(rows: MatchesByMonthRow[]): MatchesByMonth[] {
  return rows.map((row) => ({
    month: row.match_month,
    matches: Number(row.matches_count),
  }));
}

export function findMostActiveMonth(
  matchesByMonth: MatchesByMonth[]
): MatchesByMonth | undefined {
  return matchesByMonth.reduce<MatchesByMonth | undefined>(
    (max, current) => (!max || current.matches > max.matches ? current : max),
    undefined
  );
}