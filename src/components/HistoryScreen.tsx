import { useMemo, useState } from 'react'
import { useI18n } from '../i18n'
import { compareWithPrevious, computeQuestionStats } from '../lib/analytics'
import { formatChartDate, formatDuration, formatShortDate } from '../lib/format'
import { snapshotToQuestion } from '../lib/quiz'
import type {
  AnalyticsStore,
  QuestionSource,
  SessionRecord,
} from '../types'
import { AiExplanation } from './AiExplanation'
import { ComparisonPanel } from './ComparisonPanel'
import styles from './HistoryScreen.module.css'

interface Props {
  analytics: AnalyticsStore
  initialExamKey: string | null
  onBack: () => void
  onStartWrongQuiz: (examName: string, questionIds: number[], source: QuestionSource) => void
  onDeleteSession: (examKey: string, sessionId: string) => void
  onClearExamHistory: (examKey: string) => void
}

type SessionExpandTab = 'errors' | 'common' | 'improved'

export function HistoryScreen({
  analytics,
  initialExamKey,
  onBack,
  onStartWrongQuiz,
  onDeleteSession,
  onClearExamHistory,
}: Props) {
  const { t, lang } = useI18n()

  const examsList = useMemo(
    () => Object.values(analytics).sort((a, b) => b.updatedAt - a.updatedAt),
    [analytics],
  )

  const [selectedKey, setSelectedKey] = useState<string | null>(initialExamKey)
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null)
  const [expandedTab, setExpandedTab] = useState<SessionExpandTab>('errors')
  const [confirmClearKey, setConfirmClearKey] = useState<string | null>(null)
  const [showAllRecurring, setShowAllRecurring] = useState(false)

  const activeExam = useMemo(() => {
    if (examsList.length === 0) return null
    if (selectedKey && analytics[selectedKey]) return analytics[selectedKey]
    return examsList[0]
  }, [examsList, selectedKey, analytics])

  const kpis = useMemo(() => {
    if (!activeExam || activeExam.sessions.length === 0) return null
    const sessions = activeExam.sessions
    const avgScore = Math.round(
      sessions.reduce((acc, s) => acc + s.scorePct, 0) / sessions.length
    )
    const latest = sessions[sessions.length - 1]
    const prev = sessions.length >= 2 ? sessions[sessions.length - 2] : null
    const delta = prev ? latest.scorePct - prev.scorePct : null

    return {
      count: sessions.length,
      avgScore,
      latestScore: latest.scorePct,
      delta,
    }
  }, [activeExam])

  const recurringQuestions = useMemo(() => {
    if (!activeExam) return []
    return computeQuestionStats(activeExam.sessions, activeExam.snapshots)
  }, [activeExam])

  const chartSessions = useMemo(() => {
    if (!activeExam) return []
    return activeExam.sessions.slice(-16)
  }, [activeExam])

  const chronologicalIndexById = useMemo(() => {
    const map = new Map<string, number>()
    activeExam?.sessions.forEach((s, idx) => map.set(s.id, idx))
    return map
  }, [activeExam])

  function toggleSessionExpand(sessionId: string) {
    if (expandedSessionId === sessionId) {
      setExpandedSessionId(null)
    } else {
      setExpandedSessionId(sessionId)
      setExpandedTab('errors')
    }
  }

  return (
    <div className={styles.root}>
      <div className="container">
        {/* Header */}
        <div className={`${styles.topHeader} animate-fade-up`}>
          <button className="btn btn--ghost btn--sm" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            {t.history_back}
          </button>
          <h1 className={styles.pageTitle}>{t.history_title}</h1>
          <p className={styles.pageSubtitle}>{t.history_subtitle}</p>
        </div>

        {examsList.length === 0 || !activeExam ? (
          <div className={`${styles.emptyCard} card animate-fade-up`}>
            <div className={styles.emptyIcon}>📊</div>
            <h2 className={styles.emptyTitle}>{t.history_empty_title}</h2>
            <p className={styles.emptyDesc}>{t.history_empty_desc}</p>
          </div>
        ) : (
          <div className={styles.content}>
            {/* Exam switcher */}
            {examsList.length > 1 && (
              <div className={`${styles.examTabs} animate-fade-up`}>
                {examsList.map(ex => (
                  <button
                    key={ex.examKey}
                    className={`${styles.examTab} ${ex.examKey === activeExam.examKey ? styles.examTabActive : ''}`}
                    onClick={() => {
                      setSelectedKey(ex.examKey)
                      setExpandedSessionId(null)
                      setConfirmClearKey(null)
                      setShowAllRecurring(false)
                    }}
                  >
                    <span>{ex.examName}</span>
                    <span className={styles.examTabCount}>{ex.sessions.length}</span>
                  </button>
                ))}
              </div>
            )}

            {/* KPIs */}
            {kpis && (
              <div className={`${styles.kpiGrid} animate-fade-up`}>
                <div className={`${styles.kpiCard} card`}>
                  <span className={styles.kpiLabel}>{t.history_kpi_sessions}</span>
                  <span className={styles.kpiValue}>{kpis.count}</span>
                </div>
                <div className={`${styles.kpiCard} card`}>
                  <span className={styles.kpiLabel}>{t.history_kpi_avg}</span>
                  <span className={styles.kpiValue}>{kpis.avgScore}%</span>
                </div>
                <div className={`${styles.kpiCard} card`}>
                  <span className={styles.kpiLabel}>{t.history_kpi_last}</span>
                  <div className={styles.kpiRow}>
                    <span className={`${styles.kpiValue} ${kpis.latestScore >= 70 ? styles.kpiPass : styles.kpiFail}`}>
                      {kpis.latestScore}%
                    </span>
                    {kpis.delta !== null && (
                      <span className={`${styles.kpiDelta} ${kpis.delta > 0 ? styles.deltaUp : kpis.delta < 0 ? styles.deltaDown : styles.deltaFlat}`}>
                        {kpis.delta > 0 ? `+${kpis.delta}%` : `${kpis.delta}%`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Score trend chart */}
            {chartSessions.length >= 1 && (
              <section className={`${styles.chartCard} card animate-fade-up`}>
                <div className={styles.sectionHead}>
                  <h2 className={styles.sectionTitle}>{t.history_chart_title}</h2>
                  <span className={styles.passLegend}>{t.history_chart_pass_line}</span>
                </div>
                <ScoreTrendChart sessions={chartSessions} lang={lang} />
              </section>
            )}

            {/* Most frequently missed questions */}
            <section className={`${styles.sectionBlock} animate-fade-up`}>
              <div className={styles.sectionHead}>
                <div>
                  <h2 className={styles.sectionTitle}>
                    {t.history_recurring_title}
                    {recurringQuestions.length > 0 && (
                      <span className="badge badge--wrong" style={{ marginLeft: 10 }}>
                        {recurringQuestions.length}
                      </span>
                    )}
                  </h2>
                  <p className={styles.sectionSub}>{t.history_recurring_subtitle}</p>
                </div>

                {recurringQuestions.length > 0 && (
                  <button
                    className="btn btn--primary btn--sm"
                    onClick={() => onStartWrongQuiz(
                      activeExam.examName,
                      recurringQuestions.slice(0, 30).map(r => r.questionId),
                      'most_wrong',
                    )}
                  >
                    {t.history_practice_recurring} ({Math.min(30, recurringQuestions.length)})
                  </button>
                )}
              </div>

              {recurringQuestions.length === 0 ? (
                <div className={`${styles.emptyInline} card`}>
                  {t.history_recurring_empty}
                </div>
              ) : (
                <div className={styles.recurringList}>
                  {(showAllRecurring ? recurringQuestions : recurringQuestions.slice(0, 8)).map(stat => {
                    const snap = stat.snapshot
                    const errorPct = Math.round(stat.errorRate * 100)
                    const isAlwaysWrong = stat.attempts >= 2 && stat.wrongCount === stat.attempts
                    const isRecurring = stat.wrongCount >= 2
                    const refLabel = stat.position > 0 && stat.position !== stat.questionId
                      ? `#${stat.position} · ID ${stat.questionId}`
                      : `ID #${stat.questionId}`
                    const questionObj = snap ? snapshotToQuestion(snap) : null

                    return (
                      <div key={stat.questionId} className={`${styles.recurringCard} card`}>
                        <div className={styles.recurringHeader}>
                          <div className={styles.recurringBadges}>
                            <span className="badge badge--topic">Topic {stat.topic}</span>
                            <span className={styles.monoRef}>{refLabel}</span>
                            <span className="badge badge--wrong">
                              {t.history_missed_ratio} {stat.wrongCount} {t.history_times_of} {stat.attempts} {t.history_times} ({errorPct}%)
                            </span>
                            {isAlwaysWrong ? (
                              <span className={`badge ${styles.badgeAlways}`}>{t.history_badge_always_wrong}</span>
                            ) : isRecurring ? (
                              <span className={`badge ${styles.badgeRecurring}`}>{t.history_badge_recurring}</span>
                            ) : null}
                          </div>
                        </div>

                        {snap && (
                          <>
                            <p className={styles.questionText}>{snap.question}</p>
                            <div className={styles.correctAnswersRow}>
                              <span className={styles.correctAnswersLabel}>{t.results_correct_answer}</span>
                              <div className={styles.correctChips}>
                                {snap.answers.map(k => (
                                  <span key={k} className={styles.correctChip}>
                                    <span className={styles.keyChip}>{k}</span>
                                    <span>{snap.options[k]}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className={styles.itemFooter}>
                              {snap.url && (
                                <a
                                  href={snap.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn--ghost btn--sm"
                                >
                                  {t.results_explanation} ↗
                                </a>
                              )}
                              {questionObj && <AiExplanation question={questionObj} />}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}

                  {recurringQuestions.length > 8 && (
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => setShowAllRecurring(v => !v)}
                    >
                      {showAllRecurring
                        ? t.history_hide_details
                        : `${t.history_show_details} (${recurringQuestions.length})`}
                    </button>
                  )}
                </div>
              )}
            </section>

            {/* Past sessions timeline */}
            <section className={`${styles.sectionBlock} animate-fade-up`}>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>{t.history_sessions_title}</h2>
                {confirmClearKey === activeExam.examKey ? (
                  <div className={styles.confirmClearRow}>
                    <span className={styles.confirmClearText}>{t.history_clear_confirm}</span>
                    <button
                      className="btn btn--danger btn--sm"
                      onClick={() => {
                        onClearExamHistory(activeExam.examKey)
                        setConfirmClearKey(null)
                      }}
                    >
                      {t.history_confirm_yes}
                    </button>
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => setConfirmClearKey(null)}
                    >
                      {t.quiz_cancel}
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn--danger btn--sm"
                    onClick={() => setConfirmClearKey(activeExam.examKey)}
                  >
                    {t.history_clear_exam}
                  </button>
                )}
              </div>

              <div className={styles.sessionList}>
                {[...activeExam.sessions].reverse().map((s: SessionRecord) => {
                  const cIdx = chronologicalIndexById.get(s.id) ?? 0
                  const prevSession = cIdx > 0 ? activeExam.sessions[cIdx - 1] : null
                  const comparison = prevSession
                    ? compareWithPrevious(s, prevSession, activeExam.snapshots)
                    : null
                  const isExpanded = expandedSessionId === s.id
                  const wrongResults = s.results.filter(r => !r.correct)
                  const passed = s.scorePct >= 70

                  const commonWrongItems = comparison
                    ? comparison.items.filter(i => i.status === 'repeated_error' || i.status === 'regressed')
                    : []
                  const improvedItems = comparison
                    ? comparison.items.filter(i => i.status === 'improved')
                    : []

                  return (
                    <div key={s.id} className={`${styles.sessionCard} card`}>
                      <div className={styles.sessionTop}>
                        <div className={styles.sessionPrimary}>
                          <span className={`badge ${passed ? 'badge--correct' : 'badge--wrong'} ${styles.sessionScore}`}>
                            {s.scorePct}%
                          </span>
                          <div className={styles.sessionMeta}>
                            <div className={styles.sessionTitleRow}>
                              <span className={styles.sessionFraction}>{s.correct}/{s.total}</span>
                              <span className="badge badge--topic">
                                {s.mode === 'practice' ? t.setup_mode_practice : t.setup_mode_exam}
                              </span>
                              {s.source === 'most_wrong' && (
                                <span className={styles.sourceTag}>{t.history_source_most_wrong}</span>
                              )}
                            </div>
                            <span className={styles.sessionDate}>
                              {formatShortDate(s.finishedAt, lang)}
                              {s.durationMs > 0 && ` · ${formatDuration(s.durationMs)}`}
                            </span>
                          </div>
                        </div>

                        <div className={styles.sessionActions}>
                          {(wrongResults.length > 0 || (comparison && comparison.commonCount > 0)) && (
                            <button
                              type="button"
                              className="btn btn--ghost btn--sm"
                              onClick={() => toggleSessionExpand(s.id)}
                            >
                              {isExpanded ? t.history_hide_details : t.history_show_details}
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn--ghost btn--icon"
                            onClick={() => onDeleteSession(activeExam.examKey, s.id)}
                            aria-label={t.history_delete_session}
                            title={t.history_delete_session}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                              <path d="M10 11v6M14 11v6"/>
                            </svg>
                          </button>
                        </div>
                      </div>

                      {comparison && (
                        <ComparisonPanel
                          comparison={comparison}
                          currentScorePct={s.scorePct}
                          title={t.history_compare_vs_prev}
                        />
                      )}

                      {isExpanded && (
                        <div className={styles.expandedArea}>
                          <div className={styles.expandTabs}>
                            <button
                              type="button"
                              className={`${styles.expandTab} ${expandedTab === 'errors' ? styles.expandTabActive : ''}`}
                              onClick={() => setExpandedTab('errors')}
                            >
                              {t.history_tab_all_errors} ({wrongResults.length})
                            </button>
                            {comparison && (
                              <button
                                type="button"
                                className={`${styles.expandTab} ${expandedTab === 'common' ? styles.expandTabActive : ''}`}
                                onClick={() => setExpandedTab('common')}
                              >
                                {t.history_tab_common_wrong} ({commonWrongItems.length})
                              </button>
                            )}
                            {comparison && improvedItems.length > 0 && (
                              <button
                                type="button"
                                className={`${styles.expandTab} ${expandedTab === 'improved' ? styles.expandTabActive : ''}`}
                                onClick={() => setExpandedTab('improved')}
                              >
                                {t.history_tab_improved} ({improvedItems.length})
                              </button>
                            )}
                          </div>

                          {expandedTab === 'errors' && (
                            wrongResults.length === 0 ? (
                              <p className={styles.noErrorsText}>{t.history_no_session_errors}</p>
                            ) : (
                              <div className={styles.detailList}>
                                {wrongResults.map((res, idx) => {
                                  const snap = activeExam.snapshots[res.questionId]
                                  return (
                                    <div key={`${res.questionId}-${idx}`} className={styles.detailItem}>
                                      <div className={styles.detailHeader}>
                                        <span className="badge badge--topic">Topic {res.topic}</span>
                                        <span className={styles.monoRef}>
                                          {res.position > 0 && res.position !== res.questionId
                                            ? `#${res.position} · ID ${res.questionId}`
                                            : `ID #${res.questionId}`}
                                        </span>
                                      </div>
                                      {snap && <p className={styles.detailQuestion}>{snap.question}</p>}
                                      <div className={styles.detailFooter}>
                                        <span>
                                          {t.results_your_answer}{' '}
                                          <strong>{res.selected.length > 0 ? res.selected.join(', ') : '—'}</strong>
                                          {snap && (
                                            <>
                                              {' · '}
                                              {t.results_correct_answer}{' '}
                                              <strong className={styles.correctKey}>{snap.answers.join(', ')}</strong>
                                            </>
                                          )}
                                        </span>
                                        {snap?.url && (
                                          <a href={snap.url} target="_blank" rel="noopener noreferrer">
                                            {t.results_explanation} ↗
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )
                          )}

                          {expandedTab === 'common' && comparison && (
                            commonWrongItems.length === 0 ? (
                              <p className={styles.noErrorsText}>{t.history_no_session_errors}</p>
                            ) : (
                              <div className={styles.detailList}>
                                {commonWrongItems.map(item => (
                                  <div key={item.questionId} className={styles.detailItem}>
                                    <div className={styles.detailHeader}>
                                      <span className="badge badge--topic">Topic {item.topic}</span>
                                      <span className={styles.monoRef}>
                                        {item.position > 0 && item.position !== item.questionId
                                          ? `#${item.position} · ID ${item.questionId}`
                                          : `ID #${item.questionId}`}
                                      </span>
                                      <span className={`badge ${item.status === 'repeated_error' ? 'badge--wrong' : styles.badgeRecurring}`}>
                                        {item.status === 'repeated_error' ? t.history_status_repeated : t.history_status_regressed}
                                      </span>
                                    </div>
                                    {item.snapshot && <p className={styles.detailQuestion}>{item.snapshot.question}</p>}
                                    <div className={styles.detailFooter}>
                                      <span>
                                        {t.results_your_answer}{' '}
                                        <strong>{item.currentResult.selected.length > 0 ? item.currentResult.selected.join(', ') : '—'}</strong>
                                        {item.snapshot && (
                                          <>
                                            {' · '}
                                            {t.results_correct_answer}{' '}
                                            <strong className={styles.correctKey}>{item.snapshot.answers.join(', ')}</strong>
                                          </>
                                        )}
                                      </span>
                                      {item.snapshot?.url && (
                                        <a href={item.snapshot.url} target="_blank" rel="noopener noreferrer">
                                          {t.results_explanation} ↗
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )
                          )}

                          {expandedTab === 'improved' && comparison && (
                            <div className={styles.detailList}>
                              {improvedItems.map(item => (
                                <div key={item.questionId} className={styles.detailItem}>
                                  <div className={styles.detailHeader}>
                                    <span className="badge badge--topic">Topic {item.topic}</span>
                                    <span className={styles.monoRef}>
                                      {item.position > 0 && item.position !== item.questionId
                                        ? `#${item.position} · ID ${item.questionId}`
                                        : `ID #${item.questionId}`}
                                    </span>
                                    <span className="badge badge--correct">{t.history_status_improved}</span>
                                  </div>
                                  {item.snapshot && <p className={styles.detailQuestion}>{item.snapshot.question}</p>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

function ScoreTrendChart({ sessions, lang }: { sessions: SessionRecord[]; lang: 'it' | 'en' }) {
  const width = 640
  const height = 190
  const padLeft = 36
  const padRight = 24
  const padTop = 24
  const padBottom = 30
  const innerW = width - padLeft - padRight
  const innerH = height - padTop - padBottom

  const points = sessions.map((s, idx) => {
    const x = sessions.length === 1
      ? padLeft + innerW / 2
      : padLeft + (idx / (sessions.length - 1)) * innerW
    const y = padTop + ((100 - s.scorePct) / 100) * innerH
    return { x, y, s }
  })

  const passY = padTop + ((100 - 70) / 100) * innerH
  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ')
  const areaPoints = points.length >= 2
    ? `${points[0].x},${padTop + innerH} ${polylinePoints} ${points[points.length - 1].x},${padTop + innerH}`
    : ''

  return (
    <div className={styles.chartWrap}>
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.chartSvg} role="img" aria-label="Score trend">
        {[0, 50, 100].map(val => {
          const y = padTop + ((100 - val) / 100) * innerH
          return (
            <g key={val}>
              <line x1={padLeft} y1={y} x2={width - padRight} y2={y} className={styles.chartGridLine} />
              <text x={padLeft - 8} y={y + 4} textAnchor="end" className={styles.chartAxisLabel}>
                {val}%
              </text>
            </g>
          )
        })}

        <line x1={padLeft} y1={passY} x2={width - padRight} y2={passY} className={styles.chartPassLine} />

        {areaPoints && <polygon points={areaPoints} className={styles.chartArea} />}
        {points.length >= 2 && <polyline fill="none" points={polylinePoints} className={styles.chartLine} />}

        {points.map(({ x, y, s }, idx) => {
          const passed = s.scorePct >= 70
          const showDate = sessions.length <= 8 || idx === 0 || idx === sessions.length - 1 || idx % 2 === 0
          return (
            <g key={s.id}>
              <circle cx={x} cy={y} r={5} className={passed ? styles.chartDotPass : styles.chartDotFail} />
              <text x={x} y={y - 10} textAnchor="middle" className={styles.chartValLabel}>
                {s.scorePct}%
              </text>
              {showDate && (
                <text x={x} y={height - 8} textAnchor="middle" className={styles.chartDateLabel}>
                  {formatChartDate(s.finishedAt, lang)}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
