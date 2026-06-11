import { nanoid } from "nanoid"

const PLAYER_ID_KEY = "valoreta_player_id"
const PLAYER_NAME_KEY = "valoreta_player_name"

export function getPlayerId(): string {
  let id = sessionStorage.getItem(PLAYER_ID_KEY)
  if (!id) {
    id = nanoid(12)
    sessionStorage.setItem(PLAYER_ID_KEY, id)
  }
  return id
}

export function getPlayerName(): string {
  return sessionStorage.getItem(PLAYER_NAME_KEY) || ""
}

export function setPlayerName(name: string): void {
  sessionStorage.setItem(PLAYER_NAME_KEY, name)
}

export function clearPlayerName(): void {
  sessionStorage.removeItem(PLAYER_NAME_KEY)
}

export function generateNewPlayerId(): string {
  const id = nanoid(12)
  sessionStorage.setItem(PLAYER_ID_KEY, id)
  return id
}
