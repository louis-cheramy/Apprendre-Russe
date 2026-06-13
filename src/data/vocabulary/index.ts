import { toCards, toVerbCards } from './helpers'
import { adjectivesData } from './adjectives'
import { nounsData } from './nouns'
import { motsLiensData } from './mots-liens'
import { verbsData } from './verbs'
import type { VocabCard } from '../../types'

const adjectives = toCards(adjectivesData, 'adjectif', 'a')
const nouns = toCards(nounsData, 'nom', 'n')
const motsLiens = toCards(motsLiensData, 'mot_lien', 'm')
const verbs = toVerbCards(verbsData, 0)

export const vocabulary: VocabCard[] = [...verbs, ...adjectives, ...nouns, ...motsLiens]
