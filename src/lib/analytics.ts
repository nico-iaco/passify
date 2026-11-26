import type {
  AnalyticsStore,
  CommonQuestionComparison,
  ExamHistoryData,
  NormalizedQuestion,
  QuestionAggregateStat,
  QuestionResultRecord,
  QuestionSnapshot,
  QuizSession,
  SessionComparison,
  SessionRecord,
} from '../types'
import { isCorrect } from './grade'
import { getExamKey } from './quiz'
import { loadAnalytics, saveAnalytics } from './storage'

const MAX_SESSIONS_PER_EXAM = 100

function toSnapshot(q: NormalizedQuestion, indexFallback: number): QuestionSnapshot {
  const sortedKeys = [...q.optionKeys].sort()
  const options: Record<string, string> = {}
  sortedKeys.forEach(k => { options[k] = q.options[k] })

  return {
    id: q.id,
    position: q.position ?? indexFallback + 1,
    topic: q.topic,
    question: q.question,
    options,
    optionKeys: sortedKeys,
    answers: [...q.answers],
    isMulti: q.isMulti,
    url: q.url,
    imageUrls: [...q.imageUrls],
  }
}

export function buildSessionRecord(session: QuizSession, finishedAt = Date.now()): {
  record: SessionRecord
  missedSnapshots: QuestionSnapshot[]
} {
  const results: QuestionResultRecord[] = []
  const missedSnapshots: QuestionSnapshot[] = []
  let correctCount = 0

  session.questions.forEach((q, idx) => {
    const selected = session.answers[q.id] ?? []
    const ok = isCorrect(q, selected)
    if (ok) correctCount++
    else missedSnapshots.push(toSnapshot(q, idx))

    results.push({
      questionId: q.id,
      position: q.position ?? idx + 1,
      topic: q.topic,
      correct: ok,
      selected: [...selected],
    })
  })

  const total = session.questions.length
  const wrong = total - correctCount
  const scorePct = total > 0 ? Math.round((correctCount / total) * 100) : 0
  const durationMs = Math.max(0, finishedAt - session.startedAt)

  const record: SessionRecord = {
    id: session.id,
    examKey: getExamKey(session.exam.name),
    examName: session.exam.name,
    mode: session.config.mode,
    source: session.config.source,
    startedAt: session.startedAt,
    finishedAt,
    total,
    correct: correctCount,
    wrong,
    scorePct,
    durationMs,
    results,
  }

  return { record, missedSnapshots }
}

/** Records a completed quiz session idempotently (deduplicated by session.id). */
export function recordCompletedSession(session: QuizSession, finishedAt = Date.now()): {
  store: AnalyticsStore
  examHistory: ExamHistoryData
  record: SessionRecord
  previousSession: SessionRecord | null
} {
  const store = loadAnalytics()
  const { record, missedSnapshots } = buildSessionRecord(session, finishedAt)
  const existing = store[record.examKey]

  const snapshots: Record<number, QuestionSnapshot> = { ...(existing?.snapshots ?? {}) }
  for (const snap of missedSnapshots) {
    snapshots[snap.id] = snap
  }

  const prevSessions = existing?.sessions ?? []
  const alreadySavedIdx = prevSessions.findIndex(s => s.id === record.id)
  const sessions = alreadySavedIdx >= 0
    ? prevSessions
    : [...prevSessions, record].slice(-MAX_SESSIONS_PER_EXAM)

  const previousSession = sessions.length >= 2
    ? sessions[sessions.length - 2]
    : null

  const examHistory: ExamHistoryData = {
    examKey: record.examKey,
    examName: record.examName,
    sessions,
    snapshots,
    updatedAt: finishedAt,
  }

  const nextStore: AnalyticsStore = {
    ...store,
    [record.examKey]: examHistory,
  }
  saveAnalytics(nextStore)

  return { store: nextStore, examHistory, record, previousSession }
}

export function deleteSessionFromHistory(examKey: string, sessionId: string): AnalyticsStore {
  const store = loadAnalytics()
  const existing = store[examKey]
  if (!existing) return store

  const sessions = existing.sessions.filter(s => s.id !== sessionId)
  if (sessions.length === 0) {
    const next = { ...store }
    delete next[examKey]
    saveAnalytics(next)
    return next
  }

  const next: AnalyticsStore = {
    ...store,
    [examKey]: {
      ...existing,
      sessions,
      updatedAt: Date.now(),
    },
  }
  saveAnalytics(next)
  return next
}

