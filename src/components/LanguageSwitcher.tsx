import { useI18n } from '../i18n'
import styles from './LanguageSwitcher.module.css'

export function LanguageSwitcher() {
  const { t, toggleLang } = useI18n()
  return (
    <button
      className={`btn btn--ghost btn--sm ${styles.langBtn}`}
      onClick={toggleLang}
      aria-label="Switch language"
    >
      {t.lang_toggle}
    </button>
  )
}
