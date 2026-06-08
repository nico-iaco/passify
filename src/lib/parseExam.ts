import type { NormalizedExam, NormalizedQuestion, RawQuestion } from '../types'

function normalizeQuestion(q: RawQuestion): NormalizedQuestion {
  const answers = q.answer.split('').filter(c => /[A-E]/.test(c))
  return {
    id: q.id,
    topic: q.topic,
    question: q.question,
    options: q.options,
    optionKeys: Object.keys(q.options).sort(),
    answers,
    isMulti: answers.length > 1,
    timestamp: q.timestamp,
    url: q.url,
    imageUrls: Array.isArray(q.image_urls) ? q.image_urls : [],
  }
}

export function parseExam(raw: unknown): NormalizedExam {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new Error('Invalid format: root must be a JSON object.')
  }

  const obj = raw as Record<string, unknown>

  if (typeof obj.exam !== 'string' || obj.exam.trim() === '') {
    throw new Error('Invalid format: missing "exam" name field.')
  }

  if (!Array.isArray(obj.questions) || obj.questions.length === 0) {
    throw new Error('Invalid format: "questions" must be a non-empty array.')
  }

  const questions: NormalizedQuestion[] = []

  for (let i = 0; i < obj.questions.length; i++) {
    const q = obj.questions[i] as Record<string, unknown>
    if (
      typeof q.question !== 'string' ||
      typeof q.options !== 'object' ||
      q.options === null ||
      typeof q.answer !== 'string'
    ) {
      throw new Error(`Question at index ${i} is malformed (missing question/options/answer).`)
    }
    questions.push(normalizeQuestion(q as unknown as RawQuestion))
  }

  const topics = Array.from(new Set(questions.map(q => q.topic))).sort((a, b) => a - b)

  return {
    name: obj.exam.trim(),
    questions,
    topics,
  }
}

export async function parseExamFromFile(file: File): Promise<NormalizedExam> {
  const text = await file.text()
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('The file is not valid JSON.')
  }
  return parseExam(parsed)
}

export async function parseExamFromUrl(url: string): Promise<NormalizedExam> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load sample (${res.status})`)
  const parsed: unknown = await res.json()
  return parseExam(parsed)
}
