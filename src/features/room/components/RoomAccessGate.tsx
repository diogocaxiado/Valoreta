import { useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "../../../common/components/ui/input"
import { Button } from "../../../common/components/ui/button"
import { validateRoomAccess } from "../../../services/roomValidation"
import { joinRoom, fetchRoomData } from "../../../services/roomService"
import { getPlayerName, setPlayerName } from "../../../services/playerSession"
import { verifyPassword } from "../../../lib/hash"

interface RoomAccessGateProps {
  roomId: string
  playerId: string
  children: ReactNode
}

type GateStep =
  | { phase: "checking" }
  | { phase: "needs_name" }
  | { phase: "needs_password" }
  | { phase: "joining" }
  | { phase: "error"; message: string }
  | { phase: "authorized" }

export function RoomAccessGate({
  roomId,
  playerId,
  children,
}: RoomAccessGateProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState<GateStep>({ phase: "checking" })
  const [nameInput, setNameInput] = useState(getPlayerName())
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState("")

  useEffect(() => {
    let cancelled = false

    async function check() {
      try {
        const validation = await validateRoomAccess(roomId, playerId)

        if (cancelled) return

        if (!validation.valid) {
          const msg = validation.error?.message || "Sala indisponível."
          setStep({ phase: "error", message: msg })
          return
        }

        if (validation.alreadyInRoom) {
          setStep({ phase: "authorized" })
          return
        }

        if (validation.hasPassword) {
          setStep({ phase: "needs_password" })
          return
        }

        const savedName = getPlayerName()
        if (!savedName) {
          setStep({ phase: "needs_name" })
          return
        }

        await joinRoom({ roomId, playerId, playerName: savedName })
        if (!cancelled) setStep({ phase: "authorized" })
      } catch {
        if (!cancelled) {
          setStep({
            phase: "error",
            message: "Erro ao verificar a sala. Tente novamente.",
          })
        }
      }
    }

    check()
    return () => { cancelled = true }
  }, [roomId, playerId])

  async function handleNameSubmit() {
    const name = nameInput.trim()
    if (!name) return
    setPlayerName(name)
    setStep({ phase: "joining" })
    try {
      await joinRoom({ roomId, playerId, playerName: name })
      setStep({ phase: "authorized" })
    } catch {
      setStep({
        phase: "error",
        message: "Erro ao entrar na sala. Tente novamente.",
      })
    }
  }

  async function handlePasswordSubmit() {
    const name = nameInput.trim()
    const password = passwordInput
    if (!name || !password) return

    setStep({ phase: "joining" })
    setPasswordError("")

    try {
      const room = await fetchRoomData(roomId)
      if (!room) {
        setStep({ phase: "error", message: "Sala não encontrada." })
        return
      }

      const storedHash = room.password || ""
      const valid = await verifyPassword(password, storedHash)

      if (!valid) {
        setPasswordError("Senha incorreta.")
        setStep({ phase: "needs_password" })
        return
      }

      setPlayerName(name)
      await joinRoom({ roomId, playerId, playerName: name })
      setStep({ phase: "authorized" })
    } catch {
      setPasswordError("Erro ao validar senha.")
      setStep({ phase: "needs_password" })
    }
  }

  if (step.phase === "checking" || step.phase === "joining") {
    return (
      <main className="flex flex-col justify-center items-center w-screen h-screen bg-black">
        <div className="animate-pulse text-valorant-cyan font-montserrat font-bold text-h2 uppercase tracking-widest">
          {step.phase === "checking" ? "Verificando sala..." : "Entrando..."}
        </div>
      </main>
    )
  }

  if (step.phase === "error") {
    return (
      <main className="flex flex-col justify-center items-center w-screen h-screen bg-black gap-6">
        <h1 className="text-h2 text-valorant-red font-montserrat font-bold uppercase tracking-widest text-center px-4">
          {step.message}
        </h1>
        <Button variant="outline" size="lg" onClick={() => navigate("/")}>
          Voltar ao lobby
        </Button>
      </main>
    )
  }

  if (step.phase === "needs_name") {
    return (
      <main className="flex flex-col justify-center items-center w-screen h-screen bg-black">
        <div className="bg-card text-card-foreground border border-border/50 shadow-lg p-6 w-full max-w-md">
          <div className="flex flex-col gap-4">
            <h2 className="text-h4 font-montserrat font-bold uppercase tracking-widest">
              Entrar na sala
            </h2>
            <p className="text-small text-muted-foreground font-prompt">
              Informe seu nome para entrar na sala.
            </p>
            <Input
              placeholder="Seu nome"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              maxLength={24}
              onKeyDown={(e) => {
                if (e.key === "Enter" && nameInput.trim()) handleNameSubmit()
              }}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => navigate("/")}>
                Cancelar
              </Button>
              <Button
                variant="default"
                onClick={handleNameSubmit}
                disabled={!nameInput.trim()}
              >
                Entrar
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (step.phase === "needs_password") {
    return (
      <main className="flex flex-col justify-center items-center w-screen h-screen bg-black">
        <div className="bg-card text-card-foreground border border-border/50 shadow-lg p-6 w-full max-w-md">
          <div className="flex flex-col gap-4">
            <h2 className="text-h4 font-montserrat font-bold uppercase tracking-widest">
              Sala protegida
            </h2>
            <p className="text-small text-muted-foreground font-prompt">
              Esta sala é protegida por senha. Informe seu nome e a senha.
            </p>
            <Input
              placeholder="Seu nome"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              maxLength={24}
              disabled={step.phase === "joining"}
            />
            <Input
              type="password"
              placeholder="Senha da sala"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              disabled={step.phase === "joining"}
              onKeyDown={(e) => {
                if (e.key === "Enter" && nameInput.trim() && passwordInput) {
                  handlePasswordSubmit()
                }
              }}
            />
            {passwordError && (
              <p className="text-sm text-destructive font-prompt">{passwordError}</p>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => navigate("/")}>
                Cancelar
              </Button>
              <Button
                variant="default"
                onClick={handlePasswordSubmit}
                disabled={!nameInput.trim() || !passwordInput}
              >
                Entrar
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return <>{children}</>
}
