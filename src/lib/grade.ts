import type { NormalizedQuestion } from '../types'

/** Returns true if selected answers exactly match the correct answers */
export function isCorrect(question: NormalizedQuestion, selected: string[]): boolean {
  if (selected.length !== question.answers.length) return false
  const a = new Set(selected)
  const b = new Set(question.answers)
  if (a.size !== b.size) return false
  for (const key of a) {
    if (!b.has(key)) return false
  }
  return true
}
