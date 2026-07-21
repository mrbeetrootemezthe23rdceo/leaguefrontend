export const DDRAGON_VERSION = '16.14.1';

export function championIconUrl(riotId: string) {
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${riotId}.png`;
}
