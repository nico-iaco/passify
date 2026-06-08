import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { it } from './it'
import { en } from './en'
import type { Strings } from './it'
import { loadLang, saveLang } from '../lib/storage'
import type { Lang } from '../lib/storage'

const dictionaries: Record<Lang, Strings> = { it, en }

interface I18nContextValue {
  lang: Lang
  t: Strings
  setLang: (lang: Lang) => void
  toggleLang: () => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(loadLang)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    saveLang(l)
  }, [])

  const toggleLang = useCallback(() => {
    setLang(lang === 'it' ? 'en' : 'it')
  }, [lang, setLang])

  return (
    <I18nContext.Provider value={{ lang, t: dictionaries[lang], setLang, toggleLang }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
