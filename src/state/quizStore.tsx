import { createContext, useContext, useReducer } from 'react'
import type { ReactNode } from 'react'
import type {
  NormalizedExam,
  QuizConfig,
  QuizSession,
  Screen,
} from '../types'
import { shuffle as shuffleFn } from '../lib/shuffle'
import { saveSession, clearSession } from '../lib/storage'

// ─── State ───────────────────────────────────────────────────────────────────

interface AppState {
  screen: Screen
  loadedExam: NormalizedExam | null
  session: QuizSession | null
}

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'EXAM_LOADED'; exam: NormalizedExam }
  | { type: 'START_QUIZ'; config: QuizConfig }
  | { type: 'RESUME_SESSION'; session: QuizSession }
  | { type: 'SELECT_ANSWER'; questionId: number; option: string; isMulti: boolean }
  | { type: 'CONFIRM_ANSWER'; questionId: number }
  | { type: 'NAVIGATE'; delta: 1 | -1 }
  | { type: 'GO_TO_RESULTS' }
  | { type: 'BACK_TO_UPLOAD' }
  | { type: 'BACK_TO_SETUP' }

// ─── Reducer ─────────────────────────────────────────────────────────────────

const initialState: AppState = {
  screen: 'upload',
  loadedExam: null,
  session: null,
}

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

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'EXAM_LOADED':
      return { ...state, loadedExam: action.exam, screen: 'setup' }

    case 'BACK_TO_UPLOAD':
      clearSession()
      return { ...initialState }

    case 'BACK_TO_SETUP':
      return { ...state, session: null, screen: 'setup' }

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
      saveSession(session)
      return { ...state, session, screen: 'quiz' }
    }

    case 'RESUME_SESSION':
      return {
        ...state,
        loadedExam: action.session.exam,
        session: action.session,
        screen: 'quiz',
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

      const session: QuizSession = {
        ...state.session,
        answers: { ...state.session.answers, [questionId]: next },
      }
      saveSession(session)
      return { ...state, session }
    }

    case 'CONFIRM_ANSWER': {
      if (!state.session) return state
      const session: QuizSession = {
        ...state.session,
        confirmed: { ...state.session.confirmed, [action.questionId]: true },
      }
      saveSession(session)
      return { ...state, session }
    }

    case 'NAVIGATE': {
      if (!state.session) return state
      const next = state.session.currentIndex + action.delta
      if (next < 0 || next >= state.session.questions.length) return state
      const session: QuizSession = { ...state.session, currentIndex: next }
      saveSession(session)
      return { ...state, session }
    }

    case 'GO_TO_RESULTS':
      clearSession()
      return { ...state, screen: 'results' }

    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface StoreContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children, initialSession }: { children: ReactNode; initialSession?: QuizSession }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Resume session on mount if passed from parent
  if (initialSession && state.session === null && state.screen === 'upload') {
    // We'll handle this via useEffect in parent — this is just placeholder
  }

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
