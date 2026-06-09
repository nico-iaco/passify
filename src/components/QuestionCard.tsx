import { useI18n } from '../i18n'
import type { NormalizedQuestion } from '../types'
import { AiExplanation } from './AiExplanation'
import { OptionItem } from './OptionItem'
import styles from './QuestionCard.module.css'

interface Props {
  question: NormalizedQuestion
  selected: string[]
  confirmed: boolean
  isPractice: boolean
  onSelect: (key: string) => void
  onConfirm: () => void
}

export function QuestionCard({ question, selected, confirmed, isPractice, onSelect, onConfirm }: Props) {
  const { t } = useI18n()

  const canConfirm = selected.length > 0
  const isCorrectAnswer = isPractice && confirmed &&
    selected.length === question.answers.length &&
    question.answers.every(a => selected.includes(a))

  return (
    <div className={`${styles.card} card animate-fade-up`}>
      {/* Header row */}
      <div className={styles.header}>
        <span className="badge badge--topic">
          Topic {question.topic}
        </span>
        {question.isMulti && (
          <span className={styles.multiHint}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            {t.quiz_select_multi} {question.answers.length} {t.quiz_select_multi_answers}
          </span>
        )}
      </div>

      {/* Question text */}
      <p className={styles.questionText}>{question.question}</p>

      {/* Images */}
      {question.imageUrls.length > 0 && (
        <div className={styles.images}>
          {question.imageUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Diagram ${i + 1}`}
              className={styles.image}
              loading="lazy"
            />
          ))}
        </div>
      )}

      {/* Options */}
      <div className={styles.options}>
        {question.optionKeys.map(key => (
          <OptionItem
            key={key}
            optKey={key}
            text={question.options[key]}
            isSelected={selected.includes(key)}
            isMulti={question.isMulti}
            isConfirmed={isPractice && confirmed}
            isCorrect={question.answers.includes(key)}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* Practice mode: confirm + feedback */}
      {isPractice && (
        <div className={styles.practiceFooter}>
          {!confirmed ? (
            <button
              className="btn btn--primary"
              onClick={onConfirm}
              disabled={!canConfirm}
            >
              {t.quiz_confirm}
            </button>
          ) : (
            <div className={styles.feedback}>
              <span className={`badge ${isCorrectAnswer ? 'badge--correct' : 'badge--wrong'}`}>
                {isCorrectAnswer ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {t.quiz_correct_label}
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    {t.quiz_wrong_label}
                  </>
                )}
              </span>
              {!isCorrectAnswer && (
                <span className={styles.correctAnswerHint}>
                  {t.quiz_correct_answer} <strong>{question.answers.join(', ')}</strong>
                </span>
              )}
              <a
                href={question.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn--ghost btn--sm ${styles.explanationLink}`}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                {t.quiz_explanation}
              </a>
              <AiExplanation question={question} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
