import { useCallback, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { parseExamFromFile, parseExamFromUrl } from '../lib/parseExam'
import type { NormalizedExam, QuizSession } from '../types'
import styles from './UploadScreen.module.css'

const BASE = import.meta.env.BASE_URL

const SAMPLES = [
  {
    file: `${BASE}samples/google-cloudDeveloper.json`,
    label: 'Professional Cloud Developer',
    count: 288,
    icon: '☁️',
  },
  {
    file: `${BASE}samples/google-devops.json`,
    label: 'Professional Cloud DevOps Engineer',
    count: 203,
    icon: '⚙️',
  },
]

interface Props {
  savedSession: QuizSession | null
  onExamLoaded: (exam: NormalizedExam) => void
  onResumeSession: (session: QuizSession) => void
  onDiscardSession: () => void
}

export function UploadScreen({ savedSession, onExamLoaded, onResumeSession, onDiscardSession }: Props) {
  const { t } = useI18n()
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.json')) {
      setError('Please select a .json file.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const exam = await parseExamFromFile(file)
      onExamLoaded(exam)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [onExamLoaded])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleSample = useCallback(async (url: string) => {
    setError(null)
    setLoading(true)
    try {
      const exam = await parseExamFromUrl(url)
      onExamLoaded(exam)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [onExamLoaded])

  return (
    <div className={styles.root}>
      <div className="container container--narrow">
        {/* Hero */}
        <div className={`${styles.hero} animate-fade-up`}>
          <div className={styles.logo}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="var(--brand-500)"/>
              <path d="M12 13h12M12 18h8M12 23h10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="26" cy="23" r="4" fill="var(--brand-300)"/>
              <path d="M24.5 23l1 1.5 2-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className={styles.title}>{t.upload_title}</h1>
          <p className={styles.subtitle}>{t.upload_subtitle}</p>
        </div>

        {/* Resume session banner */}
        {savedSession && (
          <div className={`${styles.resumeBanner} card animate-fade-up`} style={{ animationDelay: '60ms' }}>
            <div className={styles.resumeIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 .49-3.67"/>
              </svg>
            </div>
            <div className={styles.resumeInfo}>
              <span className={styles.resumeTitle}>{t.upload_resume_title}</span>
              <span className={styles.resumeMeta}>
                {t.upload_resume_exam} <strong>{savedSession.exam.name}</strong>
                {' · '}
                {t.upload_resume_progress} <strong>{savedSession.currentIndex + 1}/{savedSession.questions.length}</strong>
              </span>
            </div>
            <div className={styles.resumeActions}>
              <button className="btn btn--primary btn--sm" onClick={() => onResumeSession(savedSession)}>
                {t.upload_resume_btn}
              </button>
              <button className="btn btn--ghost btn--sm" onClick={onDiscardSession}>
                {t.upload_resume_discard}
              </button>
            </div>
          </div>
        )}

        {/* Drop zone */}
        <div
          className={`${styles.dropZone} ${dragging ? styles.dragging : ''} ${error ? styles.hasError : ''} animate-fade-up card`}
          style={{ animationDelay: savedSession ? '120ms' : '60ms' }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? inputRef.current?.click() : undefined}
          aria-label="Upload JSON file"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".json,application/json"
            className="sr-only"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          {loading ? (
            <div className={styles.loadingState}>
              <div className="spinner" />
              <span>{t.upload_loading}</span>
            </div>
          ) : (
            <div className={styles.dropContent}>
              <div className={styles.dropIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p className={styles.dropLabel}>{t.upload_drag}</p>
              <span className={styles.dropOr}>{t.upload_or}</span>
              <button
                className="btn btn--outline btn--sm"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
              >
                {t.upload_browse}
              </button>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className={`${styles.errorBox} animate-fade-in`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span><strong>{t.upload_error}:</strong> {error}</span>
          </div>
        )}

        {/* Samples */}
        <div className={`${styles.samples} animate-fade-up`} style={{ animationDelay: '120ms' }}>
          <p className={styles.samplesTitle}>{t.upload_samples_title}</p>
          <div className={styles.sampleGrid}>
            {SAMPLES.map(s => (
              <button
                key={s.file}
                className={`${styles.sampleCard} card`}
                onClick={() => handleSample(s.file)}
                disabled={loading}
              >
                <span className={styles.sampleIcon}>{s.icon}</span>
                <span className={styles.sampleLabel}>{s.label}</span>
                <span className={styles.sampleCount}>{s.count} q</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
