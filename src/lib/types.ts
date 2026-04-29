/**
 * Shared TypeScript shapes for the data files in src/data.
 * Once persistence is wired up (Netlify Functions / DB), these types remain
 * the source of truth so the UI doesn't need to change.
 */

export type ClanRole = 'Leader' | 'Co-Leader' | 'Officer' | 'Member' | 'Recruit'

export interface Member {
  id: string
  name: string
  role: string
  clanRole: ClanRole
  games: string[]
  bio: string
  funTags: string[]
  avatar: string
}

export interface ClanEvent {
  id: string
  title: string
  date: string
  game: 'PUBG' | 'ARC Raiders' | 'Mixed' | string
  description: string
  image?: string
}

export interface NewsItem {
  id: string
  text: string
  category: string
  color: string
}

export interface VideoItem {
  id: string
  title: string
  description: string
  url: string
  thumbnail: string
  platform: 'YouTube' | 'Twitch' | string
}

export interface Milestone {
  id: string
  year: string
  title: string
  description: string
}

export interface Settings {
  clanName: string
  clanTagline: string
  bannerUrl: string
  discordUrl: string
  twitchUrl: string
  youtubeUrl: string
  newsTickerText: string
  tickerSpeed: number
  contactEmail: string
}

/* ------------------------------------------------------------ */
/* Helpers                                                        */
/* ------------------------------------------------------------ */

export function gameTagClass(game: string): string {
  if (game === 'PUBG') return 'lg-tag lg-tag-pubg'
  if (game === 'ARC Raiders') return 'lg-tag lg-tag-arc'
  return 'lg-tag'
}
