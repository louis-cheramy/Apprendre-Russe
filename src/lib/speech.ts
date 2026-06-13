export type SpeechLang = 'fr' | 'ru'

let frVoice: SpeechSynthesisVoice | null = null
let ruVoice: SpeechSynthesisVoice | null = null

function pickVoice(lang: SpeechLang, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const prefix = lang === 'fr' ? 'fr' : 'ru'
  const langVoices = voices.filter((v) => v.lang.toLowerCase().startsWith(prefix))

  const ranked = langVoices.sort((a, b) => {
    const score = (v: SpeechSynthesisVoice) => {
      let s = 0
      const l = v.lang.toLowerCase()
      if (lang === 'fr' && (l === 'fr-fr' || l.startsWith('fr-fr'))) s += 10
      if (lang === 'ru' && (l === 'ru-ru' || l.startsWith('ru-ru'))) s += 10
      if (v.localService) s += 5
      if (!v.name.toLowerCase().includes('google')) s += 2
      return s
    }
    return score(b) - score(a)
  })

  return ranked[0] ?? null
}

export function initSpeechVoices(): void {
  if (!('speechSynthesis' in window)) return

  const load = () => {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length === 0) return
    frVoice = pickVoice('fr', voices)
    ruVoice = pickVoice('ru', voices)
  }

  load()
  window.speechSynthesis.onvoiceschanged = load
}

/** Prend la forme principale d'un mot (avant / ou parenthèses). */
export function speechText(raw: string): string {
  return raw
    .split('/')[0]
    .replace(/\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function speakWord(text: string, lang: SpeechLang): void {
  if (!('speechSynthesis' in window)) return

  const cleaned = speechText(text)
  if (!cleaned) return

  window.speechSynthesis.cancel()

  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0) {
    frVoice = pickVoice('fr', voices)
    ruVoice = pickVoice('ru', voices)
  }

  const utterance = new SpeechSynthesisUtterance(cleaned)
  utterance.lang = lang === 'fr' ? 'fr-FR' : 'ru-RU'
  utterance.rate = lang === 'fr' ? 0.9 : 0.85
  utterance.pitch = 1

  const voice = lang === 'fr' ? frVoice : ruVoice
  if (voice) {
    utterance.voice = voice
  } else {
    utterance.onstart = () => {
      const retry = window.speechSynthesis.getVoices()
      const picked = pickVoice(lang, retry)
      if (picked) utterance.voice = picked
    }
  }

  window.speechSynthesis.speak(utterance)
}

export function isSpeechSupported(): boolean {
  return 'speechSynthesis' in window
}
