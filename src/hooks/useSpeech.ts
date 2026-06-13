import { useEffect, useCallback } from 'react'
import { initSpeechVoices, speakWord, type SpeechLang } from '../lib/speech'

export function useSpeech() {
  useEffect(() => {
    initSpeechVoices()
  }, [])

  const speak = useCallback((text: string, lang: SpeechLang) => {
    speakWord(text, lang)
  }, [])

  return { speak }
}
