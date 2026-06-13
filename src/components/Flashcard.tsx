import { useState } from 'react'
import type { VocabCard, VerbTense, Playlist } from '../types'
import { ALL_TENSES, TENSE_LABELS, CATEGORY_LABELS } from '../types'

interface FlashcardProps {
  card: VocabCard
  isFlipped: boolean
  onFlip: () => void
  selectedTense: VerbTense
  onTenseChange: (tense: VerbTense) => void
  currentPlaylist: Playlist
  onSetPlaylist: (playlist: Exclude<Playlist, null>) => void
}

export function Flashcard({
  card,
  isFlipped,
  onFlip,
  selectedTense,
  onTenseChange,
  currentPlaylist,
  onSetPlaylist,
}: FlashcardProps) {
  const [showTenseMenu, setShowTenseMenu] = useState(false)
  const isVerb = card.category === 'verbe' && card.examples && card.examples.length > 0
  const example = isVerb
    ? card.examples!.find((e) => e.tense === selectedTense)
    : undefined

  return (
    <div className="flashcard-area">
      {isVerb && (
        <div className="tense-bar">
          <button
            className="tense-toggle"
            onClick={() => setShowTenseMenu(!showTenseMenu)}
            title="Choisir le temps du verbe"
          >
            <span className="tense-label">Temps : {TENSE_LABELS[selectedTense]}</span>
            <span className="tense-arrow">{showTenseMenu ? '▲' : '▼'}</span>
          </button>
          {showTenseMenu && (
            <div className="tense-menu">
              {ALL_TENSES.map((t) => (
                <button
                  key={t}
                  className={`tense-option ${t === selectedTense ? 'active' : ''}`}
                  onClick={() => {
                    onTenseChange(t)
                    setShowTenseMenu(false)
                  }}
                >
                  {TENSE_LABELS[t]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div
        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
        onClick={onFlip}
        role="button"
        tabIndex={0}
        aria-label={isFlipped ? 'Retourner la carte' : 'Voir la traduction'}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <span className="card-category">{CATEGORY_LABELS[card.category]}</span>
            {card.theme && <span className="card-theme">{card.theme}</span>}
            <p className="card-word card-word-fr">{card.french}</p>
            <span className="card-hint">Espace · V pour prononcer</span>
          </div>
          <div className="flashcard-back">
            <span className="card-category">{CATEGORY_LABELS[card.category]}</span>
            <p className="card-word card-word-ru">{card.russian}</p>
            <span className="card-hint">W · X · C pour classer · V pour prononcer</span>
          </div>
        </div>
      </div>

      {isVerb && example && example.french !== '—' && (
        <div className="example-sentence">
          <div className="example-header">
            <span className="example-tense-badge">{example.label}</span>
          </div>
          <p className="example-fr">{example.french}</p>
          <p className="example-ru">{example.russian}</p>
        </div>
      )}

      {isFlipped && (
        <div className="playlist-actions">
          <p className="playlist-prompt">Comment connaissez-vous ce mot ?</p>
          <div className="playlist-buttons">
            <button
              className={`playlist-btn connu ${currentPlaylist === 'connu' ? 'selected' : ''}`}
              onClick={() => onSetPlaylist('connu')}
            >
              Connu <kbd className="btn-kbd">W</kbd>
            </button>
            <button
              className={`playlist-btn a-retenir ${currentPlaylist === 'a_retenir' ? 'selected' : ''}`}
              onClick={() => onSetPlaylist('a_retenir')}
            >
              À retenir <kbd className="btn-kbd">X</kbd>
            </button>
            <button
              className={`playlist-btn pas-connu ${currentPlaylist === 'pas_connu' ? 'selected' : ''}`}
              onClick={() => onSetPlaylist('pas_connu')}
            >
              Pas connu <kbd className="btn-kbd">C</kbd>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
