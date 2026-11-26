import { useMemo, useState } from 'react'
import { useI18n } from '../i18n'
import type { NormalizedExam, QuestionRange, QuizConfig, QuizMode } from '../types'
import styles from './SetupScreen.module.css'

interface Props {
  exam: NormalizedExam
  lastRange: QuestionRange | null
  onStart: (config: QuizConfig) => void
  onBack: () => void
}

export function SetupScreen({ exam, lastRange, onStart, onBack }: Props) {
  const { t } = useI18n()

  const [mode, setMode] = useState<QuizMode>('practice')
  const [totalQuestions, setTotalQuestions] = useState(Math.min(20, exam.questions.length))
  const [selectedTopics, setSelectedTopics] = useState<number[]>([])
  const [useRange, setUseRange] = useState(false)
  const [fromInput, setFromInput] = useState('1')
  const [toInput, setToInput] = useState(String(Math.min(50, exam.questions.length)))
  const [shuffleQuestions, setShuffleQuestions] = useState(true)
  const [shuffleOptions, setShuffleOptions] = useState(true)
  const [timerEnabled, setTimerEnabled] = useState(exam.examDuration !== null)
  const [timerMinutes, setTimerMinutes] = useState(exam.examDuration ?? 30)

  const hasMultipleTopics = exam.topics.length > 1

  const filteredCount = selectedTopics.length === 0
    ? exam.questions.length
    : exam.questions.filter(q => selectedTopics.includes(q.topic)).length

  const clampedTotal = Math.min(totalQuestions, filteredCount)

  const parsedFrom = Number.parseInt(fromInput, 10)
  const effectiveFrom = Number.isFinite(parsedFrom)
    ? Math.max(1, Math.min(parsedFrom, filteredCount))
    : 1
  const parsedTo = Number.parseInt(toInput, 10)
  const effectiveTo = Number.isFinite(parsedTo)
    ? Math.max(effectiveFrom, Math.min(parsedTo, filteredCount))
    : Math.max(effectiveFrom, Math.min(50, filteredCount))
  const rangeCount = effectiveTo - effectiveFrom + 1

  const nextRangeSuggestion = useMemo(() => {
    if (!lastRange) return null
    const nextFrom = lastRange.to + 1
    if (nextFrom > filteredCount) return null
    const blockSize = Math.max(1, lastRange.to - lastRange.from + 1)
    const nextTo = Math.min(filteredCount, nextFrom + blockSize - 1)
    return { from: nextFrom, to: nextTo }
  }, [lastRange, filteredCount])

  function toggleTopic(topic: number) {
    setSelectedTopics(prev => {
      const next = prev.includes(topic) ? prev.filter(item => item !== topic) : [...prev, topic]
      const nextCount = next.length === 0
        ? exam.questions.length
        : exam.questions.filter(q => next.includes(q.topic)).length
      if (Number.parseInt(fromInput, 10) > nextCount) setFromInput(String(Math.max(1, nextCount)))
      if (Number.parseInt(toInput, 10) > nextCount) setToInput(String(Math.max(1, nextCount)))
      return next
    })
  }

  function commitFromBlur() {
    setFromInput(String(effectiveFrom))
    if (!Number.isFinite(parsedTo) || parsedTo < effectiveFrom) {
      setToInput(String(effectiveFrom))
    }
  }

  function commitToBlur() {
    setToInput(String(effectiveTo))
  }

  function applyNextSuggestion() {
    if (!nextRangeSuggestion) return
    setUseRange(true)
    setFromInput(String(nextRangeSuggestion.from))
    setToInput(String(nextRangeSuggestion.to))
  }

  function handleStart() {
    const activeRange = useRange ? { from: effectiveFrom, to: effectiveTo } : null
    onStart({
      mode,
      questionRange: activeRange,
      totalQuestions: activeRange ? rangeCount : Math.min(clampedTotal, filteredCount),
      selectedTopics,
      shuffleQuestions,
      shuffleOptions,
      timerMinutes: mode === 'exam' && timerEnabled ? timerMinutes : null,
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

          {/* Questions count or range */}
          <section className={styles.section}>
            <div className={styles.sliderHeader}>
              <label className={styles.sectionLabel} htmlFor={useRange ? 'range-from' : 'q-count'}>
                {t.setup_questions_label}
              </label>
              <div className={styles.segmented} role="tablist" aria-label={t.setup_questions_label}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={!useRange}
                  className={`${styles.segmentedBtn} ${!useRange ? styles.segmentedBtnActive : ''}`}
                  onClick={() => setUseRange(false)}
                >
                  {t.setup_questions_mode_count}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={useRange}
                  className={`${styles.segmentedBtn} ${useRange ? styles.segmentedBtnActive : ''}`}
                  onClick={() => setUseRange(true)}
                >
                  {t.setup_questions_mode_range}
                </button>
              </div>
            </div>

            {useRange ? (
              <div className={styles.rangeBox}>
                <div className={styles.rangeInputs}>
                  <label className={styles.rangeField}>
                    <span className={styles.rangeLabel}>{t.setup_range_from}</span>
                    <input
                      id="range-from"
                      type="number"
                      min={1}
                      max={filteredCount}
                      value={fromInput}
                      onChange={e => setFromInput(e.target.value)}
                      onBlur={commitFromBlur}
                      className={styles.rangeInput}
                    />
                  </label>
                  <span className={styles.rangeSep}>–</span>
                  <label className={styles.rangeField}>
                    <span className={styles.rangeLabel}>{t.setup_range_to}</span>
                    <input
                      id="range-to"
                      type="number"
                      min={effectiveFrom}
                      max={filteredCount}
                      value={toInput}
                      onChange={e => setToInput(e.target.value)}
                      onBlur={commitToBlur}
                      className={styles.rangeInput}
                    />
                  </label>
                  <div className={styles.rangeCountPill}>
                    <strong>{rangeCount}</strong> {t.setup_range_summary}
                  </div>
                </div>
                <p className={styles.rangeHint}>
                  {shuffleQuestions ? t.setup_range_shuffle_hint : t.setup_range_order_hint}
                  {' '}({effectiveFrom}–{effectiveTo} / {filteredCount})
                </p>
              </div>
            ) : (
              <>
                <div className={styles.sliderValueRow}>
                  <span className={styles.sliderValue}>
                    {clampedTotal}
                    <span className={styles.sliderMax}> / {filteredCount}</span>
                  </span>
                </div>
                <input
                  id="q-count"
                  type="range"
                  min={1}
                  max={filteredCount}
                  value={clampedTotal}
                  onChange={e => setTotalQuestions(Number(e.target.value))}
                  className={styles.slider}
                />
                <div className={styles.sliderTicks}>
                  <span>1</span>
                  <span>{Math.floor(filteredCount / 2)}</span>
                  <span>{filteredCount}</span>
                </div>
              </>
            )}

            {nextRangeSuggestion && (
              <button
                type="button"
                className={styles.nextBlockBtn}
                onClick={applyNextSuggestion}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="13 17 18 12 13 7"/>
                  <polyline points="6 17 11 12 6 7"/>
                </svg>
                {t.setup_range_next_block} {nextRangeSuggestion.from}–{nextRangeSuggestion.to}
              </button>
            )}
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

          {/* Timer (exam mode only) */}
          {mode === 'exam' && (
            <section className={styles.section}>
              <label className={styles.toggleRow}>
                <span className={styles.toggleLabel}>{t.setup_timer_label}</span>
                <button
                  role="switch"
                  aria-checked={timerEnabled}
                  className={`${styles.toggle} ${timerEnabled ? styles.toggleOn : ''}`}
                  onClick={() => setTimerEnabled(!timerEnabled)}
                >
                  <span className={styles.toggleThumb} />
                </button>
              </label>
              {timerEnabled && (
                <div className={styles.sliderHeader}>
                  <label className={styles.toggleLabel} htmlFor="timer-minutes">
                    {t.setup_timer_minutes_label}
                  </label>
                  <input
                    id="timer-minutes"
                    type="number"
                    min={1}
                    max={600}
                    value={timerMinutes}
                    onChange={e => setTimerMinutes(Math.max(1, Number(e.target.value) || 1))}
                    className={styles.timerInput}
                  />
                </div>
              )}
            </section>
          )}

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
