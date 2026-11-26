import type { AnalyticsStore, QuizSession } from '../types'
import { DEFAULT_MODEL } from './gemini'

const KEYS = {
  SESSION: 'qf_session',
  LANG: 'qf_lang',
  THEME: 'qf_theme',
  API_KEY: 'qf_api_key',
  AI_MODEL: 'qf_ai_model',
  ANALYTICS: 'qf_analytics',
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
    const parsed = JSON.parse(raw) as Partial<QuizSession>
    if (!parsed || !parsed.exam || !Array.isArray(parsed.questions)) return null
    return {
      ...parsed,
      id: parsed.id ?? `${parsed.startedAt ?? Date.now()}`,
      config: {
        ...parsed.config!,
        source: parsed.config?.source ?? 'all',
      },
    } as QuizSession
  } catch {
    return null
  }
}

export function clearSession(): void {
  localStorage.removeItem(KEYS.SESSION)
}

// ─── Analytics / History ─────────────────────────────────────────────────────

export function loadAnalytics(): AnalyticsStore {
  try {
    const raw = localStorage.getItem(KEYS.ANALYTICS)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {}
    return parsed as AnalyticsStore
  } catch {
    return {}
  }
}

export function saveAnalytics(store: AnalyticsStore): void {
  try {
    localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(store))
  } catch {
    try {
      const pruned: AnalyticsStore = {}
      for (const [key, data] of Object.entries(store)) {
        pruned[key] = {
          ...data,
          sessions: data.sessions.slice(-25),
        }
      }
      localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(pruned))
    } catch {
      // ignore if still unavailable
    }
  }
}

export function clearAnalytics(): void {
  localStorage.removeItem(KEYS.ANALYTICS)
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
