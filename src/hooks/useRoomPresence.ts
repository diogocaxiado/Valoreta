import { useState, useEffect, useRef } from "react"
import { ref, set } from "firebase/database"
import { db } from "../infra/firebase/config"
import {
  subscribeRoomPlayers,
  setupPlayerPresence,
  cancelPresence,
  leaveRoom,
  fetchRoomData,
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

    const unsubscribe = subscribeRoomPlayers(roomId, (data) => {
      if (!data) {
        setPlayers([])
        return
      }

      const playerExists = !!data[playerId]

      if (!playerExists && !rejoinedOnce.current) {
        rejoinedOnce.current = true
        const playerName = getPlayerName()
        if (playerName) {
          fetchRoomData(roomId).then((room) => {
            const shouldBeHost = room?.hostId === playerId
            set(ref(db, `room/${roomId}/players/${playerId}`), {
              name: playerName,
              joinedAt: Date.now(),
              isHost: shouldBeHost,
            })
          })
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
