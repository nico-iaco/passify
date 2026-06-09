import { useCallback, useEffect, useReducer, useState } from 'react'
import { I18nProvider } from './i18n'
import { clearSession, loadSession, loadTheme, saveSession, saveTheme } from './lib/storage'
import type { Theme } from './lib/storage'
import type { NormalizedExam, QuizConfig, QuizSession, Screen } from './types'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { ThemeToggle } from './components/ThemeToggle'
import { SettingsModal } from './components/SettingsModal'
import { UploadScreen } from './components/UploadScreen'
import { SetupScreen } from './components/SetupScreen'
import { QuizScreen } from './components/QuizScreen'
import { ResultsScreen } from './components/ResultsScreen'
import { shuffle as shuffleFn } from './lib/shuffle'
import appStyles from './App.module.css'

// ─── Helpers (same logic as quizStore but kept local to simplify wiring) ────

function buildQuestions(exam: NormalizedExam, config: QuizConfig) {
  let qs = exam.questions.filter(
    q => config.selectedTopics.length === 0 || config.selectedTopics.includes(q.topic)
  )
  if (config.shuffleQuestions) qs = shuffleFn(qs)
  qs = qs.slice(0, config.totalQuestions)

  if (config.shuffleOptions) {
    qs = qs.map(q => {
      const keys = shuffleFn(q.optionKeys)
      const options: Record<string, string> = {}
      keys.forEach(k => { options[k] = q.options[k] })
      return { ...q, options, optionKeys: keys }
    })
  }
  return qs
}

// ─── App state ───────────────────────────────────────────────────────────────

interface AppState {
  screen: Screen
  loadedExam: NormalizedExam | null
  session: QuizSession | null
  savedSession: QuizSession | null
}

