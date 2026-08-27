import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import styles from './ExamTimer.module.css'

interface Props {
  expiresAt: number     // epoch ms
  onExpire: () => void
}

const LOW_TIME_THRESHOLD_MS = 5 * 60_000

export function ExamTimer({ expiresAt, onExpire }: Props) {
  const { t } = useI18n()
  const [remaining, setRemaining] = useState(() => expiresAt - Date.now())
  const hasExpired = useRef(false)

  useEffect(() => {
    const tick = () => setRemaining(expiresAt - Date.now())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [expiresAt])

  useEffect(() => {
    if (remaining <= 0 && !hasExpired.current) {
      hasExpired.current = true
      onExpire()
    }
  }, [remaining, onExpire])

  const clamped = Math.max(0, remaining)
  const totalSeconds = Math.ceil(clamped / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const isLow = clamped <= LOW_TIME_THRESHOLD_MS

  return (
    <div className={`${styles.card} card ${isLow ? styles.low : ''}`}>
      <span className={styles.header}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        {t.quiz_timer_label}
      </span>
      <span className={styles.value}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  )
}
