export type Category = 'verbe' | 'adjectif' | 'nom' | 'mot_lien'

export type Playlist = 'connu' | 'a_retenir' | 'pas_connu' | null

export type VerbTense =
  | 'infinitif'
  | 'present'
  | 'passe_compose'
  | 'imparfait'
  | 'futur'
  | 'imperatif'

export interface VerbExample {
  tense: VerbTense
  label: string
  french: string
  russian: string
}

export interface VocabCard {
  id: string
  french: string
  russian: string
  category: Category
  theme?: string
  examples?: VerbExample[]
}

export const CATEGORY_LABELS: Record<Category, string> = {
  verbe: 'Verbes',
  adjectif: 'Adjectifs',
  nom: 'Noms',
  mot_lien: 'Mots de liaison',
}

export const PLAYLIST_LABELS: Record<Exclude<Playlist, null>, string> = {
  connu: 'Connu',
  a_retenir: 'À retenir',
  pas_connu: 'Pas connu',
}

export const TENSE_LABELS: Record<VerbTense, string> = {
  infinitif: 'Infinitif',
  present: 'Présent',
  passe_compose: 'Passé composé',
  imparfait: 'Imparfait',
  futur: 'Futur',
  imperatif: 'Impératif',
}

export const ALL_TENSES: VerbTense[] = [
  'infinitif',
  'present',
  'passe_compose',
  'imparfait',
  'futur',
  'imperatif',
]
