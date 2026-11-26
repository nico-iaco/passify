import type { QuizSession } from '../types'
import { DEFAULT_MODEL } from './gemini'

const KEYS = {
  SESSION: 'qf_session',
  LANG: 'qf_lang',
  THEME: 'qf_theme',
  API_KEY: 'qf_api_key',
  AI_MODEL: 'qf_ai_model',
  LAST_WRONG: 'qf_last_wrong',
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
    const parsed = JSON.parse(raw) as QuizSession
    if (!parsed || !parsed.config) return null
    return {
      ...parsed,
      config: {
        ...parsed.config,
        source: parsed.config.source ?? 'all',
      },
    }
  } catch {
    return null
  }
}

export function saveLastWrongIds(examName: string, ids: number[]): void {
  try {
    const raw = localStorage.getItem(KEYS.LAST_WRONG)
    const map: Record<string, number[]> = raw ? JSON.parse(raw) : {}
    map[examName.trim().toLowerCase()] = ids
    localStorage.setItem(KEYS.LAST_WRONG, JSON.stringify(map))
  } catch {
    // ignore storage errors
  }
}

export function loadLastWrongIds(examName: string): number[] {
  try {
    const raw = localStorage.getItem(KEYS.LAST_WRONG)
    if (!raw) return []
    const map = JSON.parse(raw) as Record<string, number[]>
    const ids = map[examName.trim().toLowerCase()]
    return Array.isArray(ids) ? ids : []
  } catch {
    return []
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

// ─── AI API key ───────────────────────────────────────────────────────────────

export function saveApiKey(key: string): void {
  localStorage.setItem(KEYS.API_KEY, key)
}

export function loadApiKey(): string {
  return localStorage.getItem(KEYS.API_KEY) ?? ''
}

export function clearApiKey(): void {
  localStorage.removeItem(KEYS.API_KEY)
}

// ─── AI model ─────────────────────────────────────────────────────────────────

export function saveAiModel(model: string): void {
  localStorage.setItem(KEYS.AI_MODEL, model)
}

export function loadAiModel(): string {
  return localStorage.getItem(KEYS.AI_MODEL) ?? DEFAULT_MODEL
}

export function clearAiModel(): void {
  localStorage.removeItem(KEYS.AI_MODEL)
}
