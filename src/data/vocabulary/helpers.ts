import type { VerbExample, VocabCard, Category } from '../../types'

export type RawEntry = [french: string, russian: string, theme?: string]

export function makeId(prefix: string, index: number): string {
  return `${prefix}-${String(index + 1).padStart(3, '0')}`
}

export function toCards(entries: RawEntry[], category: Category, idPrefix: string): VocabCard[] {
  return entries.map(([french, russian, theme], i) => ({
    id: makeId(idPrefix, i),
    french,
    russian,
    category,
    ...(theme ? { theme } : {}),
  }))
}

export function basicVerbExamples(
  infinitif: string,
  ruInf: string,
  presentFr: string,
  presentRu: string,
  passeFr: string,
  passeRu: string,
): VerbExample[] {
  return [
    { tense: 'infinitif', label: 'Infinitif', french: `Il faut ${infinitif}.`, russian: `Нужно ${ruInf}.` },
    { tense: 'present', label: 'Présent', french: presentFr, russian: presentRu },
    { tense: 'passe_compose', label: 'Passé composé', french: passeFr, russian: passeRu },
    { tense: 'imparfait', label: 'Imparfait', french: '—', russian: '—' },
    { tense: 'futur', label: 'Futur', french: '—', russian: '—' },
    { tense: 'imperatif', label: 'Impératif', french: '—', russian: '—' },
  ]
}

export type VerbEntry = [french: string, russian: string, theme: string, presentFr: string, presentRu: string, passeFr: string, passeRu: string]

export function toVerbCards(entries: VerbEntry[], startIndex = 0): VocabCard[] {
  return entries.map(([french, russian, theme, pFr, pRu, pcFr, pcRu], i) => ({
    id: makeId('v', startIndex + i),
    french,
    russian,
    category: 'verbe' as const,
    theme,
    examples: basicVerbExamples(
      french.split('/')[0].trim(),
      russian.split('/')[0].trim(),
      pFr,
      pRu,
      pcFr,
      pcRu,
    ),
  }))
}
