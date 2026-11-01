import { useState, useId } from "react"
import { useNavigate } from "react-router-dom"
import { Background } from "../../common/components/Background/Background"
import { Topbar } from "../../common/components/Topbar/Topbar"
import { Button } from "../../common/components/ui/button"
import { Input } from "../../common/components/ui/input"
import { LobbyButton } from "./components/LobbyButton"
import { CreateRoomModal } from "./components/CreateRoomModal"
import { ShareRoomModal } from "./components/ShareRoomModal"
import { PasswordModal } from "./components/PasswordModal"
import { useRoomAccess } from "../../hooks/useRoomAccess"
import { getPlayerName } from "../../services/playerSession"
import BgScreen from "../../assets/video/Valorant.mp4"

export function LobbyPage() {
  const navigate = useNavigate()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null)
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

  async function handleConfirmCreate(name: string, password: string) {
    try {
      const roomId = await handleCreateRoom(name, password)
      setCreatedRoomId(roomId)
      setCreateModalOpen(false)
      setShareModalOpen(true)
    } catch {
      // já tratado em useRoomAccess
    }
  }

  function goToRoom() {
    if (!createdRoomId) return
    navigate(`/room/${createdRoomId}`)
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
    <main className="relative w-screen h-screen overflow-hidden flex flex-col justify-between">
      <Background type="video" src={BgScreen} />

      <div className="flex justify-between items-center relative z-10">
        <div className="py-2 sm:py-4 px-4 sm:px-8">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-display z-10 text-neon-blue font-valorant">
            vAloreta
          </h1>
        </div>

        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20">
          <Topbar title="Lobby" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-end p-4 sm:p-6 md:p-8 relative z-10">
        <div
          className="
            flex flex-col gap-4 sm:gap-6 md:gap-8
            border border-cyan-400 rounded-br-2xl p-4 sm:p-6 md:p-8
            bg-gradient-to-b from-cyan-800/30 to-transparent
            shadow-[0_0_15px_rgba(0,255,255,0.7)]
            backdrop-blur-sm
            max-w-md w-full sm:w-auto
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

          <div className="border-t border-cyan-400/30 pt-3 sm:pt-4">
            <p className="text-xs sm:text-sm text-cyan-300 uppercase tracking-wider mb-2 text-center">
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
                className="bg-black/50 border-cyan-400/50 text-cyan-300 placeholder:text-cyan-700 text-sm"
              />
              <Button
                variant="secondary"
                size="default"
                onClick={handleRoomCodeSubmit}
                disabled={!roomCode.trim() || loading}
                loading={step.phase === "checking_room"}
                className="whitespace-nowrap text-xs sm:text-sm"
              >
                Entrar
              </Button>
            </div>

            {validationError && (
              <div className="mt-3 p-2.5 sm:p-3 rounded-sm bg-destructive/20 border border-destructive/50 max-w-sm">
                <p className="text-xs sm:text-sm text-destructive-foreground font-prompt leading-relaxed">
                  {validationError.message}
                </p>
                {validationError.code === "ROOM_FULL" && "current" in validationError && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-prompt mt-1">
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
        onConfirm={handleConfirmCreate}
        loading={loading}
      />

      <ShareRoomModal
        open={shareModalOpen}
        onOpenChange={(open) => {
          setShareModalOpen(open)
          if (!open) {
            // permite fechar sem navegar; sala já criada
          }
        }}
        roomId={createdRoomId}
        onGoToRoom={goToRoom}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card text-card-foreground border border-border/50 shadow-lg p-4 sm:p-6 w-full max-w-md">
            <div className="flex flex-col gap-4">
              <h2 className="text-sm sm:text-base md:text-h4 font-montserrat font-bold uppercase tracking-widest">
                Entrar na sala
              </h2>
              <p className="text-xs sm:text-small text-muted-foreground font-prompt">
                Informe seu nome para entrar na sala.
              </p>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor={namePromptId}
                  className="text-xs sm:text-sm text-muted-foreground font-prompt uppercase tracking-wider"
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
