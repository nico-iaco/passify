import { useState } from 'react'
import { useI18n } from '../i18n'
import { isCorrect } from '../lib/grade'
import type { QuizSession } from '../types'
import { ProgressBar } from './ProgressBar'
import { QuestionCard } from './QuestionCard'
import styles from './QuizScreen.module.css'

interface Props {
  session: QuizSession
  onSelectAnswer: (questionId: number, option: string, isMulti: boolean) => void
  onConfirmAnswer: (questionId: number) => void
  onNavigate: (delta: 1 | -1) => void
  onFinish: () => void
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

  const { questions, currentIndex, answers, confirmed, config } = session
  const question = questions[currentIndex]
  const selected = answers[question.id] ?? []
  const isConfirmed = !!confirmed[question.id]
  const isPractice = config.mode === 'practice'
  const isLast = currentIndex === questions.length - 1

  // Can go next in practice: must have confirmed OR in exam mode must have answered
  // In exam mode: can finish only when on last question
  const canFinish = isLast && !isPractice

  // In practice mode: can navigate to next after confirming
  const canPracticeNext = isPractice && isConfirmed

  // Answered count for exam mode progress dot summary
  const answeredCount = Object.keys(answers).length

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
        <div className="container">
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
            onSelect={(key) => onSelectAnswer(question.id, key, question.isMulti)}
            onConfirm={() => onConfirmAnswer(question.id)}
          />

          {/* Navigation */}
          <div className={styles.nav}>
            <button
              className="btn btn--ghost"
              onClick={() => onNavigate(-1)}
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
              <button className="btn btn--primary" onClick={onFinish}>
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
                    onFinish()
                  } else {
                    onNavigate(1)
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
