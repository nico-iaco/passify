import styles from './ProgressBar.module.css'

interface Props {
  current: number   // 1-based
  total: number
}

export function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className={styles.wrap} role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.label}>{current}/{total}</span>
    </div>
  )
}