export function deleteExamHistory(examKey: string): AnalyticsStore {
  const store = loadAnalytics()
  const next = { ...store }
  delete next[examKey]
  saveAnalytics(next)
  return next
}

export function compareWithPrevious(
  current: SessionRecord,
  previous: SessionRecord,
  snapshots: Record<number, QuestionSnapshot>,
): SessionComparison {
  const prevById = new Map(previous.results.map(r => [r.questionId, r]))
  const items: CommonQuestionComparison[] = []

  let commonWrongCount = 0
  let improvedCount = 0
  let repeatedErrorCount = 0
  let regressedCount = 0

  for (const currRes of current.results) {
    const prevRes = prevById.get(currRes.questionId)
    if (!prevRes) continue

    let status: CommonQuestionComparison['status']
    if (!prevRes.correct && currRes.correct) {
      status = 'improved'
      improvedCount++
    } else if (!prevRes.correct && !currRes.correct) {
      status = 'repeated_error'
      repeatedErrorCount++
      commonWrongCount++
    } else if (prevRes.correct && !currRes.correct) {
      status = 'regressed'
      regressedCount++
      commonWrongCount++
    } else {
      status = 'maintained'
    }

    items.push({
      questionId: currRes.questionId,
      position: currRes.position,
      topic: currRes.topic,
      currentResult: currRes,
      previousResult: prevRes,
      status,
      snapshot: snapshots[currRes.questionId],
    })
  }

  const commonCount = items.length
  const commonWrongPct = commonCount > 0 ? Math.round((commonWrongCount / commonCount) * 100) : 0

  return {
    previousSession: previous,
    scoreDelta: current.scorePct - previous.scorePct,
    commonCount,
    commonWrongCount,
    commonWrongPct,
    improvedCount,
    repeatedErrorCount,
    regressedCount,
    items,
  }
}

export function computeQuestionStats(
  sessions: SessionRecord[],
  snapshots: Record<number, QuestionSnapshot>,
): QuestionAggregateStat[] {
  const map = new Map<number, {
    questionId: number
    position: number
    topic: number
    attempts: number
    wrongCount: number
    correctCount: number
    consecutiveWrong: number
    lastWrong: boolean
    lastAttemptAt: number
  }>()

  for (const session of sessions) {
    for (const r of session.results) {
      let entry = map.get(r.questionId)
      if (!entry) {
        entry = {
          questionId: r.questionId,
          position: r.position,
          topic: r.topic,
          attempts: 0,
          wrongCount: 0,
          correctCount: 0,
          consecutiveWrong: 0,
          lastWrong: false,
          lastAttemptAt: session.finishedAt,
        }
        map.set(r.questionId, entry)
      }

      entry.attempts++
      entry.position = r.position || entry.position
      entry.lastAttemptAt = session.finishedAt

      if (r.correct) {
        entry.correctCount++
        entry.consecutiveWrong = 0
        entry.lastWrong = false
      } else {
        entry.wrongCount++
        entry.consecutiveWrong++
        entry.lastWrong = true
      }
    }
  }

  const stats: QuestionAggregateStat[] = []
  for (const entry of map.values()) {
    if (entry.wrongCount === 0) continue
    stats.push({
      questionId: entry.questionId,
      position: entry.position,
      topic: entry.topic,
      attempts: entry.attempts,
      wrongCount: entry.wrongCount,
      correctCount: entry.correctCount,
      errorRate: entry.wrongCount / entry.attempts,
      consecutiveWrong: entry.consecutiveWrong,
      lastWrong: entry.lastWrong,
      lastAttemptAt: entry.lastAttemptAt,
      snapshot: snapshots[entry.questionId],
    })
  }

  stats.sort((a, b) => {
    if (b.wrongCount !== a.wrongCount) return b.wrongCount - a.wrongCount
    if (b.errorRate !== a.errorRate) return b.errorRate - a.errorRate
    return b.lastAttemptAt - a.lastAttemptAt
  })

  return stats
}
