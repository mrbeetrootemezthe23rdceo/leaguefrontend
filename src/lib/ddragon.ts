export const DDRAGON_VERSION = '16.14.1';

export function championIconUrl(riotId: string) {
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${riotId}.png`;
}

export function championLoadingImageUrl(riotId: string) {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${riotId}_0.jpg`;
}
