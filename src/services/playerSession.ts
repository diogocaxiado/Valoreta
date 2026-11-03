import { nanoid } from "nanoid"

const PLAYER_ID_KEY = "valoreta_player_id"
const PLAYER_NAME_KEY = "valoreta_player_name"

function getStorage(): Storage {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage
    }
  } catch {
    // fallback se localStorage estiver bloqueado
  }
  return sessionStorage
}

export function getPlayerId(): string {
  const storage = getStorage()
  let id: string | null = null

  try {
    id = storage.getItem(PLAYER_ID_KEY)
  } catch {
    // ignora
  }

  // Migração / sincronização: se não encontrou no storage principal mas existe no sessionStorage
  if (!id && typeof window !== "undefined" && window.sessionStorage) {
    try {
      id = window.sessionStorage.getItem(PLAYER_ID_KEY)
      if (id) {
        storage.setItem(PLAYER_ID_KEY, id)
      }
    } catch {
      // ignora
    }
  }

  if (!id) {
    id = nanoid(12)
    try {
      storage.setItem(PLAYER_ID_KEY, id)
    } catch {
      // ignora
    }
  }

  // Mantém espelhado no sessionStorage para retrocompatibilidade
  if (typeof window !== "undefined" && window.sessionStorage) {
    try {
      window.sessionStorage.setItem(PLAYER_ID_KEY, id)
    } catch {
      // ignora
    }
  }

  return id
}

export function getPlayerName(): string {
  const storage = getStorage()
  let name: string | null = null

  try {
    name = storage.getItem(PLAYER_NAME_KEY)
  } catch {
    // ignora
  }

  if (!name && typeof window !== "undefined" && window.sessionStorage) {
    try {
      name = window.sessionStorage.getItem(PLAYER_NAME_KEY)
      if (name) {
        storage.setItem(PLAYER_NAME_KEY, name)
      }
    } catch {
      // ignora
    }
  }

  return name || ""
}

export function setPlayerName(name: string): void {
  const storage = getStorage()
  try {
    storage.setItem(PLAYER_NAME_KEY, name)
  } catch {
    // ignora
  }
  if (typeof window !== "undefined" && window.sessionStorage) {
    try {
      window.sessionStorage.setItem(PLAYER_NAME_KEY, name)
    } catch {
      // ignora
    }
  }
}

export function clearPlayerName(): void {
  const storage = getStorage()
  try {
    storage.removeItem(PLAYER_NAME_KEY)
  } catch {
    // ignora
  }
  if (typeof window !== "undefined" && window.sessionStorage) {
    try {
      window.sessionStorage.removeItem(PLAYER_NAME_KEY)
    } catch {
      // ignora
    }
  }
}

export function generateNewPlayerId(): string {
  const storage = getStorage()
  const id = nanoid(12)
  try {
    storage.setItem(PLAYER_ID_KEY, id)
  } catch {
    // ignora
  }
  if (typeof window !== "undefined" && window.sessionStorage) {
    try {
      window.sessionStorage.setItem(PLAYER_ID_KEY, id)
    } catch {
      // ignora
    }
  }
  return id
}
