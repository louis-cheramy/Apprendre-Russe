interface SettingsPanelProps {
  autoPronounceRussian: boolean
  onToggleAutoPronounceRussian: () => void
}

export function SettingsPanel({
  autoPronounceRussian,
  onToggleAutoPronounceRussian,
}: SettingsPanelProps) {
  return (
    <div className="settings-panel">
      <h2 className="settings-title">Paramètres</h2>

      <div className="settings-list">
        <div className="setting-row">
          <div className="setting-info">
            <p className="setting-label">Prononciation automatique du russe</p>
            <p className="setting-desc">
              Prononce le mot russe lorsque vous retournez une flashcard (hors écoute passive).
            </p>
          </div>
          <div className="setting-control">
            <button
              type="button"
              className={`setting-toggle ${autoPronounceRussian ? 'on' : 'off'}`}
              onClick={onToggleAutoPronounceRussian}
              aria-pressed={autoPronounceRussian}
              title="Activer / désactiver (S)"
            >
              <span className="setting-toggle-knob" />
            </button>
            <span className="setting-toggle-label">
              {autoPronounceRussian ? 'Activé' : 'Désactivé'}
            </span>
          </div>
        </div>
      </div>

      <p className="settings-hint">
        Raccourci : <kbd>S</kbd> pour activer ou désactiver
      </p>
    </div>
  )
}
