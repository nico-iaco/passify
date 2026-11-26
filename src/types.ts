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
  position: number                      // 1-based index in the source JSON
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

export type Screen = 'upload' | 'setup' | 'quiz' | 'results' | 'history'

export type QuizMode = 'practice' | 'exam'

export type QuestionSource = 'all' | 'most_wrong'

// ─── Quiz session ────────────────────────────────────────────────────────────

export interface QuizConfig {
  mode: QuizMode
  source: QuestionSource
  totalQuestions: number
  selectedTopics: number[]              // empty = all
  shuffleQuestions: boolean
  shuffleOptions: boolean
  timerMinutes: number | null           // exam mode only; null = no timer
}

export interface QuizSession {
  id: string
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

// ─── Session History & Analytics ─────────────────────────────────────────────

export interface QuestionResultRecord {
  questionId: number
  position: number
  topic: number
  correct: boolean
  selected: string[]
}

export interface QuestionSnapshot {
  id: number
  position: number
  topic: number
  question: string
  options: Record<string, string>
  optionKeys: string[]
  answers: string[]
  isMulti: boolean
  url: string
  imageUrls: string[]
}

export interface SessionRecord {
  id: string
  examKey: string
  examName: string
  mode: QuizMode
  source: QuestionSource
  startedAt: number
  finishedAt: number
  total: number
  correct: number
  wrong: number
  scorePct: number
  durationMs: number
  results: QuestionResultRecord[]
}

export interface ExamHistoryData {
  examKey: string
  examName: string
  sessions: SessionRecord[]                   // chronological (oldest → newest)
  snapshots: Record<number, QuestionSnapshot> // keyed by questionId
  updatedAt: number
}

export type AnalyticsStore = Record<string, ExamHistoryData>

export interface CommonQuestionComparison {
  questionId: number
  position: number
  topic: number
  currentResult: QuestionResultRecord
  previousResult: QuestionResultRecord
  status: 'improved' | 'repeated_error' | 'regressed' | 'maintained'
  snapshot?: QuestionSnapshot
}

export interface SessionComparison {
  previousSession: SessionRecord
  scoreDelta: number
  commonCount: number
  commonWrongCount: number
  commonWrongPct: number
  improvedCount: number
  repeatedErrorCount: number
  regressedCount: number
  items: CommonQuestionComparison[]
}

export interface QuestionAggregateStat {
  questionId: number
  position: number
  topic: number
  attempts: number
  wrongCount: number
  correctCount: number
  errorRate: number                     // 0–1
  consecutiveWrong: number
  lastWrong: boolean
  lastAttemptAt: number
  snapshot?: QuestionSnapshot
}
