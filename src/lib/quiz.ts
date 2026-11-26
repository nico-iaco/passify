import type {
  NormalizedExam,
  NormalizedQuestion,
  QuestionSnapshot,
  QuizConfig,
  QuizSession,
} from '../types'
import { shuffle as shuffleFn } from './shuffle'

export function getExamKey(examName: string): string {
  return examName.trim().toLowerCase()
}

export function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function maybeShuffleOptions(questions: NormalizedQuestion[], shuffleOptions: boolean): NormalizedQuestion[] {
  if (!shuffleOptions) return questions
  return questions.map(q => {
    const keys = shuffleFn(q.optionKeys)
    const options: Record<string, string> = {}
    keys.forEach(k => { options[k] = q.options[k] })
    return { ...q, options, optionKeys: keys }
  })
}

export function buildQuestions(
  exam: NormalizedExam,
  config: QuizConfig,
  targetIds?: number[],
): NormalizedQuestion[] {
  let qs: NormalizedQuestion[]

  if (config.source !== 'all' && targetIds && targetIds.length > 0) {
    const byId = new Map(exam.questions.map(q => [q.id, q]))
    qs = targetIds
      .map(id => byId.get(id))
      .filter((q): q is NormalizedQuestion => q !== undefined)
  } else {
    qs = exam.questions.filter(
      q => config.selectedTopics.length === 0 || config.selectedTopics.includes(q.topic)
    )
  }

  if (config.shuffleQuestions) qs = shuffleFn(qs)
  qs = qs.slice(0, config.totalQuestions)

  return maybeShuffleOptions(qs, config.shuffleOptions)
}

export function createSessionFromQuestions(
  exam: NormalizedExam,
  config: QuizConfig,
  sourceQuestions: NormalizedQuestion[],
): QuizSession {
  const freshById = new Map(exam.questions.map(q => [q.id, q]))
  let qs = sourceQuestions.map(q => freshById.get(q.id) ?? q)
  if (config.shuffleQuestions) qs = shuffleFn(qs)
  qs = maybeShuffleOptions(qs, config.shuffleOptions)

  const startedAt = Date.now()
  return {
    id: generateSessionId(),
    exam,
    config: {
      ...config,
      totalQuestions: qs.length,
    },
    questions: qs,
    currentIndex: 0,
    answers: {},
    confirmed: {},
    startedAt,
    expiresAt: config.timerMinutes ? startedAt + config.timerMinutes * 60_000 : null,
  }
}

export function createSession(
  exam: NormalizedExam,
  config: QuizConfig,
  targetIds?: number[],
): QuizSession {
  const questions = buildQuestions(exam, config, targetIds)
  const startedAt = Date.now()
  return {
    id: generateSessionId(),
    exam,
    config,
    questions,
    currentIndex: 0,
    answers: {},
    confirmed: {},
    startedAt,
    expiresAt: config.timerMinutes ? startedAt + config.timerMinutes * 60_000 : null,
  }
}

export function snapshotToQuestion(s: QuestionSnapshot): NormalizedQuestion {
  return {
    id: s.id,
    position: s.position,
    topic: s.topic,
    question: s.question,
    options: { ...s.options },
    optionKeys: [...s.optionKeys],
    answers: [...s.answers],
    isMulti: s.isMulti,
    timestamp: '',
    url: s.url,
    imageUrls: [...s.imageUrls],
  }
}

export function buildExamFromSnapshots(examName: string, snapshots: QuestionSnapshot[]): NormalizedExam {
  const questions = snapshots.map(snapshotToQuestion)
  const topics = Array.from(new Set(questions.map(q => q.topic))).sort((a, b) => a - b)
  return {
    name: examName,
    questions,
    topics,
    examDuration: null,
  }
}
