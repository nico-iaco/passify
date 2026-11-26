import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { copyToClipboard, formatQuestionForCopy } from '../lib/clipboard'
import type { NormalizedQuestion } from '../types'
import styles from './CopyButton.module.css'

interface Props {
  question: NormalizedQuestion
}

export function CopyButton({ question }: Props) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [])

  async function handleCopy() {
    const ok = await copyToClipboard(formatQuestionForCopy(question))
    if (!ok) return
    setCopied(true)
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      className={`btn btn--ghost btn--sm ${styles.copyBtn} ${copied ? styles.copied : ''}`}
      onClick={handleCopy}
      aria-label={copied ? t.quiz_copied : t.quiz_copy_btn}
      title={copied ? t.quiz_copied : t.quiz_copy_btn}
    >
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {t.quiz_copied}
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          {t.quiz_copy_btn}
        </>
      )}
    </button>
  )
}
