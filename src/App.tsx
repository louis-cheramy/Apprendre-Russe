import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { vocabulary } from './data/vocabulary/index'
import { CYRILLIC_ALPHABET } from './data/alphabet'
import { useSpeech } from './hooks/useSpeech'
import { speechText } from './lib/speech'
import { usePlaylists } from './hooks/usePlaylists'
import { useSettings } from './hooks/useSettings'
import { Sidebar } from './components/Sidebar'
import { Flashcard } from './components/Flashcard'
import { AlphabetFlashcard } from './components/AlphabetFlashcard'
import { SettingsPanel } from './components/SettingsPanel'
import type { Category, Playlist, VerbTense } from './types'

type View = 'study' | 'playlist'
type NavFocus = 'tab' | 'list'
type StudyCategory = Category | 'all' | 'alphabet' | 'settings'

const STUDY_CATEGORIES: StudyCategory[] = ['all', 'verbe', 'adjectif', 'nom', 'mot_lien', 'alphabet', 'settings']
const PLAYLISTS: Exclude<Playlist, null>[] = ['connu', 'a_retenir', 'pas_connu']

export default function App() {
  const { setCardPlaylist, getCardPlaylist, getCardsInPlaylist, counts } = usePlaylists()
  const { autoPronounceRussian, toggleAutoPronounceRussian } = useSettings()
  const { speak, speakAsync } = useSpeech()

  const [view, setView] = useState<View>('study')
  const [navFocus, setNavFocus] = useState<NavFocus>('list')
  const [selectedCategory, setSelectedCategory] = useState<StudyCategory>('all')
  const [selectedPlaylist, setSelectedPlaylist] = useState<Exclude<Playlist, null> | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [selectedTense, setSelectedTense] = useState<VerbTense>('present')
  const [passiveListening, setPassiveListening] = useState(false)
  const passiveListeningRef = useRef(false)
  const passiveManualPauseRef = useRef(false)
  const passiveResumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [passiveResumeToken, setPassiveResumeToken] = useState(0)

  const isAlphabetMode = view === 'study' && selectedCategory === 'alphabet'
  const isSettingsMode = view === 'study' && selectedCategory === 'settings'

  const categoryCounts = useMemo(() => {
    const c: Record<Category, number> = { verbe: 0, adjectif: 0, nom: 0, mot_lien: 0 }
    vocabulary.forEach((card) => c[card.category]++)
    return c
  }, [])

  const filteredCards = useMemo(() => {
    if (view === 'playlist' && selectedPlaylist) {
      const ids = new Set(getCardsInPlaylist(selectedPlaylist))
      return vocabulary.filter((c) => ids.has(c.id))
    }
    if (selectedCategory === 'all') return vocabulary
    if (selectedCategory === 'alphabet') return []
    if (selectedCategory === 'settings') return []
    return vocabulary.filter((c) => c.category === selectedCategory)
  }, [view, selectedCategory, selectedPlaylist, getCardsInPlaylist])

  const displayTotal = isAlphabetMode ? CYRILLIC_ALPHABET.length : filteredCards.length
  const currentCard = !isAlphabetMode ? (filteredCards[currentIndex] ?? null) : null
  const currentLetter = isAlphabetMode ? (CYRILLIC_ALPHABET[currentIndex] ?? null) : null
  const hasContent = isAlphabetMode ? currentLetter !== null : currentCard !== null

  const schedulePassiveResume = useCallback(() => {
    if (!passiveListeningRef.current) return

    passiveManualPauseRef.current = true
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }

    if (passiveResumeTimeoutRef.current) {
      clearTimeout(passiveResumeTimeoutRef.current)
    }

    passiveResumeTimeoutRef.current = setTimeout(() => {
      passiveManualPauseRef.current = false
      passiveResumeTimeoutRef.current = null
      if (passiveListeningRef.current) {
        setPassiveResumeToken((t) => t + 1)
      }
    }, 1000)
  }, [])

  const goNext = useCallback(() => {
    if (displayTotal === 0) return
    setIsFlipped(false)
    setCurrentIndex((i) => (i + 1) % displayTotal)
    schedulePassiveResume()
  }, [displayTotal, schedulePassiveResume])

  const goPrev = useCallback(() => {
    if (displayTotal === 0) return
    setIsFlipped(false)
    setCurrentIndex((i) => (i - 1 + displayTotal) % displayTotal)
    schedulePassiveResume()
  }, [displayTotal, schedulePassiveResume])

  const goCategoryNext = useCallback(() => {
    setSelectedCategory((cat) => {
      const idx = STUDY_CATEGORIES.indexOf(cat)
      return STUDY_CATEGORIES[(idx + 1) % STUDY_CATEGORIES.length]
    })
  }, [])

  const goCategoryPrev = useCallback(() => {
    setSelectedCategory((cat) => {
      const idx = STUDY_CATEGORIES.indexOf(cat)
      return STUDY_CATEGORIES[(idx - 1 + STUDY_CATEGORIES.length) % STUDY_CATEGORIES.length]
    })
  }, [])

  const goPlaylistNext = useCallback(() => {
    setSelectedPlaylist((pl) => {
      const current = pl ?? PLAYLISTS[0]
      const idx = PLAYLISTS.indexOf(current)
      return PLAYLISTS[(idx + 1) % PLAYLISTS.length]
    })
  }, [])

  const goPlaylistPrev = useCallback(() => {
    setSelectedPlaylist((pl) => {
      const current = pl ?? PLAYLISTS[0]
      const idx = PLAYLISTS.indexOf(current)
      return PLAYLISTS[(idx - 1 + PLAYLISTS.length) % PLAYLISTS.length]
    })
  }, [])

  const switchToStudy = useCallback(() => {
    setView('study')
    setSelectedPlaylist(null)
  }, [])

  const switchToPlaylist = useCallback(() => {
    setView('playlist')
  }, [])

  const switchTab = useCallback(() => {
    if (view === 'study') switchToPlaylist()
    else switchToStudy()
  }, [view, switchToStudy, switchToPlaylist])

  const enterList = useCallback(() => {
    setNavFocus('list')
    if (view === 'study') {
      setSelectedCategory(STUDY_CATEGORIES[0])
    } else {
      setSelectedPlaylist(PLAYLISTS[0])
    }
  }, [view])

  const exitListToTab = useCallback(() => {
    setNavFocus('tab')
  }, [])

  const handleFlip = useCallback(() => {
    if (isSettingsMode) return
    setIsFlipped((f) => {
      const next = !f
      if (next && !passiveListeningRef.current) {
        if (isAlphabetMode && currentLetter) {
          speak(currentLetter.speak, 'ru')
        } else if (autoPronounceRussian && currentCard) {
          speak(speechText(currentCard.russian), 'ru')
        }
      }
      return next
    })
  }, [isSettingsMode, isAlphabetMode, currentLetter, currentCard, autoPronounceRussian, speak])

  const handleSpeak = useCallback(() => {
    if (isAlphabetMode && currentLetter) {
      speak(currentLetter.speak, 'ru')
      return
    }
    if (!currentCard) return
    const text = isFlipped ? currentCard.russian : currentCard.french
    const lang = isFlipped ? 'ru' : 'fr'
    speak(speechText(text), lang)
  }, [isAlphabetMode, currentLetter, currentCard, isFlipped, speak])

  const handleSetPlaylist = useCallback(
    (playlist: Exclude<Playlist, null>) => {
      if (!currentCard) return
      setCardPlaylist(currentCard.id, playlist)
      setTimeout(goNext, 300)
    },
    [currentCard, setCardPlaylist, goNext]
  )

  const togglePassiveListening = useCallback(() => {
    setPassiveListening((active) => {
      const next = !active
      passiveListeningRef.current = next
      if (!next) {
        passiveManualPauseRef.current = false
        if (passiveResumeTimeoutRef.current) {
          clearTimeout(passiveResumeTimeoutRef.current)
          passiveResumeTimeoutRef.current = null
        }
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel()
        }
      }
      return next
    })
  }, [])

  useEffect(() => {
    passiveListeningRef.current = passiveListening
  }, [passiveListening])

  useEffect(() => {
    if (!passiveListening || passiveManualPauseRef.current) return

    let cancelled = false

    const run = async () => {
      if (isAlphabetMode && currentLetter) {
        setIsFlipped(false)
        await speakAsync(currentLetter.speak, 'ru')
        if (cancelled || !passiveListeningRef.current) return
        await speakAsync(currentLetter.speak, 'ru')
        if (cancelled || !passiveListeningRef.current) return

        const nextIndex = currentIndex + 1
        setCurrentIndex(nextIndex >= CYRILLIC_ALPHABET.length ? 0 : nextIndex)
        return
      }

      if (!currentCard || filteredCards.length === 0) return

      setIsFlipped(false)
      await speakAsync(speechText(currentCard.french), 'fr')
      if (cancelled || !passiveListeningRef.current) return
      await speakAsync(speechText(currentCard.russian), 'ru')
      if (cancelled || !passiveListeningRef.current) return

      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex >= filteredCards.length ? 0 : nextIndex)
    }

    run()

    return () => {
      cancelled = true
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [
    passiveListening,
    passiveResumeToken,
    currentIndex,
    currentCard,
    currentLetter,
    filteredCards.length,
    isAlphabetMode,
    speakAsync,
  ])

  useEffect(() => {
    setCurrentIndex(0)
    setIsFlipped(false)
    passiveManualPauseRef.current = false
    if (passiveResumeTimeoutRef.current) {
      clearTimeout(passiveResumeTimeoutRef.current)
      passiveResumeTimeoutRef.current = null
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    if (selectedCategory === 'settings') {
      setPassiveListening(false)
      passiveListeningRef.current = false
    }
  }, [selectedCategory, selectedPlaylist, view])

  useEffect(() => {
    return () => {
      if (passiveResumeTimeoutRef.current) {
        clearTimeout(passiveResumeTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (currentIndex >= displayTotal && displayTotal > 0) {
      setCurrentIndex(0)
    }
  }, [currentIndex, displayTotal])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.ctrlKey || e.altKey || e.metaKey) return

      const key = e.key.toLowerCase()

      if (e.code === 'Space') {
        e.preventDefault()
        handleFlip()
        return
      }
      if (e.code === 'ArrowRight') {
        e.preventDefault()
        if (navFocus === 'tab') switchTab()
        else goNext()
        return
      }
      if (e.code === 'ArrowLeft') {
        e.preventDefault()
        if (navFocus === 'tab') switchTab()
        else goPrev()
        return
      }
      if (e.code === 'ArrowUp') {
        e.preventDefault()
        if (navFocus === 'tab') return
        if (view === 'study') {
          if (selectedCategory === STUDY_CATEGORIES[0]) exitListToTab()
          else goCategoryPrev()
        } else if (selectedPlaylist === PLAYLISTS[0] || !selectedPlaylist) {
          exitListToTab()
        } else {
          goPlaylistPrev()
        }
        return
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault()
        if (navFocus === 'tab') enterList()
        else if (view === 'study') goCategoryNext()
        else goPlaylistNext()
        return
      }

      if (key === 'e') {
        e.preventDefault()
        togglePassiveListening()
        return
      }

      if (key === 's') {
        e.preventDefault()
        toggleAutoPronounceRussian()
        return
      }

      if (isSettingsMode) return

      if (!hasContent) return

      if (key === 'v') {
        e.preventDefault()
        handleSpeak()
      } else if (!isAlphabetMode && currentCard) {
        if (key === 'w') {
          e.preventDefault()
          handleSetPlaylist('connu')
        } else if (key === 'x') {
          e.preventDefault()
          handleSetPlaylist('a_retenir')
        } else if (key === 'c') {
          e.preventDefault()
          handleSetPlaylist('pas_connu')
        }
      }
    }
    document.addEventListener('keydown', handler, true)
    return () => document.removeEventListener('keydown', handler, true)
  }, [
    handleFlip,
    goNext,
    goPrev,
    goCategoryNext,
    goCategoryPrev,
    goPlaylistNext,
    goPlaylistPrev,
    switchTab,
    enterList,
    exitListToTab,
    handleSpeak,
    handleSetPlaylist,
    togglePassiveListening,
    toggleAutoPronounceRussian,
    isSettingsMode,
    currentCard,
    hasContent,
    isAlphabetMode,
    view,
    navFocus,
    selectedCategory,
    selectedPlaylist,
  ])

  return (
    <div className="app">
      <Sidebar
        view={view}
        navFocus={navFocus}
        selectedCategory={selectedCategory}
        onCategoryChange={(cat) => {
          setSelectedCategory(cat)
          setNavFocus('list')
        }}
        selectedPlaylist={selectedPlaylist}
        onPlaylistChange={(pl) => {
          setSelectedPlaylist(pl)
          setNavFocus('list')
        }}
        onViewChange={(v) => {
          setView(v)
          setNavFocus('tab')
          if (v === 'study') setSelectedPlaylist(null)
        }}
        counts={counts}
        categoryCounts={categoryCounts}
        totalCards={vocabulary.length}
        alphabetCount={CYRILLIC_ALPHABET.length}
        currentIndex={currentIndex}
        filteredTotal={isSettingsMode ? 0 : displayTotal}
        isSettingsMode={isSettingsMode}
      />

      <main className="main-content">
        {isSettingsMode ? (
          <SettingsPanel
            autoPronounceRussian={autoPronounceRussian}
            onToggleAutoPronounceRussian={toggleAutoPronounceRussian}
          />
        ) : hasContent ? (
          <div className="study-column">
            <button
              className={`passive-listen-btn ${passiveListening ? 'active' : ''}`}
              onClick={togglePassiveListening}
              title="Écoute passive (E)"
            >
              Écoute passive <kbd className="btn-kbd">E</kbd>
            </button>

            {isAlphabetMode && currentLetter ? (
              <AlphabetFlashcard
                letter={currentLetter}
                isFlipped={isFlipped}
                onFlip={handleFlip}
              />
            ) : currentCard ? (
              <Flashcard
                card={currentCard}
                isFlipped={isFlipped}
                onFlip={handleFlip}
                selectedTense={selectedTense}
                onTenseChange={setSelectedTense}
                currentPlaylist={getCardPlaylist(currentCard.id)}
                onSetPlaylist={handleSetPlaylist}
              />
            ) : null}

            <div className="nav-controls">
              <button className="nav-btn" onClick={goPrev} title="Carte précédente (←)">
                Précédent
              </button>
              <button className="nav-btn speak-btn" onClick={handleSpeak} title="Prononcer (V)">
                Prononcer
              </button>
              <button className="nav-btn flip-btn" onClick={handleFlip} title="Retourner (Espace)">
                Retourner
              </button>
              <button className="nav-btn" onClick={goNext} title="Carte suivante (→)">
                Suivant
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            {view === 'playlist' && !selectedPlaylist ? (
              <p>Sélectionnez une playlist pour revoir vos cartes.</p>
            ) : view === 'playlist' && selectedPlaylist ? (
              <>
                <p>Cette playlist est vide.</p>
                <p className="empty-hint">Étudiez des cartes et classez-les pour les retrouver ici.</p>
              </>
            ) : (
              <p>Aucune carte dans cette catégorie.</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
