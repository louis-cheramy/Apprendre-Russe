import { useEffect, useCallback } from 'react'
import { initSpeechVoices, speakWord, speakWordAsync, type SpeechLang } from '../lib/speech'

export function useSpeech() {
  useEffect(() => {
    initSpeechVoices()
  }, [])

  const speak = useCallback((text: string, lang: SpeechLang) => {
    speakWord(text, lang)
  }, [])

  const speakAsync = useCallback((text: string, lang: SpeechLang) => {
    return speakWordAsync(text, lang)
  }, [])

  return { speak, speakAsync }
}
