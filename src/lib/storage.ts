import type { QuizSession } from '../types'

const KEYS = {
  SESSION: 'qf_session',
  LANG: 'qf_lang',
  THEME: 'qf_theme',
} as const

// ─── Session ─────────────────────────────────────────────────────────────────

export function saveSession(session: QuizSession): void {
  try {
    localStorage.setItem(KEYS.SESSION, JSON.stringify(session))
  } catch {
    // storage full or unavailable — fail silently
  }
}

export function loadSession(): QuizSession | null {
  try {
    const raw = localStorage.getItem(KEYS.SESSION)
    if (!raw) return null
    return JSON.parse(raw) as QuizSession
  } catch {
    return null
  }
}

export function clearSession(): void {
  localStorage.removeItem(KEYS.SESSION)
}

// ─── Language ─────────────────────────────────────────────────────────────────

export type Lang = 'it' | 'en'

export function saveLang(lang: Lang): void {
  localStorage.setItem(KEYS.LANG, lang)
}

export function loadLang(): Lang {
  const saved = localStorage.getItem(KEYS.LANG)
  if (saved === 'it' || saved === 'en') return saved
  return navigator.language.startsWith('it') ? 'it' : 'en'
}

// ─── Theme ────────────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark'

export function saveTheme(theme: Theme): void {
  localStorage.setItem(KEYS.THEME, theme)
}

export function loadTheme(): Theme {
  const saved = localStorage.getItem(KEYS.THEME)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
