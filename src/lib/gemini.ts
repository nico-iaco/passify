import type { NormalizedQuestion } from '../types'
import type { Lang } from './storage'

// ─── Default model ────────────────────────────────────────────────────────────
// Change this constant (or override at runtime via SettingsModal) if the model
// ID is not available on your API key. Common alternatives:
//   gemini-2.5-flash  |  gemma-3-27b-it  |  gemma-3-12b-it
export const DEFAULT_MODEL = 'gemma-4-31b-it'

// ─── Error types ──────────────────────────────────────────────────────────────

export type GeminiErrorCode = 'no_key' | 'auth' | 'rate_limit' | 'model' | 'network' | 'unknown'

export class GeminiError extends Error {
  constructor(
    public readonly code: GeminiErrorCode,
    message: string,
  ) {
    super(message)
    this.name = 'GeminiError'
  }
}

// ─── API call ─────────────────────────────────────────────────────────────────

interface ExplainParams {
  question: NormalizedQuestion
  lang: Lang
  apiKey: string
  model: string
}

function buildPrompt(question: NormalizedQuestion, lang: Lang): string {
  const optionsText = question.optionKeys
    .map(k => `  ${k}) ${question.options[k]}`)
    .join('\n')
  const correctText = question.answers
    .map(k => `${k}) ${question.options[k] ?? k}`)
    .join(', ')

  if (lang === 'it') {
    return `Sei un tutor esperto per esami di certificazione Google Cloud.
Spiega in italiano, in modo chiaro e conciso (max 200 parole), perché la risposta corretta è quella indicata.
Focalizzati sul "perché" tecnico, non limitarti a ripetere la domanda.

Domanda:
${question.question}

Opzioni:
${optionsText}

Risposta corretta: ${correctText}

Fornisci una spiegazione tecnica che aiuti lo studente a capire il concetto sottostante e a ricordarlo in futuro.`
  }

  return `You are an expert tutor for Google Cloud certification exams.
Explain in English, clearly and concisely (max 200 words), why the correct answer is the one indicated.
Focus on the technical "why", not just restating the question.

Question:
${question.question}

Options:
${optionsText}

Correct answer: ${correctText}

Provide a technical explanation that helps the student understand the underlying concept and remember it in the future.`
}

export async function explainQuestion({
  question,
  lang,
  apiKey,
  model,
}: ExplainParams): Promise<string> {
  if (!apiKey) {
    throw new GeminiError('no_key', 'No API key provided')
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const prompt = buildPrompt(question, lang)

  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    })
  } catch {
    throw new GeminiError('network', 'Network error — check your connection')
  }

  if (!response.ok) {
    const status = response.status
    if (status === 400) throw new GeminiError('model', `Model "${model}" may be unavailable or invalid (400)`)
    if (status === 403 || status === 401) throw new GeminiError('auth', `Invalid API key (${status})`)
    if (status === 429) throw new GeminiError('rate_limit', 'Rate limit exceeded (429)')
    throw new GeminiError('unknown', `Unexpected error (${status})`)
  }

  const data = await response.json()

  // Collect only non-thought parts (thinking models mark reasoning with thought: true)
  const parts: Array<{ text?: string; thought?: boolean }> =
    data?.candidates?.[0]?.content?.parts ?? []
  const text = parts
    .filter(p => !p.thought && typeof p.text === 'string')
    .map(p => p.text as string)
    .join('')

  if (!text) {
    throw new GeminiError('unknown', 'Empty response from model')
  }

  // Strip any inline thinking tags the model may have emitted as plain text
  return text.replace(/<think(?:ing)?>[^]*?<\/think(?:ing)?>/gi, '').trim()
}
