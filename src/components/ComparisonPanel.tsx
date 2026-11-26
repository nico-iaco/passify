import { useState } from 'react'
import { useI18n } from '../i18n'
import type { CommonQuestionComparison, SessionComparison } from '../types'
import styles from './ComparisonPanel.module.css'

interface Props {
  comparison: SessionComparison
  currentScorePct: number
  title?: string
  defaultExpanded?: boolean
}

export function ComparisonPanel({
  comparison,
  currentScorePct,
  title,
  defaultExpanded = false,
}: Props) {
  const { t } = useI18n()
  const [expanded, setExpanded] = useState(defaultExpanded)

  const {
    previousSession,
    scoreDelta,
    commonCount,
    commonWrongCount,
    commonWrongPct,
    improvedCount,
    repeatedErrorCount,
    regressedCount,
    items,
  } = comparison

  const notableItems = items.filter(i => i.status !== 'maintained')
  const wrongCommonItems = items.filter(
    i => i.status === 'repeated_error' || i.status === 'regressed'
  )

  const deltaLabel = scoreDelta > 0
    ? `+${scoreDelta}%`
    : `${scoreDelta}%`

  const deltaClass = scoreDelta > 0
    ? styles.deltaPositive
    : scoreDelta < 0
      ? styles.deltaNegative
      : styles.deltaNeutral

  function statusBadge(item: CommonQuestionComparison) {
    if (item.status === 'repeated_error') {
      return <span className="badge badge--wrong">{t.history_status_repeated}</span>
    }
    if (item.status === 'regressed') {
      return <span className={`badge ${styles.badgeWarn}`}>{t.history_status_regressed}</span>
    }
    if (item.status === 'improved') {
      return <span className="badge badge--correct">{t.history_status_improved}</span>
    }
    return <span className="badge badge--topic">{t.history_status_maintained}</span>
  }

  return (
    <div className={styles.box}>
      <div className={styles.topRow}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{title ?? t.results_compare_title}</span>
          <span className={styles.scoreTransition}>
            {previousSession.scorePct}% → {currentScorePct}%
          </span>
          <span className={`${styles.deltaBadge} ${deltaClass}`}>{deltaLabel}</span>
        </div>
        {notableItems.length > 0 && (
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => setExpanded(v => !v)}
          >
            {expanded ? t.results_compare_hide_refs : t.results_compare_show_refs}
          </button>
        )}
      </div>

      {commonCount === 0 ? (
        <p className={styles.noOverlap}>{t.history_compare_no_overlap}</p>
      ) : (
        <div className={styles.summary}>
          <p className={styles.summaryLine}>
            <strong>{commonCount}</strong> {t.results_compare_common}
            {' · '}
            <strong className={commonWrongCount > 0 ? styles.wrongNum : styles.okNum}>
              {commonWrongCount} ({commonWrongPct}%)
            </strong>{' '}
            {t.results_compare_wrong_pct}
          </p>
          <div className={styles.pills}>
            <span className="badge badge--correct">
              {t.results_compare_improved}: {improvedCount}
            </span>
            <span className="badge badge--wrong">
              {t.results_compare_repeated}: {repeatedErrorCount}
            </span>
            {regressedCount > 0 && (
              <span className={`badge ${styles.badgeWarn}`}>
                {t.results_compare_regressed}: {regressedCount}
              </span>
            )}
          </div>
        </div>
      )}

      {expanded && notableItems.length > 0 && (
        <div className={styles.refList}>
          {(wrongCommonItems.length > 0 ? [...wrongCommonItems, ...items.filter(i => i.status === 'improved')] : notableItems).map(item => (
            <div key={item.questionId} className={styles.refItem}>
              <div className={styles.refHeader}>
                <div className={styles.refMeta}>
                  <span className="badge badge--topic">Topic {item.topic}</span>
                  <span className={styles.refId}>
                    {item.position > 0 && item.position !== item.questionId
                      ? `#${item.position} · ID ${item.questionId}`
                      : `ID #${item.questionId}`}
                  </span>
                </div>
                {statusBadge(item)}
              </div>

              {item.snapshot ? (
                <>
                  <p className={styles.refQuestion}>{item.snapshot.question}</p>
                  <div className={styles.refFooter}>
                    <span className={styles.refAnswers}>
                      {t.results_your_answer}{' '}
                      <strong>
                        {item.currentResult.selected.length > 0
                          ? item.currentResult.selected.join(', ')
                          : '—'}
                      </strong>
                      {' · '}
                      {t.results_correct_answer}{' '}
                      <strong className={styles.correctKey}>
                        {item.snapshot.answers.join(', ')}
                      </strong>
                    </span>
                    {item.snapshot.url && (
                      <a
                        href={item.snapshot.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.refLink}
                      >
                        {t.results_explanation} ↗
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <div className={styles.refFooter}>
                  <span className={styles.refAnswers}>
                    {t.results_your_answer}{' '}
                    <strong>
                      {item.currentResult.selected.length > 0
                        ? item.currentResult.selected.join(', ')
                        : '—'}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
