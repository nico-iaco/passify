import styles from './OptionItem.module.css'

interface Props {
  optKey: string
  text: string
  isSelected: boolean
  isMulti: boolean
  isConfirmed: boolean
  isCorrect: boolean      // is this option part of the correct answer?
  onSelect: (key: string) => void
}

export function OptionItem({ optKey, text, isSelected, isMulti, isConfirmed, isCorrect, onSelect }: Props) {
  let stateClass = ''
  if (isConfirmed) {
    if (isCorrect) stateClass = styles.stateCorrect
    else if (isSelected && !isCorrect) stateClass = styles.stateWrong
  } else if (isSelected) {
    stateClass = styles.stateSelected
  }

  return (
    <label className={`${styles.option} ${stateClass}`}>
      <input
        type={isMulti ? 'checkbox' : 'radio'}
        checked={isSelected}
        onChange={() => !isConfirmed && onSelect(optKey)}
        disabled={isConfirmed}
        className={styles.input}
      />
      <span className={styles.indicator}>
        {isConfirmed && isCorrect ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : isConfirmed && isSelected && !isCorrect ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <span className={styles.keyLabel}>{optKey}</span>
        )}
      </span>
      <span className={styles.text}>{text}</span>
    </label>
  )
}
