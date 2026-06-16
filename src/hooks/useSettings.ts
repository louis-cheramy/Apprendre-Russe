import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'russe-apprendre-settings'

interface AppSettings {
  autoPronounceRussian: boolean
}

const DEFAULT_SETTINGS: AppSettings = {
  autoPronounceRussian: true,
}

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return DEFAULT_SETTINGS
}

function saveSettings(settings: AppSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const toggleAutoPronounceRussian = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      autoPronounceRussian: !prev.autoPronounceRussian,
    }))
  }, [])

  return {
    autoPronounceRussian: settings.autoPronounceRussian,
    toggleAutoPronounceRussian,
  }
}
