import { useState, useEffect, useRef } from "react"
import {
  subscribeRoomPlayers,
  setupPlayerPresence,
  cancelPresence,
  leaveRoom,
  autoRejoinAtomic,
  type PlayerData,
} from "../services/roomService"
import { getPlayerName } from "../services/playerSession"

export interface PlayerInfo {
  id: string
  name: string
  joinedAt: number
  isHost: boolean
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
          isHost: p.isHost,
        }))
        .sort((a, b) => a.joinedAt - b.joinedAt)

      setPlayers(list)
    })

    return () => {
      unsubscribe()
      cancelPresence(roomId, playerId)
    }
  }, [roomId, playerId])

  const playerCount = players.length

  const currentPlayer = players.find((p) => p.id === playerId)

  return { players, playerCount, isConnected, currentPlayer }
}
