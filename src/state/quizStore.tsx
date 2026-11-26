import { createContext, useContext, useReducer } from 'react'
import type { ReactNode } from 'react'
import type {
  NormalizedExam,
  QuizConfig,
  QuizSession,
  Screen,
} from '../types'
import { createSession } from '../lib/quiz'
import { saveSession, clearSession } from '../lib/storage'

interface AppState {
  screen: Screen
  loadedExam: NormalizedExam | null
  session: QuizSession | null
}

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

const initialState: AppState = {
  screen: 'upload',
  loadedExam: null,
  session: null,
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
      const session = createSession(state.loadedExam, action.config)
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

interface StoreContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode; initialSession?: QuizSession }) {
  const [state, dispatch] = useReducer(reducer, initialState)

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
