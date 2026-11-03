import { useState, useEffect, useRef } from "react"
import {
  subscribeRoomPlayers,
  setupPlayerPresence,
  cancelPresence,
  leaveRoom,
  autoRejoinAtomic,
  touchPlayerPresence,
  type PlayerData,
} from "../services/roomService"
import { getPlayerName } from "../services/playerSession"

export interface PlayerInfo {
  id: string
  name: string
  joinedAt: number
  lastSeen?: number
  isHost: boolean
}

// Contador de abas ativas para o mesmo jogador+sala usando BroadcastChannel
// Isso evita remoção do jogador ao fechar uma aba enquanto outra aba ainda está aberta.
function getActiveTabKey(roomId: string, playerId: string) {
  return `valoreta_tabs_${roomId}_${playerId}`
}

function registerTab(roomId: string, playerId: string): () => void {
  const key = getActiveTabKey(roomId, playerId)

  // Incrementa contador de abas ativas
  const current = parseInt(localStorage.getItem(key) || "0", 10)
  localStorage.setItem(key, String(current + 1))

  return () => {
    const count = parseInt(localStorage.getItem(key) || "1", 10)
    const next = Math.max(0, count - 1)
    localStorage.setItem(key, String(next))
  }
}

function isLastTab(roomId: string, playerId: string): boolean {
  const key = getActiveTabKey(roomId, playerId)
  const count = parseInt(localStorage.getItem(key) || "1", 10)
  return count <= 1
}

export function useRoomPresence(
  roomId: string | undefined,
  playerId: string | undefined
) {
  const [players, setPlayers] = useState<PlayerInfo[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const rejoinedOnce = useRef(false)

  useEffect(() => {
    if (!roomId || !playerId) {
      setPlayers([])
      setIsConnected(false)
      return
    }

    rejoinedOnce.current = false
    setIsConnected(true)
    const presence = setupPlayerPresence(roomId, playerId)

    // Registra esta aba como ativa
    const unregisterTab = registerTab(roomId, playerId)

    // Heartbeat periódico (a cada 15 segundos) para manter presença ativa na sala
    touchPlayerPresence(roomId, playerId)
    const heartbeatInterval = setInterval(() => {
      touchPlayerPresence(roomId, playerId)
    }, 15000)

    // Remove o jogador do Firebase SOMENTE se esta for a última aba aberta
    // para este jogador nesta sala.
    function handleBeforeUnload() {
      if (isLastTab(roomId!, playerId!)) {
        // Usa sendBeacon ou remoção síncrona — a chamada assíncrona pode não completar,
        // mas o mecanismo de lastSeen vai limpar a sala após 60s de inatividade de qualquer forma.
        leaveRoom(roomId!, playerId!).catch(() => {})
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    const unsubscribe = subscribeRoomPlayers(roomId, async (data) => {
      if (!data) {
        setPlayers([])
        return
      }

      const playerExists = !!data[playerId]

      if (!playerExists && !rejoinedOnce.current) {
        rejoinedOnce.current = true
        const playerName = getPlayerName()
        if (playerName) {
          await autoRejoinAtomic(roomId, playerId, playerName)
        }
      }

      const list: PlayerInfo[] = Object.entries(data)
        .map(([id, p]) => ({
          id,
          name: p.name,
          joinedAt: p.joinedAt,
          lastSeen: p.lastSeen,
          isHost: p.isHost,
        }))
        .sort((a, b) => a.joinedAt - b.joinedAt)

      setPlayers(list)
    })

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      clearInterval(heartbeatInterval)
      unsubscribe()
      cancelPresence(roomId, playerId)
      // Decrementa contador de abas ao desmontar (navegação interna)
      unregisterTab()
    }
  }, [roomId, playerId])

  const playerCount = players.length

  const currentPlayer = players.find((p) => p.id === playerId)

  return { players, playerCount, isConnected, currentPlayer }
}
