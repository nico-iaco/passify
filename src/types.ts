// ─── Raw JSON schema (as it comes from the file) ───────────────────────────

export interface RawQuestion {
  id: number
  topic: number
  question: string
  options: Record<string, string>
  answer: string
  timestamp: string
  url: string
  image_urls?: string[]
}

export interface RawExam {
  exam: string
  questions: RawQuestion[]
  examDuration?: number                 // suggested exam-mode timer, in minutes
}

// ─── Normalized types (used throughout the app) ─────────────────────────────

export interface NormalizedQuestion {
  id: number
  topic: number
  question: string
  options: Record<string, string>       // e.g. { A: "...", B: "...", C: "..." }
  optionKeys: string[]                  // ordered array of option keys
  answers: string[]                     // e.g. ["B"] or ["B","E"]
  isMulti: boolean
  timestamp: string
  url: string
  imageUrls: string[]
}

export interface NormalizedExam {
  name: string
  questions: NormalizedQuestion[]
  topics: number[]                      // sorted unique topic numbers
  examDuration: number | null           // suggested exam-mode timer, in minutes
}

// ─── App screens state machine ───────────────────────────────────────────────

export type Screen = 'upload' | 'setup' | 'quiz' | 'results'

export type QuizMode = 'practice' | 'exam'

// ─── Quiz session ────────────────────────────────────────────────────────────

export interface QuizConfig {
  mode: QuizMode
  totalQuestions: number
  selectedTopics: number[]              // empty = all
  shuffleQuestions: boolean
  shuffleOptions: boolean
  timerMinutes: number | null           // exam mode only; null = no timer
}

export interface QuizSession {
  exam: NormalizedExam
  config: QuizConfig
  questions: NormalizedQuestion[]       // the active question list (subset + shuffled)
  currentIndex: number
  answers: Record<number, string[]>     // questionId → selected options
  confirmed: Record<number, boolean>    // practice mode: has been confirmed
  startedAt: number                     // epoch ms
  expiresAt: number | null              // epoch ms when the exam timer runs out; null = no timer
}

export interface QuizResults {
  session: QuizSession
  score: number                         // 0–1
  correct: number
  wrong: number
  total: number
}
