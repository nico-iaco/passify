import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { I18nProvider, useI18n } from './i18n'
import {
  deleteExamHistory,
  deleteSessionFromHistory,
  recordCompletedSession,
} from './lib/analytics'
import {
  buildExamFromSnapshots,
  createSession,
  createSessionFromQuestions,
  getExamKey,
  snapshotToQuestion,
} from './lib/quiz'
import {
  clearSession,
  loadAnalytics,
  loadSession,
  loadTheme,
  saveSession,
  saveTheme,
} from './lib/storage'
import type { Theme } from './lib/storage'
import type {
  AnalyticsStore,
  NormalizedExam,
  NormalizedQuestion,
  QuestionSnapshot,
  QuestionSource,
  QuizConfig,
  QuizSession,
  Screen,
  SessionRecord,
} from './types'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { ThemeToggle } from './components/ThemeToggle'
import { SettingsModal } from './components/SettingsModal'
import { UploadScreen } from './components/UploadScreen'
import { SetupScreen } from './components/SetupScreen'
import { QuizScreen } from './components/QuizScreen'
import { ResultsScreen } from './components/ResultsScreen'
import { HistoryScreen } from './components/HistoryScreen'
import appStyles from './App.module.css'

type NonQuizScreen = Exclude<Screen, 'quiz' | 'history'>

interface AppState {
  screen: Screen
  previousScreen: NonQuizScreen
  historyExamKey: string | null
  loadedExam: NormalizedExam | null
  session: QuizSession | null
  savedSession: QuizSession | null
  completedRecord: SessionRecord | null
  previousSession: SessionRecord | null
}

type Action =
  | { type: 'EXAM_LOADED'; exam: NormalizedExam }
  | { type: 'START_QUIZ'; config: QuizConfig; targetIds?: number[] }
  | { type: 'START_DIRECT_SESSION'; exam: NormalizedExam; session: QuizSession }
  | { type: 'RESUME_SESSION'; session: QuizSession }
  | { type: 'DISCARD_SESSION' }
  | { type: 'SELECT_ANSWER'; questionId: number; option: string; isMulti: boolean }
  | { type: 'CONFIRM_ANSWER'; questionId: number }
  | { type: 'NAVIGATE'; delta: 1 | -1 }
  | { type: 'GO_TO_RESULTS'; record: SessionRecord; previousSession: SessionRecord | null }
  | { type: 'RETRY' }
  | { type: 'NEW_EXAM' }
  | { type: 'BACK_TO_UPLOAD' }
  | { type: 'OPEN_HISTORY'; examKey?: string | null }
  | { type: 'CLOSE_HISTORY' }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'EXAM_LOADED':
      return {
        ...state,
        loadedExam: action.exam,
        screen: 'setup',
        previousScreen: 'setup',
        historyExamKey: getExamKey(action.exam.name),
      }

    case 'BACK_TO_UPLOAD':
      clearSession()
      return {
        ...state,
        screen: 'upload',
        previousScreen: 'upload',
        loadedExam: null,
        session: null,
        savedSession: null,
        completedRecord: null,
        previousSession: null,
      }

    case 'DISCARD_SESSION':
      clearSession()
      return { ...state, savedSession: null }

    case 'START_QUIZ': {
      if (!state.loadedExam) return state
      const session = createSession(state.loadedExam, action.config, action.targetIds)
      return {
        ...state,
        session,
        screen: 'quiz',
        completedRecord: null,
        previousSession: null,
      }
    }

    case 'START_DIRECT_SESSION':
      return {
        ...state,
        loadedExam: action.exam,
        session: action.session,
        screen: 'quiz',
        completedRecord: null,
        previousSession: null,
      }

    case 'RESUME_SESSION':
      return {
        ...state,
        loadedExam: action.session.exam,
        session: action.session,
        screen: 'quiz',
        savedSession: null,
        completedRecord: null,
        previousSession: null,
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
      return {
        ...state,
        screen: 'results',
        previousScreen: 'results',
        completedRecord: action.record,
        previousSession: action.previousSession,
      }

    case 'RETRY': {
      if (!state.session) return state
      const { exam, config, questions } = state.session
      const session = config.source === 'all'
        ? createSession(exam, config)
        : createSessionFromQuestions(exam, config, questions)
      return {
        ...state,
        session,
        screen: 'quiz',
        completedRecord: null,
        previousSession: null,
      }
    }

    case 'NEW_EXAM':
      return {
        ...state,
        screen: 'upload',
        previousScreen: 'upload',
        loadedExam: null,
        session: null,
        savedSession: null,
        completedRecord: null,
        previousSession: null,
      }

    case 'OPEN_HISTORY': {
      if (state.screen === 'quiz') return state
      const returnTo: NonQuizScreen = state.screen === 'history'
        ? state.previousScreen
        : state.screen
      return {
        ...state,
        screen: 'history',
        previousScreen: returnTo,
        historyExamKey: action.examKey !== undefined
          ? action.examKey
          : state.loadedExam
            ? getExamKey(state.loadedExam.name)
            : null,
      }
    }

    case 'CLOSE_HISTORY':
      return {
        ...state,
        screen: state.previousScreen,
      }

    default:
      return state
  }
}

