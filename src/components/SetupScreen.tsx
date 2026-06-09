import { useState } from 'react'
import { useI18n } from '../i18n'
import type { NormalizedExam, QuizConfig, QuizMode } from '../types'
import styles from './SetupScreen.module.css'

interface Props {
  exam: NormalizedExam
  onStart: (config: QuizConfig) => void
  onBack: () => void
}

export function SetupScreen({ exam, onStart, onBack }: Props) {
  const { t } = useI18n()

  const [mode, setMode] = useState<QuizMode>('practice')
  const [totalQuestions, setTotalQuestions] = useState(Math.min(20, exam.questions.length))
  const [selectedTopics, setSelectedTopics] = useState<number[]>([])
  const [shuffleQuestions, setShuffleQuestions] = useState(true)
  const [shuffleOptions, setShuffleOptions] = useState(true)

  const hasMultipleTopics = exam.topics.length > 1

  const filteredCount = selectedTopics.length === 0
    ? exam.questions.length
    : exam.questions.filter(q => selectedTopics.includes(q.topic)).length

  const clampedTotal = Math.min(totalQuestions, filteredCount)

  function toggleTopic(topic: number) {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    )
  }

  function handleStart() {
    onStart({
      mode,
      totalQuestions: Math.min(clampedTotal, filteredCount),
      selectedTopics,
      shuffleQuestions,
      shuffleOptions,
    })
  }

  return (
    <div className={styles.root}>
      <div className="container container--narrow">
        {/* Exam header */}
        <div className={`${styles.examHeader} animate-fade-up`}>
          <button className={`btn btn--ghost btn--sm ${styles.backBtn}`} onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            {t.setup_back}
          </button>
          <div className={styles.examMeta}>
            <h1 className={styles.examName}>{exam.name}</h1>
            <span className={styles.examTotal}>{exam.questions.length} {t.setup_available}</span>
          </div>
        </div>

        {/* Setup card */}
        <div className={`${styles.setupCard} card animate-fade-up`} style={{ animationDelay: '60ms' }}>
          <h2 className={styles.setupTitle}>{t.setup_title}</h2>

          {/* Mode selection */}
          <section className={styles.section}>
            <label className={styles.sectionLabel}>{t.setup_mode_label}</label>
            <div className={styles.modeGrid}>
              {(['practice', 'exam'] as QuizMode[]).map(m => (
                <button
                  key={m}
                  className={`${styles.modeCard} ${mode === m ? styles.modeCardActive : ''}`}
                  onClick={() => setMode(m)}
                >
                  <div className={styles.modeIcon}>
                    {m === 'practice' ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                      </svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className={styles.modeName}>
                      {m === 'practice' ? t.setup_mode_practice : t.setup_mode_exam}
                    </div>
                    <div className={styles.modeDesc}>
                      {m === 'practice' ? t.setup_mode_practice_desc : t.setup_mode_exam_desc}
                    </div>
                  </div>
                  {mode === m && (
                    <span className={styles.modeCheck}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Topic filter (only if multiple topics) */}
          {hasMultipleTopics && (
            <section className={styles.section}>
              <label className={styles.sectionLabel}>{t.setup_topics_label}</label>
              <div className={styles.topicGrid}>
                <button
                  className={`${styles.topicBtn} ${selectedTopics.length === 0 ? styles.topicBtnActive : ''}`}
                  onClick={() => setSelectedTopics([])}
                >
                  {t.setup_topics_all}
                </button>
                {exam.topics.map(topic => (
                  <button
                    key={topic}
                    className={`${styles.topicBtn} ${selectedTopics.includes(topic) ? styles.topicBtnActive : ''}`}
                    onClick={() => toggleTopic(topic)}
                  >
                    {t.setup_topic_n} {topic}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Questions count */}
          <section className={styles.section}>
            <div className={styles.sliderHeader}>
              <label className={styles.sectionLabel} htmlFor="q-count">{t.setup_questions_label}</label>
              <span className={styles.sliderValue}>
                {Math.min(totalQuestions, filteredCount)}
                <span className={styles.sliderMax}> / {filteredCount}</span>
              </span>
            </div>
            <input
              id="q-count"
              type="range"
              min={1}
              max={filteredCount}
              value={Math.min(totalQuestions, filteredCount)}
              onChange={e => setTotalQuestions(Number(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.sliderTicks}>
              <span>1</span>
              <span>{Math.floor(filteredCount / 2)}</span>
              <span>{filteredCount}</span>
            </div>
          </section>

          {/* Shuffle toggles */}
          <section className={styles.section}>
            <span className={styles.sectionLabel}>{t.setup_shuffle_section}</span>
            <label className={styles.toggleRow}>
              <span className={styles.toggleLabel}>{t.setup_shuffle_questions}</span>
              <button
                role="switch"
                aria-checked={shuffleQuestions}
                className={`${styles.toggle} ${shuffleQuestions ? styles.toggleOn : ''}`}
                onClick={() => setShuffleQuestions(!shuffleQuestions)}
              >
                <span className={styles.toggleThumb} />
              </button>
            </label>
            <label className={styles.toggleRow}>
              <span className={styles.toggleLabel}>{t.setup_shuffle_options}</span>
              <button
                role="switch"
                aria-checked={shuffleOptions}
                className={`${styles.toggle} ${shuffleOptions ? styles.toggleOn : ''}`}
                onClick={() => setShuffleOptions(!shuffleOptions)}
              >
                <span className={styles.toggleThumb} />
              </button>
            </label>
          </section>

          {/* Start button */}
          <button
            className="btn btn--primary btn--lg"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleStart}
          >
            {t.setup_start}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
