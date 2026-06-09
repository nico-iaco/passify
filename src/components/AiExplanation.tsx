import { useState } from 'react'
import { marked } from 'marked'
import { useI18n } from '../i18n'
import { explainQuestion, GeminiError } from '../lib/gemini'
import { loadApiKey, loadAiModel } from '../lib/storage'
import type { NormalizedQuestion } from '../types'
import styles from './AiExplanation.module.css'

marked.setOptions({ breaks: true })

interface Props {
  question: NormalizedQuestion
}

type State = 'idle' | 'loading' | 'done' | 'error' | 'no_key'

export function AiExplanation({ question }: Props) {
  const { t, lang } = useI18n()
  const [state, setState] = useState<State>('idle')
  const [explanation, setExplanation] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleExplain() {
    const apiKey = loadApiKey()
    if (!apiKey) {
      setState('no_key')
      return
    }

    setState('loading')
    setExplanation('')
    setErrorMsg('')

    try {
      const text = await explainQuestion({
        question,
        lang,
        apiKey,
        model: loadAiModel(),
      })
      setExplanation(text)
      setState('done')
    } catch (err) {
      let msg = t.ai_error_generic
      if (err instanceof GeminiError) {
        if (err.code === 'auth') msg = t.ai_error_auth
        else if (err.code === 'model') msg = t.ai_error_model
        else if (err.code === 'rate_limit') msg = t.ai_error_rate
        else if (err.code === 'network') msg = t.ai_error_network
      }
      setErrorMsg(msg)
      setState('error')
    }
  }

  function handleReset() {
    setState('idle')
    setExplanation('')
    setErrorMsg('')
  }

  if (state === 'idle') {
    return (
      <button className={`btn btn--ghost btn--sm ${styles.explainBtn}`} onClick={handleExplain}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {t.ai_explain_btn}
      </button>
    )
  }

  if (state === 'no_key') {
    return (
      <p className={styles.noKey}>{t.ai_no_key}</p>
    )
  }

  if (state === 'loading') {
    return (
      <div className={styles.loadingRow}>
        <span className="spinner" />
        <span className={styles.loadingText}>{t.ai_explaining}</span>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className={styles.errorRow}>
        <span className={styles.errorText}>{errorMsg}</span>
        <button className={`btn btn--ghost btn--sm ${styles.retryBtn}`} onClick={handleReset}>↩</button>
      </div>
    )
  }

  // done
  return (
    <div className={styles.explanationBox}>
      <div className={styles.explanationHeader}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
        <span className={styles.explanationLabel}>AI</span>
        <button
          className={`btn btn--ghost btn--icon ${styles.closeExplanation}`}
          onClick={handleReset}
          aria-label="Chiudi spiegazione"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div
        className={styles.explanationText}
        dangerouslySetInnerHTML={{ __html: marked.parse(explanation) as string }}
      />
    </div>
  )
}
