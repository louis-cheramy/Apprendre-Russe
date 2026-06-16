import type { AlphabetLetter } from '../data/alphabet'

interface AlphabetFlashcardProps {
  letter: AlphabetLetter
  isFlipped: boolean
  onFlip: () => void
}

export function AlphabetFlashcard({ letter, isFlipped, onFlip }: AlphabetFlashcardProps) {
  return (
    <div className="flashcard-area">
      <div
        className="flashcard"
        onClick={onFlip}
        role="button"
        tabIndex={0}
        aria-label={isFlipped ? 'Retourner la lettre' : 'Voir le symbole API'}
      >
        {!isFlipped ? (
          <div className="flashcard-face flashcard-front">
            <span className="card-category">Alphabet</span>
            <p className="card-word card-word-ru alphabet-letter-display">
              <span className="alphabet-letter-upper">{letter.upper}</span>
              <span className="alphabet-letter-lower">{letter.lower}</span>
            </p>
            <span className="card-hint">Espace · V pour prononcer</span>
          </div>
        ) : (
          <div className="flashcard-face flashcard-back">
            <span className="card-category">API</span>
            <p className="card-word alphabet-ipa-display">
              <span className="alphabet-ipa-bracket">[</span>
              <span className="alphabet-ipa">{letter.ipa}</span>
              <span className="alphabet-ipa-bracket">]</span>
            </p>
            <span className="card-hint">V pour prononcer</span>
          </div>
        )}
      </div>
    </div>
  )
}
