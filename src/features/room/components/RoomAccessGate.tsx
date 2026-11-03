import { useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "../../../common/components/ui/input"
import { Button } from "../../../common/components/ui/button"
import { validateRoomAccess } from "../../../services/roomValidation"
import { joinRoomAtomic, fetchRoomData, RoomFullError, RoomNotFoundError } from "../../../services/roomService"
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
  | { phase: "error"; title: string; description?: string }
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
  const [isJoining, setIsJoining] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function check() {
      try {
        const validation = await validateRoomAccess(roomId, playerId)

        if (cancelled) return

        if (!validation.valid) {
          const msg = validation.error?.message || "Sala indisponível."
          setStep({ phase: "error", title: msg })
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

        await joinRoomAtomic({ roomId, playerId, playerName: savedName })
        if (!cancelled) setStep({ phase: "authorized" })
      } catch (err) {
        if (cancelled) return
        if (err instanceof RoomFullError) {
          setStep({
            phase: "error",
            title: `Sala cheia (${err.current}/${err.max})`,
            description: "Aguarde a saída de um participante ou entre em outra sala.",
          })
          return
        }
        if (err instanceof RoomNotFoundError) {
          setStep({
            phase: "error",
            title: "Sala não encontrada",
            description: "Verifique o código e tente novamente.",
          })
          return
        }
        setStep({
          phase: "error",
          title: "Erro ao verificar a sala",
          description: "Tente novamente.",
        })
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
      await joinRoomAtomic({ roomId, playerId, playerName: name })
      setStep({ phase: "authorized" })
    } catch (err) {
      if (err instanceof RoomFullError) {
        setStep({
          phase: "error",
          title: `Sala cheia (${err.current}/${err.max})`,
          description: "Aguarde a saída de um participante ou entre em outra sala.",
        })
        return
      }
      setStep({
        phase: "error",
        title: "Erro ao entrar na sala",
        description: "Tente novamente.",
      })
    }
  }

  async function handlePasswordSubmit() {
    const name = nameInput.trim()
    const password = passwordInput
    if (!name || !password) return

    setIsJoining(true)
    setStep({ phase: "joining" })
    setPasswordError("")

    try {
      const room = await fetchRoomData(roomId)
      if (!room) {
        setStep({ phase: "error", title: "Sala não encontrada" })
        return
      }

      const storedHash = room.password || ""
      const valid = await verifyPassword(password, storedHash)

      if (!valid) {
        setPasswordError("Senha incorreta.")
        setStep({ phase: "needs_password" })
        setIsJoining(false)
        return
      }

      setPlayerName(name)
      await joinRoomAtomic({ roomId, playerId, playerName: name })
      setStep({ phase: "authorized" })
    } catch (err) {
      if (err instanceof RoomFullError) {
        setStep({
          phase: "error",
          title: `Sala cheia (${err.current}/${err.max})`,
          description: "Aguarde a saída de um participante ou entre em outra sala.",
        })
        return
      }
      setPasswordError("Erro ao validar senha.")
      setStep({ phase: "needs_password" })
      setIsJoining(false)
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
      <main className="flex flex-col justify-center items-center w-screen h-screen bg-black gap-6 px-6">
        <div className="flex flex-col items-center gap-3 max-w-md text-center">
          <h1 className="text-h3 text-valorant-red font-montserrat font-bold uppercase tracking-widest">
            {step.title}
          </h1>
          {step.description && (
            <p className="text-body text-muted-foreground font-prompt leading-relaxed">
              {step.description}
            </p>
          )}
        </div>
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
              disabled={isJoining}
            />
            <Input
              type="password"
              placeholder="Senha da sala"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              disabled={isJoining}
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
