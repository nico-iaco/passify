import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { isCorrect } from '../lib/grade'
import type { QuizSession } from '../types'
import { ExamTimer } from './ExamTimer'
import { ProgressBar } from './ProgressBar'
import { QuestionCard } from './QuestionCard'
import styles from './QuizScreen.module.css'

interface Props {
  session: QuizSession
  onSelectAnswer: (questionId: number, option: string, isMulti: boolean) => void
  onConfirmAnswer: (questionId: number, elapsedMs: number) => void
  onNavigate: (delta: 1 | -1, questionId: number, elapsedMs: number) => void
  onFinish: (questionId: number, elapsedMs: number) => void
  onExit: () => void
}

export function QuizScreen({
  session,
  onSelectAnswer,
  onConfirmAnswer,
  onNavigate,
  onFinish,
  onExit,
}: Props) {
  const { t } = useI18n()
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  const { questions, currentIndex, answers, confirmed, config, questionTimeMs } = session
  const question = questions[currentIndex]
  const selected = answers[question.id] ?? []
  const isConfirmed = !!confirmed[question.id]
  const isPractice = config.mode === 'practice'
  const isLast = currentIndex === questions.length - 1

  const canFinish = isLast && !isPractice
  const canPracticeNext = isPractice && isConfirmed
  const answeredCount = Object.keys(answers).length

  // Silent per-question timer (pauses when tab is hidden; revealed only after Confirm)
  const timingRef = useRef<{
    questionId: number
    startedAt: number | null
    accumulatedMs: number
  }>({ questionId: question.id, startedAt: null, accumulatedMs: 0 })

  useEffect(() => {
    if (isPractice && isConfirmed) {
      timingRef.current = { questionId: question.id, startedAt: null, accumulatedMs: 0 }
      return
    }

    timingRef.current = {
      questionId: question.id,
      startedAt: document.hidden ? null : Date.now(),
      accumulatedMs: 0,
    }

    function handleVisibility() {
      const cur = timingRef.current
      if (cur.questionId !== question.id) return
      if (document.hidden) {
        if (cur.startedAt !== null) {
          cur.accumulatedMs += Math.max(0, Date.now() - cur.startedAt)
          cur.startedAt = null
        }
      } else if (cur.startedAt === null) {
        cur.startedAt = Date.now()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [question.id, isConfirmed, isPractice])

  const consumeElapsedMs = useCallback((): number => {
    const cur = timingRef.current
    if (cur.questionId !== question.id) return 0
    const running = cur.startedAt !== null ? Math.max(0, Date.now() - cur.startedAt) : 0
    const total = cur.accumulatedMs + running
    cur.accumulatedMs = 0
    cur.startedAt = null
    return total
  }, [question.id])

  const handleConfirm = useCallback(() => {
    const elapsed = consumeElapsedMs()
    onConfirmAnswer(question.id, elapsed)
  }, [consumeElapsedMs, onConfirmAnswer, question.id])

  const handleNavigate = useCallback((delta: 1 | -1) => {
    const elapsed = (isPractice && isConfirmed) ? 0 : consumeElapsedMs()
    onNavigate(delta, question.id, elapsed)
  }, [consumeElapsedMs, isConfirmed, isPractice, onNavigate, question.id])

  const handleFinish = useCallback(() => {
    const elapsed = (isPractice && isConfirmed) ? 0 : consumeElapsedMs()
    onFinish(question.id, elapsed)
  }, [consumeElapsedMs, isConfirmed, isPractice, onFinish, question.id])

  return (
    <div className={styles.root}>
      {/* Sticky header */}
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <div className={styles.examInfo}>
              <span className={styles.examName}>{session.exam.name}</span>
              <span className={styles.modeBadge}>
                {isPractice ? t.setup_mode_practice : t.setup_mode_exam}
              </span>
            </div>
            <ProgressBar current={currentIndex + 1} total={questions.length} />
            <button
              className={`btn btn--ghost btn--sm ${styles.exitBtn}`}
              onClick={() => setShowExitConfirm(true)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              {t.quiz_exit}
            </button>
          </div>
        </div>
      </header>

      {/* Question */}
      <main className={styles.main}>
        <div className={`container ${session.expiresAt ? 'container--wide' : ''}`}>
          <div className={session.expiresAt ? styles.layout : undefined}>
            <div className={styles.content}>
              <div className={styles.questionMeta}>
                <span className={styles.questionNumber}>
                  {t.quiz_question} {currentIndex + 1} {t.quiz_of} {questions.length}
                </span>
                {!isPractice && (
                  <span className={styles.answeredCount}>
                    {answeredCount}/{questions.length}
                  </span>
                )}
              </div>

              <QuestionCard
                key={question.id}
                question={question}
                selected={selected}
                confirmed={isConfirmed}
                isPractice={isPractice}
                timeMs={questionTimeMs?.[question.id]}
                onSelect={(key) => onSelectAnswer(question.id, key, question.isMulti)}
                onConfirm={handleConfirm}
              />

              {/* Navigation */}
              <div className={styles.nav}>
                <button
                  className="btn btn--ghost"
                  onClick={() => handleNavigate(-1)}
                  disabled={currentIndex === 0}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  {t.quiz_prev}
                </button>

                <div className={styles.navDots}>
                  {questions.slice(Math.max(0, currentIndex - 2), Math.min(questions.length, currentIndex + 3)).map((q, i) => {
                    const realIdx = Math.max(0, currentIndex - 2) + i
                    const isCurrent = realIdx === currentIndex
                    const hasAnswer = !!answers[q.id]
                    const wasCorrect = isPractice && confirmed[q.id] && isCorrect(q, answers[q.id] ?? [])
                    const wasWrong = isPractice && confirmed[q.id] && !isCorrect(q, answers[q.id] ?? [])
                    return (
                      <span
                        key={q.id}
                        className={`${styles.dot}
                          ${isCurrent ? styles.dotCurrent : ''}
                          ${!isCurrent && hasAnswer && !confirmed[q.id] ? styles.dotAnswered : ''}
                          ${wasCorrect ? styles.dotCorrect : ''}
                          ${wasWrong ? styles.dotWrong : ''}
                        `}
                      />
                    )
                  })}
                </div>

                {canFinish ? (
                  <button className="btn btn--primary" onClick={handleFinish}>
                    {t.quiz_finish}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                ) : (
                  <button
                    className="btn btn--primary"
                    onClick={() => {
                      if (isPractice && isLast && isConfirmed) {
                        handleFinish()
                      } else {
                        handleNavigate(1)
                      }
                    }}
                    disabled={isPractice ? !canPracticeNext : isLast}
                  >
                    {isPractice && isLast && isConfirmed ? t.quiz_finish : t.quiz_next}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {session.expiresAt && (
              <aside className={styles.sidebar}>
                <ExamTimer expiresAt={session.expiresAt} onExpire={handleFinish} />
              </aside>
            )}
          </div>
        </div>
      </main>

      {/* Exit confirmation dialog */}
      {showExitConfirm && (
        <div className={styles.overlay} onClick={() => setShowExitConfirm(false)}>
          <div className={`${styles.dialog} card animate-fade-up`} onClick={e => e.stopPropagation()}>
            <p className={styles.dialogText}>{t.quiz_exit_confirm}</p>
            <div className={styles.dialogActions}>
              <button className="btn btn--ghost" onClick={() => setShowExitConfirm(false)}>
                Annulla
              </button>
              <button className="btn btn--danger" onClick={onExit}>
                {t.quiz_exit}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
