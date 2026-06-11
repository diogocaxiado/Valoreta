import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { createRoom, joinRoom, rejoinRoom } from "../services/roomService"
import { validateRoomAccess, type RoomAccessError } from "../services/roomValidation"
import { hashPassword, verifyPassword } from "../lib/hash"
import {
  getPlayerId,
  getPlayerName,
  setPlayerName,
} from "../services/playerSession"

export type RoomAccessStep =
  | { phase: "idle" }
  | { phase: "checking_room" }
  | { phase: "name_prompt"; roomId: string; playerId: string }
  | { phase: "password_prompt"; roomId: string; playerId: string; error?: string }
  | { phase: "joining" }
  | { phase: "error"; error: RoomAccessError }
  | { phase: "success" }

export function useRoomAccess() {
  const navigate = useNavigate()
  const [step, setStep] = useState<RoomAccessStep>({ phase: "idle" })
  const [loading, setLoading] = useState(false)

  const handleCreateRoom = useCallback(
    async (playerName: string, password: string) => {
      setLoading(true)
      try {
        const roomId = crypto.randomUUID().slice(0, 8)
        const hostId = getPlayerId()
        setPlayerName(playerName)
        const passwordHash = password ? await hashPassword(password) : ""

        await createRoom({ roomId, hostId, hostName: playerName, passwordHash })

        navigate(`/room/${roomId}`)
      } catch {
        setStep({
          phase: "error",
          error: {
            code: "ROOM_NOT_FOUND",
            message: "Erro ao criar sala. Tente novamente.",
          },
        })
      } finally {
        setLoading(false)
      }
    },
    [navigate]
  )

  const handleJoinRoom = useCallback(
    async (roomId: string) => {
      setLoading(true)
      setStep({ phase: "checking_room" })

      try {
        const playerId = getPlayerId()
        const validation = await validateRoomAccess(roomId, playerId)

        if (!validation.valid) {
          setStep({ phase: "error", error: validation.error! })
          return
        }

        if (validation.alreadyInRoom) {
          const playerName = getPlayerName()
          if (playerName) {
            await rejoinRoom(roomId, playerId, playerName)
          }
          setStep({ phase: "success" })
          navigate(`/room/${roomId}`)
          return
        }

        if (validation.hasPassword) {
          setStep({
            phase: "password_prompt",
            roomId,
            playerId,
          })
          return
        }

        setStep({
          phase: "name_prompt",
          roomId,
          playerId,
        })
      } catch {
        setStep({
          phase: "error",
          error: {
            code: "ROOM_NOT_FOUND",
            message: "Erro ao conectar com a sala. Verifique o código e tente novamente.",
          },
        })
      } finally {
        setLoading(false)
      }
    },
    [navigate]
  )

  const handleNameSubmit = useCallback(
    async (roomId: string, playerId: string, playerName: string) => {
      setLoading(true)
      try {
        setPlayerName(playerName)
        setStep({ phase: "joining" })
        await joinRoom({ roomId, playerId, playerName })
        setStep({ phase: "success" })
        navigate(`/room/${roomId}`)
      } catch {
        setStep({
          phase: "name_prompt",
          roomId,
          playerId,
        })
      } finally {
        setLoading(false)
      }
    },
    [navigate]
  )

  const handlePasswordSubmit = useCallback(
    async (
      roomId: string,
      playerId: string,
      playerName: string,
      inputPassword: string
    ) => {
      setLoading(true)
      try {
        const validation = await validateRoomAccess(roomId)
        if (!validation.valid || !validation.data) {
          setStep({ phase: "error", error: validation.error! })
          return
        }

        const storedHash = validation.data.password || ""
        const valid = await verifyPassword(inputPassword, storedHash)

        if (!valid) {
          setStep({
            phase: "password_prompt",
            roomId,
            playerId,
            error: "Senha incorreta. Verifique a senha informada e tente novamente.",
          })
          return
        }

        setPlayerName(playerName)
        setStep({ phase: "joining" })
        await joinRoom({ roomId, playerId, playerName })
        setStep({ phase: "success" })
        navigate(`/room/${roomId}`)
      } catch {
        setStep({
          phase: "password_prompt",
          roomId,
          playerId,
          error: "Erro ao validar senha. Tente novamente.",
        })
      } finally {
        setLoading(false)
      }
    },
    [navigate]
  )

  const reset = useCallback(() => {
    setStep({ phase: "idle" })
    setLoading(false)
  }, [])

  return {
    step,
    loading,
    handleCreateRoom,
    handleJoinRoom,
    handleNameSubmit,
    handlePasswordSubmit,
    reset,
  }
}
