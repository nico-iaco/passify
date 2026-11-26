import type { NormalizedQuestion } from '../types'

/** Formats a question and its options cleanly for pasting into an AI assistant or notes. */
export function formatQuestionForCopy(question: NormalizedQuestion): string {
  const optionsBlock = question.optionKeys
    .map(key => `${key}) ${question.options[key]}`)
    .join('\n')
  return `${question.question.trim()}\n\n${optionsBlock}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Fall back to textarea copy below
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}
