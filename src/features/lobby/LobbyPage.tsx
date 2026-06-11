import { useState, useId } from "react"
import { useNavigate } from "react-router-dom"
import { Background } from "../../common/components/Background/Background"
import { Topbar } from "../../common/components/Topbar/Topbar"
import { Button } from "../../common/components/ui/button"
import { Input } from "../../common/components/ui/input"
import { LobbyButton } from "./components/LobbyButton"
import { CreateRoomModal } from "./components/CreateRoomModal"
import { PasswordModal } from "./components/PasswordModal"
import { useRoomAccess } from "../../hooks/useRoomAccess"
import { getPlayerName, setPlayerName } from "../../services/playerSession"
import BgScreen from "../../assets/video/Valorant.mp4"

export function LobbyPage() {
  const navigate = useNavigate()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [roomCode, setRoomCode] = useState("")
  const [nameInput, setNameInput] = useState(getPlayerName())
  const namePromptId = useId()

  const {
    step,
    loading,
    handleCreateRoom,
    handleJoinRoom,
    handleNameSubmit,
    handlePasswordSubmit,
    reset,
  } = useRoomAccess()

  function handleSoloDraw() {
    navigate("/solo")
  }

  function handleOpenCreateModal() {
    setCreateModalOpen(true)
  }

  function handleRoomCodeSubmit() {
    const trimmed = roomCode.trim()
    if (!trimmed) return
    handleJoinRoom(trimmed)
  }

  const showPasswordModal =
    step.phase === "password_prompt"

  const showNamePrompt =
    step.phase === "name_prompt"

  const passwordError =
    step.phase === "password_prompt" ? step.error : undefined

  const validationError =
    step.phase === "error" ? step.error : null

  return (
    <main>
      <Background type="video" src={BgScreen} />

      <div className="flex justify-between">
        <div className="py-4 px-8">
          <h1 className="text-display z-10 text-neon-blue font-valorant">
            vAloreta
          </h1>
        </div>

        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
          <Topbar title="Lobby" />
        </div>
      </div>

      <div className="flex flex-col justify-center items-end p-8 min-h-[80vh]">
        <div
          className="
            flex flex-col gap-8
            border border-cyan-400 rounded-br-2xl p-8
            bg-gradient-to-b from-cyan-800/30 to-transparent
            shadow-[0_0_15px_rgba(0,255,255,0.7)]
            backdrop-blur-sm
          "
        >
          <LobbyButton
            onClick={handleSoloDraw}
            icon="solo"
            title="Sorteio solo"
            description="Rápido e local"
          />

          <LobbyButton
            onClick={handleOpenCreateModal}
            icon="group"
            title="Criar sala"
            description="Compartilhe o código com amigos"
          />

          <div className="border-t border-cyan-400/30 pt-4">
            <p className="text-sm text-cyan-300 uppercase tracking-wider mb-2 text-center">
              Ou entre em uma sala existente
            </p>

            <div className="flex gap-2">
              <Input
                placeholder="Código da sala"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRoomCodeSubmit()
                }}
                disabled={loading}
                className="bg-black/50 border-cyan-400/50 text-cyan-300 placeholder:text-cyan-700"
              />
              <Button
                variant="secondary"
                size="default"
                onClick={handleRoomCodeSubmit}
                disabled={!roomCode.trim() || loading}
                loading={step.phase === "checking_room"}
                className="whitespace-nowrap"
              >
                Entrar
              </Button>
            </div>

            {validationError && (
              <div className="mt-3 p-3 rounded-sm bg-destructive/20 border border-destructive/50">
                <p className="text-sm text-destructive-foreground font-prompt">
                  {validationError.message}
                </p>
                {validationError.code === "ROOM_FULL" && "current" in validationError && (
                  <p className="text-xs text-muted-foreground font-prompt mt-1">
                    {validationError.current}/{validationError.max} jogadores
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateRoomModal
        open={createModalOpen}
        onOpenChange={(open) => {
          setCreateModalOpen(open)
          if (!open) reset()
        }}
        onConfirm={(name, password) => handleCreateRoom(name, password)}
        loading={loading}
      />

      {showPasswordModal && (
        <PasswordModal
          open={true}
          onOpenChange={(open) => {
            if (!open) reset()
          }}
          onConfirm={(name, password) => {
            handlePasswordSubmit(step.roomId, step.playerId, name, password)
          }}
          error={passwordError}
          loading={loading}
        />
      )}

      {showNamePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card text-card-foreground border border-border/50 shadow-lg p-6 w-full max-w-md">
            <div className="flex flex-col gap-4">
              <h2 className="text-h4 font-montserrat font-bold uppercase tracking-widest">
                Entrar na sala
              </h2>
              <p className="text-small text-muted-foreground font-prompt">
                Informe seu nome para entrar na sala.
              </p>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor={namePromptId}
                  className="text-sm text-muted-foreground font-prompt uppercase tracking-wider"
                >
                  Seu nome
                </label>
                <Input
                  id={namePromptId}
                  type="text"
                  placeholder="Digite seu nome"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  disabled={loading}
                  maxLength={24}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && nameInput.trim()) {
                      handleNameSubmit(step.roomId, step.playerId, nameInput.trim())
                    }
                  }}
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => reset()}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  variant="default"
                  size="default"
                  onClick={() => handleNameSubmit(step.roomId, step.playerId, nameInput.trim())}
                  disabled={!nameInput.trim() || loading}
                  loading={loading}
                >
                  Entrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
