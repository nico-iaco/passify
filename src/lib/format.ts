import type { Lang } from './storage'

/** Formats a millisecond duration as `< 1s`, `14s`, `1m 23s`, or `1h 05m`. */
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return '0s'
  if (ms < 1000) return '< 1s'
  const totalSeconds = Math.round(ms / 1000)
  if (totalSeconds < 60) return `${totalSeconds}s`
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m`
  }
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`
}

export function formatShortDate(epochMs: number, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'it' ? 'it-IT' : 'en-US', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(epochMs))
}

export function formatChartDate(epochMs: number, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'it' ? 'it-IT' : 'en-US', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(epochMs))
}
