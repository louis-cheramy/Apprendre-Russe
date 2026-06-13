import { useState, useEffect, useMemo, useCallback } from 'react'
import { vocabulary } from './data/vocabulary/index'
import { useSpeech } from './hooks/useSpeech'
import { speechText } from './lib/speech'
import { usePlaylists } from './hooks/usePlaylists'
import { Sidebar } from './components/Sidebar'
import { Flashcard } from './components/Flashcard'
import type { Category, Playlist, VerbTense } from './types'

type View = 'study' | 'playlist'

const STUDY_CATEGORIES: (Category | 'all')[] = ['all', 'verbe', 'adjectif', 'nom', 'mot_lien']

export default function App() {
  const { setCardPlaylist, getCardPlaylist, getCardsInPlaylist, counts } = usePlaylists()
  const { speak } = useSpeech()

  const [view, setView] = useState<View>('study')
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')
  const [selectedPlaylist, setSelectedPlaylist] = useState<Exclude<Playlist, null> | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [selectedTense, setSelectedTense] = useState<VerbTense>('present')

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
    return vocabulary.filter((c) => c.category === selectedCategory)
  }, [view, selectedCategory, selectedPlaylist, getCardsInPlaylist])

  const currentCard = filteredCards[currentIndex] ?? null

  const goNext = useCallback(() => {
    if (filteredCards.length === 0) return
    setIsFlipped(false)
    setCurrentIndex((i) => (i + 1) % filteredCards.length)
  }, [filteredCards.length])

  const goPrev = useCallback(() => {
    if (filteredCards.length === 0) return
    setIsFlipped(false)
    setCurrentIndex((i) => (i - 1 + filteredCards.length) % filteredCards.length)
  }, [filteredCards.length])

  const goCategoryNext = useCallback(() => {
    if (view !== 'study') return
    setSelectedCategory((cat) => {
      const idx = STUDY_CATEGORIES.indexOf(cat)
      return STUDY_CATEGORIES[(idx + 1) % STUDY_CATEGORIES.length]
    })
  }, [view])

  const goCategoryPrev = useCallback(() => {
    if (view !== 'study') return
    setSelectedCategory((cat) => {
      const idx = STUDY_CATEGORIES.indexOf(cat)
      return STUDY_CATEGORIES[(idx - 1 + STUDY_CATEGORIES.length) % STUDY_CATEGORIES.length]
    })
  }, [view])

  const handleFlip = useCallback(() => {
    setIsFlipped((f) => !f)
  }, [])

  const handleSpeak = useCallback(() => {
    if (!currentCard) return
    const text = isFlipped ? currentCard.russian : currentCard.french
    const lang = isFlipped ? 'ru' : 'fr'
    speak(speechText(text), lang)
  }, [currentCard, isFlipped, speak])

  const handleSetPlaylist = useCallback(
    (playlist: Exclude<Playlist, null>) => {
      if (!currentCard) return
      setCardPlaylist(currentCard.id, playlist)
      setTimeout(goNext, 300)
    },
    [currentCard, setCardPlaylist, goNext]
  )

  useEffect(() => {
    setCurrentIndex(0)
    setIsFlipped(false)
  }, [selectedCategory, selectedPlaylist, view])

  useEffect(() => {
    if (currentIndex >= filteredCards.length && filteredCards.length > 0) {
      setCurrentIndex(0)
    }
  }, [currentIndex, filteredCards.length])

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
        goNext()
        return
      }
      if (e.code === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
        return
      }
      if (e.code === 'ArrowUp') {
        e.preventDefault()
        goCategoryPrev()
        return
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault()
        goCategoryNext()
        return
      }
      if (!currentCard) return

      if (key === 'v') {
        e.preventDefault()
        handleSpeak()
      } else if (key === 'w') {
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
    document.addEventListener('keydown', handler, true)
    return () => document.removeEventListener('keydown', handler, true)
  }, [handleFlip, goNext, goPrev, goCategoryNext, goCategoryPrev, handleSpeak, handleSetPlaylist, currentCard])

  return (
    <div className="app">
      <Sidebar
        view={view}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedPlaylist={selectedPlaylist}
        onPlaylistChange={setSelectedPlaylist}
        onViewChange={setView}
        counts={counts}
        categoryCounts={categoryCounts}
        totalCards={vocabulary.length}
        currentIndex={currentIndex}
        filteredTotal={filteredCards.length}
      />

      <main className="main-content">
        {currentCard ? (
          <div className="study-column">
            <Flashcard
              card={currentCard}
              isFlipped={isFlipped}
              onFlip={handleFlip}
              selectedTense={selectedTense}
              onTenseChange={setSelectedTense}
              currentPlaylist={getCardPlaylist(currentCard.id)}
              onSetPlaylist={handleSetPlaylist}
            />

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
