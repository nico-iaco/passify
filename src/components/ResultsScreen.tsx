import { useI18n } from '../i18n'
import { isCorrect } from '../lib/grade'
import type { QuizSession } from '../types'
import styles from './ResultsScreen.module.css'

interface Props {
  session: QuizSession
  onRetry: () => void
  onNewExam: () => void
}

export function ResultsScreen({ session, onRetry, onNewExam }: Props) {
  const { t } = useI18n()
  const { questions, answers, config } = session
  const isPractice = config.mode === 'practice'

  const correct = questions.filter(q => isCorrect(q, answers[q.id] ?? [])).length
  const total = questions.length
  const wrong = total - correct
  const score = total > 0 ? correct / total : 0
  const pct = Math.round(score * 100)
  const passed = pct >= 70

  const wrongQuestions = questions.filter(q => !isCorrect(q, answers[q.id] ?? []))

  return (
    <div className={styles.root}>
      <div className="container">
        {/* Score card */}
        <div className={`${styles.scoreCard} card animate-fade-up`}>
          <div className={styles.scoreCircleWrap}>
            <div className={`${styles.scoreCircle} ${passed ? styles.scorePassed : styles.scoreFailed}`}>
              <span className={styles.scorePct}>{pct}%</span>
              <span className={styles.scoreLabel}>
                {passed ? t.results_passed : t.results_failed}
              </span>
            </div>
          </div>

          <div className={styles.examResultName}>{session.exam.name}</div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={`${styles.statNum} ${styles.statCorrect}`}>{correct}</span>
              <span className={styles.statLabel}>{t.results_correct}</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={`${styles.statNum} ${styles.statWrong}`}>{wrong}</span>
              <span className={styles.statLabel}>{t.results_wrong}</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>{total}</span>
              <span className={styles.statLabel}>{t.results_total}</span>
            </div>
          </div>

          <div className={styles.scoreBar}>
            <div
              className={`${styles.scoreBarFill} ${passed ? styles.scoreBarPassed : styles.scoreBarFailed}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className={styles.actions}>
            <button className="btn btn--outline" onClick={onRetry}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 .49-3.67"/>
              </svg>
              {t.results_retry}
            </button>
            <button className="btn btn--primary" onClick={onNewExam}>
              {t.results_new_exam}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Error review */}
        <div className={`${styles.reviewSection} animate-fade-up`} style={{ animationDelay: '100ms' }}>
          <h2 className={styles.reviewTitle}>
            {t.results_review_title}
            {wrongQuestions.length > 0 && (
              <span className="badge badge--wrong" style={{ marginLeft: 12 }}>
                {wrongQuestions.length}
              </span>
            )}
          </h2>

          {wrongQuestions.length === 0 ? (
            <div className={`${styles.noErrors} card`}>
              <span className={styles.noErrorsIcon}>🎉</span>
              <p>{t.results_no_errors}</p>
            </div>
          ) : (
            <div className={styles.errorList}>
              {wrongQuestions.map((q, idx) => {
                const userAnswer = answers[q.id] ?? []
                return (
                  <div key={q.id} className={`${styles.errorItem} card animate-fade-up`} style={{ animationDelay: `${120 + idx * 30}ms` }}>
                    <div className={styles.errorHeader}>
                      <span className="badge badge--topic">Topic {q.topic}</span>
                      <span className={styles.errorNum}>#{idx + 1}</span>
                    </div>
                    <p className={styles.errorQuestion}>{q.question}</p>

                    {/* Images */}
                    {q.imageUrls.length > 0 && (
                      <div className={styles.errorImages}>
                        {q.imageUrls.map((url, i) => (
                          <img key={i} src={url} alt={`Diagram ${i + 1}`} className={styles.errorImage} loading="lazy" />
                        ))}
                      </div>
                    )}

                    <div className={styles.answerComparison}>
                      <div className={`${styles.answerBox} ${styles.answerWrong}`}>
                        <span className={styles.answerBoxLabel}>{t.results_your_answer}</span>
                        <div className={styles.answerOptions}>
                          {userAnswer.length === 0 ? (
                            <span className={styles.noAnswer}>—</span>
                          ) : (
                            userAnswer.map(key => (
                              <span key={key} className={styles.answerChip}>
                                <span className={styles.answerKey}>{key}</span>
                                {q.options[key]}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                      <div className={`${styles.answerBox} ${styles.answerCorrect}`}>
                        <span className={styles.answerBoxLabel}>{t.results_correct_answer}</span>
                        <div className={styles.answerOptions}>
                          {q.answers.map(key => (
                            <span key={key} className={styles.answerChip}>
                              <span className={styles.answerKey}>{key}</span>
                              {q.options[key]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {isPractice === false && (
                      <a
                        href={q.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn btn--ghost btn--sm ${styles.discussionLink}`}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        {t.results_explanation}
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