type Action =
  | { type: 'EXAM_LOADED'; exam: NormalizedExam }
  | { type: 'START_QUIZ'; config: QuizConfig }
  | { type: 'RESUME_SESSION'; session: QuizSession }
  | { type: 'DISCARD_SESSION' }
  | { type: 'SELECT_ANSWER'; questionId: number; option: string; isMulti: boolean }
  | { type: 'CONFIRM_ANSWER'; questionId: number }
  | { type: 'NAVIGATE'; delta: 1 | -1 }
  | { type: 'GO_TO_RESULTS' }
  | { type: 'RETRY' }
  | { type: 'NEW_EXAM' }
  | { type: 'BACK_TO_UPLOAD' }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'EXAM_LOADED':
      return { ...state, loadedExam: action.exam, screen: 'setup' }

    case 'BACK_TO_UPLOAD':
      clearSession()
      return { screen: 'upload', loadedExam: null, session: null, savedSession: null }

    case 'DISCARD_SESSION':
      clearSession()
      return { ...state, savedSession: null }

    case 'START_QUIZ': {
      if (!state.loadedExam) return state
      const questions = buildQuestions(state.loadedExam, action.config)
      const session: QuizSession = {
        exam: state.loadedExam,
        config: action.config,
        questions,
        currentIndex: 0,
        answers: {},
        confirmed: {},
        startedAt: Date.now(),
      }
      return { ...state, session, screen: 'quiz' }
    }

    case 'RESUME_SESSION':
      return {
        ...state,
        loadedExam: action.session.exam,
        session: action.session,
        screen: 'quiz',
        savedSession: null,
      }

    case 'SELECT_ANSWER': {
      if (!state.session) return state
      const { questionId, option, isMulti } = action
      const prev = state.session.answers[questionId] ?? []
      let next: string[]
      if (isMulti) {
        next = prev.includes(option)
          ? prev.filter(o => o !== option)
          : [...prev, option]
      } else {
        next = [option]
      }
      return {
        ...state,
        session: {
          ...state.session,
          answers: { ...state.session.answers, [questionId]: next },
        },
      }
    }

    case 'CONFIRM_ANSWER': {
      if (!state.session) return state
      return {
        ...state,
        session: {
          ...state.session,
          confirmed: { ...state.session.confirmed, [action.questionId]: true },
        },
      }
    }

    case 'NAVIGATE': {
      if (!state.session) return state
      const next = state.session.currentIndex + action.delta
      if (next < 0 || next >= state.session.questions.length) return state
      return {
        ...state,
        session: { ...state.session, currentIndex: next },
      }
    }

    case 'GO_TO_RESULTS':
      clearSession()
      return { ...state, screen: 'results' }

    case 'RETRY': {
      if (!state.session) return state
      const { exam, config } = state.session
      const questions = buildQuestions(exam, config)
      const session: QuizSession = {
        exam,
        config,
        questions,
        currentIndex: 0,
        answers: {},
        confirmed: {},
        startedAt: Date.now(),
      }
      return { ...state, session, screen: 'quiz' }
    }

    case 'NEW_EXAM':
      return { screen: 'upload', loadedExam: null, session: null, savedSession: null }

    default:
      return state
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function App() {
  const [theme, setThemeState] = useState<Theme>(loadTheme)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const savedSession = loadSession()
  const [state, dispatch] = useReducer(reducer, {
    screen: 'upload',
    loadedExam: null,
    session: null,
    savedSession,
  })

  // Persist session changes to localStorage
  useEffect(() => {
    if (state.session && state.screen === 'quiz') {
      saveSession(state.session)
    }
  }, [state.session, state.screen])

  const toggleTheme = useCallback(() => {
    setThemeState(t => {
      const next = t === 'light' ? 'dark' : 'light'
      saveTheme(next)
      return next
    })
  }, [])

  return (
    <I18nProvider>
      <div data-theme={theme} className={appStyles.app}>
        {/* Topbar */}
        <div className={appStyles.topbar}>
          <div className="container">
            <div className={appStyles.topbarInner}>
              <div className={appStyles.topbarBrand}>
                <svg width="22" height="22" viewBox="0 0 36 36" fill="none">
                  <rect width="36" height="36" rx="10" fill="var(--brand-500)"/>
                  <path d="M12 13h12M12 18h8M12 23h10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="26" cy="23" r="4" fill="var(--brand-300)"/>
                  <path d="M24.5 23l1 1.5 2-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className={appStyles.topbarName}>Passify</span>
              </div>
              <div className={appStyles.topbarActions}>
                <LanguageSwitcher />
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
                <button
                  className="btn btn--ghost btn--icon"
                  onClick={() => setSettingsOpen(true)}
                  aria-label="AI Settings"
                  title="AI Settings"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Screens */}
        {state.screen === 'upload' && (
          <UploadScreen
            savedSession={state.savedSession}
            onExamLoaded={exam => dispatch({ type: 'EXAM_LOADED', exam })}
            onResumeSession={s => dispatch({ type: 'RESUME_SESSION', session: s })}
            onDiscardSession={() => dispatch({ type: 'DISCARD_SESSION' })}
          />
        )}

        {state.screen === 'setup' && state.loadedExam && (
          <SetupScreen
            exam={state.loadedExam}
            onStart={config => dispatch({ type: 'START_QUIZ', config })}
            onBack={() => dispatch({ type: 'BACK_TO_UPLOAD' })}
          />
        )}

        {state.screen === 'quiz' && state.session && (
          <QuizScreen
            session={state.session}
            onSelectAnswer={(qId, opt, isMulti) =>
              dispatch({ type: 'SELECT_ANSWER', questionId: qId, option: opt, isMulti })
            }
            onConfirmAnswer={qId => dispatch({ type: 'CONFIRM_ANSWER', questionId: qId })}
            onNavigate={delta => dispatch({ type: 'NAVIGATE', delta })}
            onFinish={() => dispatch({ type: 'GO_TO_RESULTS' })}
            onExit={() => dispatch({ type: 'BACK_TO_UPLOAD' })}
          />
        )}

        {state.screen === 'results' && state.session && (
          <ResultsScreen
            session={state.session}
            onRetry={() => dispatch({ type: 'RETRY' })}
            onNewExam={() => dispatch({ type: 'NEW_EXAM' })}
          />
        )}

        <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </I18nProvider>
  )
}