function AppContent() {
  const { t } = useI18n()
  const [theme, setThemeState] = useState<Theme>(loadTheme)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [analytics, setAnalytics] = useState<AnalyticsStore>(loadAnalytics)

  const [state, dispatch] = useReducer(reducer, null, (): AppState => ({
    screen: 'upload',
    previousScreen: 'upload',
    historyExamKey: null,
    loadedExam: null,
    session: null,
    savedSession: loadSession(),
    completedRecord: null,
    previousSession: null,
  }))

  useEffect(() => {
    if (state.session && state.screen === 'quiz') {
      saveSession(state.session)
    }
  }, [state.session, state.screen])

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const next = prev === 'light' ? 'dark' : 'light'
      saveTheme(next)
      return next
    })
  }, [])

  const totalHistorySessions = useMemo(
    () => Object.values(analytics).reduce((acc, ex) => acc + ex.sessions.length, 0),
    [analytics],
  )

  const activeExamHistory = useMemo(() => {
    if (!state.loadedExam) return null
    return analytics[getExamKey(state.loadedExam.name)] ?? null
  }, [analytics, state.loadedExam])

  const resultsExamSnapshots = useMemo((): Record<number, QuestionSnapshot> => {
    if (!state.session) return {}
    return analytics[getExamKey(state.session.exam.name)]?.snapshots ?? {}
  }, [analytics, state.session])

  const handleFinishQuiz = useCallback(() => {
    if (!state.session) return
    clearSession()
    const { store, record, previousSession } = recordCompletedSession(state.session)
    setAnalytics(store)
    dispatch({ type: 'GO_TO_RESULTS', record, previousSession })
  }, [state.session])

  const handleStartWrongFromHistory = useCallback((
    examName: string,
    questionIds: number[],
    source: QuestionSource,
  ) => {
    const key = getExamKey(examName)
    const examData = analytics[key]
    const matchesLoaded = state.loadedExam && getExamKey(state.loadedExam.name) === key

    let exam: NormalizedExam
    let targetQuestions: NormalizedQuestion[]

    if (matchesLoaded && state.loadedExam) {
      exam = state.loadedExam
      const byId = new Map(exam.questions.map(q => [q.id, q]))
      targetQuestions = questionIds
        .map(id => byId.get(id))
        .filter((q): q is NormalizedQuestion => q !== undefined)
    } else if (examData) {
      const snaps = questionIds
        .map(id => examData.snapshots[id])
        .filter((s): s is QuestionSnapshot => s !== undefined)
      if (snaps.length === 0) return
      exam = buildExamFromSnapshots(examName, snaps)
      targetQuestions = snaps.map(snapshotToQuestion)
    } else {
      return
    }

    if (targetQuestions.length === 0) return

    const config: QuizConfig = {
      mode: 'practice',
      source,
      totalQuestions: targetQuestions.length,
      selectedTopics: [],
      shuffleQuestions: false,
      shuffleOptions: true,
      timerMinutes: null,
    }
    const session = createSessionFromQuestions(exam, config, targetQuestions)
    dispatch({ type: 'START_DIRECT_SESSION', exam, session })
  }, [analytics, state.loadedExam])

  const handleDeleteSession = useCallback((examKey: string, sessionId: string) => {
    setAnalytics(deleteSessionFromHistory(examKey, sessionId))
  }, [])

  const handleClearExamHistory = useCallback((examKey: string) => {
    setAnalytics(deleteExamHistory(examKey))
  }, [])

  return (
    <div data-theme={theme} className={appStyles.app}>
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
              {state.screen !== 'quiz' && (
                <button
                  className={`btn btn--ghost btn--sm ${appStyles.historyNavBtn} ${state.screen === 'history' ? appStyles.historyNavBtnActive : ''}`}
                  onClick={() => {
                    if (state.screen === 'history') {
                      dispatch({ type: 'CLOSE_HISTORY' })
                    } else {
                      dispatch({ type: 'OPEN_HISTORY' })
                    }
                  }}
                  aria-label={t.nav_history}
                  title={t.nav_history}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                  <span className={appStyles.historyNavLabel}>{t.nav_history}</span>
                  {totalHistorySessions > 0 && (
                    <span className={appStyles.historyCount}>{totalHistorySessions}</span>
                  )}
                </button>
              )}
              <LanguageSwitcher />
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <button
                className="btn btn--ghost btn--icon"
                onClick={() => setSettingsOpen(true)}
                aria-label={t.settings_btn}
                title={t.settings_btn}
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

      {state.screen === 'upload' && (
        <UploadScreen
          savedSession={state.savedSession}
          historySessionCount={totalHistorySessions}
          onExamLoaded={exam => dispatch({ type: 'EXAM_LOADED', exam })}
          onResumeSession={s => dispatch({ type: 'RESUME_SESSION', session: s })}
          onDiscardSession={() => dispatch({ type: 'DISCARD_SESSION' })}
          onOpenHistory={() => dispatch({ type: 'OPEN_HISTORY', examKey: null })}
        />
      )}

      {state.screen === 'setup' && state.loadedExam && (
        <SetupScreen
          exam={state.loadedExam}
          examHistory={activeExamHistory}
          onStart={(config, targetIds) => dispatch({ type: 'START_QUIZ', config, targetIds })}
          onBack={() => dispatch({ type: 'BACK_TO_UPLOAD' })}
          onOpenHistory={() => dispatch({ type: 'OPEN_HISTORY', examKey: getExamKey(state.loadedExam!.name) })}
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
          onFinish={handleFinishQuiz}
          onExit={() => dispatch({ type: 'BACK_TO_UPLOAD' })}
        />
      )}

      {state.screen === 'results' && state.session && (
        <ResultsScreen
          session={state.session}
          completedRecord={state.completedRecord}
          previousSession={state.previousSession}
          snapshots={resultsExamSnapshots}
          onRetry={() => dispatch({ type: 'RETRY' })}
          onOpenHistory={() => dispatch({ type: 'OPEN_HISTORY', examKey: getExamKey(state.session!.exam.name) })}
          onNewExam={() => dispatch({ type: 'NEW_EXAM' })}
        />
      )}

      {state.screen === 'history' && (
        <HistoryScreen
          analytics={analytics}
          initialExamKey={state.historyExamKey}
          onBack={() => dispatch({ type: 'CLOSE_HISTORY' })}
          onStartWrongQuiz={handleStartWrongFromHistory}
          onDeleteSession={handleDeleteSession}
          onClearExamHistory={handleClearExamHistory}
        />
      )}

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  )
}
