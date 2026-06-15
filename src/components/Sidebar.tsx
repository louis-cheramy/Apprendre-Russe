import type { Category, Playlist } from '../types'
import { CATEGORY_LABELS, PLAYLIST_LABELS } from '../types'

type View = 'study' | 'playlist'
type NavFocus = 'tab' | 'list'

interface SidebarProps {
  view: View
  navFocus: NavFocus
  selectedCategory: Category | 'all'
  onCategoryChange: (cat: Category | 'all') => void
  selectedPlaylist: Exclude<Playlist, null> | null
  onPlaylistChange: (pl: Exclude<Playlist, null> | null) => void
  onViewChange: (view: View) => void
  counts: { connu: number; a_retenir: number; pas_connu: number }
  categoryCounts: Record<Category, number>
  totalCards: number
  currentIndex: number
  filteredTotal: number
}

export function Sidebar({
  view,
  navFocus,
  selectedCategory,
  onCategoryChange,
  selectedPlaylist,
  onPlaylistChange,
  onViewChange,
  counts,
  categoryCounts,
  totalCards,
  currentIndex,
  filteredTotal,
}: SidebarProps) {
  const categories: (Category | 'all')[] = ['all', 'verbe', 'adjectif', 'nom', 'mot_lien']
  const playlists: Exclude<Playlist, null>[] = ['connu', 'a_retenir', 'pas_connu']

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="app-title">Russe Apprendre</h1>
        <p className="app-subtitle">Flashcards FR → RU</p>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-tab ${view === 'study' ? 'active' : ''} ${navFocus === 'tab' && view === 'study' ? 'keyboard-focus' : ''}`}
          onClick={() => onViewChange('study')}
        >
          Étudier
        </button>
        <button
          className={`nav-tab ${view === 'playlist' ? 'active' : ''} ${navFocus === 'tab' && view === 'playlist' ? 'keyboard-focus' : ''}`}
          onClick={() => onViewChange('playlist')}
        >
          Playlists
        </button>
      </nav>

      {view === 'study' && (
        <section className="sidebar-section">
          <h2 className="section-title">Thèmes</h2>
          <ul className="category-list">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  className={`category-btn ${selectedCategory === cat ? 'active' : ''} ${navFocus === 'list' && selectedCategory === cat ? 'keyboard-focus' : ''}`}
                  onClick={() => onCategoryChange(cat)}
                >
                  <span>
                    {cat === 'all' ? 'Tous' : CATEGORY_LABELS[cat]}
                  </span>
                  <span className="count-badge">
                    {cat === 'all' ? totalCards : categoryCounts[cat]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {view === 'playlist' && (
        <section className="sidebar-section">
          <h2 className="section-title">Mes playlists</h2>
          <ul className="category-list">
            {playlists.map((pl) => (
              <li key={pl}>
                <button
                  className={`category-btn playlist-${pl} ${selectedPlaylist === pl ? 'active' : ''} ${navFocus === 'list' && selectedPlaylist === pl ? 'keyboard-focus' : ''}`}
                  onClick={() => onPlaylistChange(pl)}
                >
                  <span>{PLAYLIST_LABELS[pl]}</span>
                  <span className="count-badge">{counts[pl]}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="sidebar-footer">
        <div className="progress-info">
          <span>
            Carte {filteredTotal > 0 ? currentIndex + 1 : 0} / {filteredTotal}
          </span>
        </div>
        <div className="shortcuts">
          <p className="shortcuts-title">Raccourcis</p>
          <ul>
            <li><kbd>Espace</kbd> Retourner</li>
            <li><kbd>↑</kbd> <kbd>↓</kbd> Thèmes / Playlists</li>
            <li><kbd>←</kbd> <kbd>→</kbd> Onglets ou cartes</li>
            <li><kbd>E</kbd> Écoute passive</li>
            <li><kbd>V</kbd> Prononcer</li>
            <li><kbd>W</kbd> Connu · <kbd>X</kbd> À retenir · <kbd>C</kbd> Pas connu</li>
          </ul>
        </div>
      </div>
    </aside>
  )
}
