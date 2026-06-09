import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { clearApiKey, clearAiModel, loadApiKey, loadAiModel, saveApiKey, saveAiModel } from '../lib/storage'
import { DEFAULT_MODEL } from '../lib/gemini'
import styles from './SettingsModal.module.css'

interface Props {
  open: boolean
  onClose: () => void
}

export function SettingsModal({ open, onClose }: Props) {
  const { t } = useI18n()
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Populate from localStorage when modal opens
  useEffect(() => {
    if (open) {
      setApiKey(loadApiKey())
      setModel(loadAiModel())
      setShowKey(false)
      setSaved(false)
      // Focus input on next tick so animation doesn't fight focus
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const hasExistingKey = loadApiKey().length > 0

  function handleSave() {
    saveApiKey(apiKey.trim())
    saveAiModel(model.trim() || DEFAULT_MODEL)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleClear() {
    clearApiKey()
    clearAiModel()
    setApiKey('')
    setModel(DEFAULT_MODEL)
    setSaved(false)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.dialog} card animate-fade-up`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t.settings_title}
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            {t.settings_title}
          </h2>
          <button className={`btn btn--ghost btn--icon ${styles.closeBtn}`} onClick={onClose} aria-label={t.settings_close}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* API key field */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="settings-api-key">
            {t.settings_api_key_label}
            {hasExistingKey && !saved && (
              <span className={`${styles.savedBadge} badge badge--correct`}>{t.settings_saved}</span>
            )}
            {saved && (
              <span className={`${styles.savedBadge} badge badge--correct`}>{t.settings_saved} ✓</span>
            )}
          </label>
          <div className={styles.inputWrap}>
            <input
              id="settings-api-key"
              ref={inputRef}
              className={styles.input}
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => { setApiKey(e.target.value); setSaved(false) }}
              placeholder={t.settings_api_key_placeholder}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              className={`btn btn--ghost btn--icon ${styles.eyeBtn}`}
              type="button"
              onClick={() => setShowKey(v => !v)}
              aria-label={showKey ? 'Nascondi chiave' : 'Mostra chiave'}
              tabIndex={-1}
            >
              {showKey ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.getKeyLink}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            {t.settings_get_key}
          </a>
        </div>

        {/* Model field */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="settings-model">
            {t.settings_model_label}
          </label>
          <input
            id="settings-model"
            className={styles.input}
            type="text"
            value={model}
            onChange={e => { setModel(e.target.value); setSaved(false) }}
            placeholder={`${t.settings_model_placeholder} (default: ${DEFAULT_MODEL})`}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {hasExistingKey && (
            <button className="btn btn--danger btn--sm" onClick={handleClear}>
              {t.settings_clear}
            </button>
          )}
          <div className={styles.actionsRight}>
            <button className="btn btn--ghost" onClick={onClose}>
              {t.settings_close}
            </button>
            <button className="btn btn--primary" onClick={handleSave} disabled={!apiKey.trim()}>
              {t.settings_save}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
