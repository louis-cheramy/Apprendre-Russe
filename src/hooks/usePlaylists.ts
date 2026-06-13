import { useState, useEffect, useCallback } from 'react'
import type { Playlist } from '../types'

const STORAGE_KEY = 'russe-apprendre-playlists'

type PlaylistMap = Record<string, Playlist>

function loadPlaylists(): PlaylistMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return {}
}

function savePlaylists(map: PlaylistMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<PlaylistMap>(loadPlaylists)

  useEffect(() => {
    savePlaylists(playlists)
  }, [playlists])

  const setCardPlaylist = useCallback((cardId: string, playlist: Playlist) => {
    setPlaylists((prev) => {
      const next = { ...prev }
      if (playlist === null) {
        delete next[cardId]
      } else {
        next[cardId] = playlist
      }
      return next
    })
  }, [])

  const getCardPlaylist = useCallback(
    (cardId: string): Playlist => playlists[cardId] ?? null,
    [playlists]
  )

  const getCardsInPlaylist = useCallback(
    (playlist: Exclude<Playlist, null>): string[] =>
      Object.entries(playlists)
        .filter(([, p]) => p === playlist)
        .map(([id]) => id),
    [playlists]
  )

  const counts = {
    connu: getCardsInPlaylist('connu').length,
    a_retenir: getCardsInPlaylist('a_retenir').length,
    pas_connu: getCardsInPlaylist('pas_connu').length,
  }

  return { playlists, setCardPlaylist, getCardPlaylist, getCardsInPlaylist, counts }
}
