import { useState, useEffect, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../common/components/ui/dialog"
import { Button } from "../../../common/components/ui/button"
import { Input } from "../../../common/components/ui/input"
import { getPlayerName } from "../../../services/playerSession"
import {
  subscribeRooms,
  type RoomSummary,
} from "../../../services/roomService"
import {
  LockClosedIcon,
  LockOpenIcon,
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid"

interface CreateRoomModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (name: string, password: string) => void
  onJoinRoom?: (roomId: string) => void
  loading?: boolean
}

type TabType = "create" | "list"
type FilterType = "all" | "public" | "protected"

export function CreateRoomModal({
  open,
  onOpenChange,
  onConfirm,
  onJoinRoom,
  loading,
}: CreateRoomModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("list")
  const [name, setName] = useState(getPlayerName())
  const [password, setPassword] = useState("")
  const [rooms, setRooms] = useState<RoomSummary[]>([])
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<FilterType>("all")

  // Carrega salas em tempo real quando o modal está aberto
  useEffect(() => {
    if (!open) return
    setLoadingRooms(true)
    const unsubscribe = subscribeRooms((list) => {
      setRooms(list)
      setLoadingRooms(false)
    })
    return () => unsubscribe()
  }, [open])

  useEffect(() => {
    if (open) {
      setName(getPlayerName())
      setPassword("")
    }
  }, [open])

  function handleConfirm() {
    if (!name.trim()) return
    onConfirm(name.trim(), password)
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      setPassword("")
      setSearchTerm("")
    }
    onOpenChange(newOpen)
  }

  function handleSelectRoom(roomId: string) {
    if (onJoinRoom) {
      onJoinRoom(roomId)
    }
  }

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Filtro por tipo de senha
      if (filterType === "public" && room.hasPassword) return false
      if (filterType === "protected" && !room.hasPassword) return false

      // Filtro por termo de busca (ID ou Host)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim()
        const matchesId = room.id.toLowerCase().includes(query)
        const matchesHost = room.hostName.toLowerCase().includes(query)
        return matchesId || matchesHost
      }

      return true
    })
  }, [rooms, filterType, searchTerm])

  const publicRoomsCount = useMemo(
    () => rooms.filter((r) => !r.hasPassword).length,
    [rooms]
  )
  const protectedRoomsCount = useMemo(
    () => rooms.filter((r) => r.hasPassword).length,
    [rooms]
  )

  const canSubmit = name.trim().length > 0 && !loading

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border-cyan-400/50 max-w-xl md:max-w-2xl bg-black/95 backdrop-blur-md p-5 sm:p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl sm:text-2xl font-valorant text-neon-blue">
            Salas Multiplayer
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-cyan-300/70 font-prompt">
            Crie sua própria sala ou junte-se a uma partida já criada.
          </DialogDescription>
        </DialogHeader>

        {/* Abas de Navegação */}
        <div className="flex border-b border-cyan-400/30 gap-2 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("list")}
            className={`
              flex items-center gap-2 px-3 sm:px-4 py-2 font-montserrat text-xs sm:text-sm font-bold uppercase tracking-wider
              border-b-2 transition-all cursor-pointer
              ${
                activeTab === "list"
                  ? "border-cyan-400 text-cyan-300 bg-cyan-950/30"
                  : "border-transparent text-white/50 hover:text-white/80"
              }
            `}
          >
            <UserGroupIcon className="w-4 h-4" />
            <span>Salas Disponíveis</span>
            <span
              className={`
                px-1.5 py-0.2 rounded-full text-[10px] font-prompt font-semibold
                ${
                  rooms.length > 0
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                    : "bg-white/10 text-white/40"
                }
              `}
            >
              {rooms.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className={`
              flex items-center gap-2 px-3 sm:px-4 py-2 font-montserrat text-xs sm:text-sm font-bold uppercase tracking-wider
              border-b-2 transition-all cursor-pointer
              ${
                activeTab === "create"
                  ? "border-cyan-400 text-cyan-300 bg-cyan-950/30"
                  : "border-transparent text-white/50 hover:text-white/80"
              }
            `}
          >
            <PlusIcon className="w-4 h-4" />
            <span>Criar Nova Sala</span>
          </button>
        </div>

        {/* Conteúdo da Aba: Salas Disponíveis */}
        {activeTab === "list" && (
          <div className="flex flex-col gap-3">
            {/* Barra de Filtro e Busca */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/60" />
                <Input
                  type="text"
                  placeholder="Buscar por host ou código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-black/60 border-cyan-400/40 text-xs sm:text-sm text-cyan-200 placeholder:text-cyan-700 h-9"
                />
              </div>

              {/* Filtro por tipo de sala */}
              <div className="flex gap-1 border border-cyan-400/30 rounded p-0.5 bg-black/40 shrink-0">
                <button
                  type="button"
                  onClick={() => setFilterType("all")}
                  className={`px-2 py-1 text-[11px] font-prompt uppercase rounded transition-colors ${
                    filterType === "all"
                      ? "bg-cyan-500/30 text-cyan-200 font-bold"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  Todas ({rooms.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("public")}
                  className={`px-2 py-1 text-[11px] font-prompt uppercase rounded transition-colors ${
                    filterType === "public"
                      ? "bg-emerald-500/30 text-emerald-300 font-bold"
                      : "text-white/50 hover:text-white"
                  }`}
                  title="Salas sem senha"
                >
                  Públicas ({publicRoomsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("protected")}
                  className={`px-2 py-1 text-[11px] font-prompt uppercase rounded transition-colors ${
                    filterType === "protected"
                      ? "bg-amber-500/30 text-amber-300 font-bold"
                      : "text-white/50 hover:text-white"
                  }`}
                  title="Salas protegidas por senha"
                >
                  Com Senha ({protectedRoomsCount})
                </button>
              </div>
            </div>

            {/* Lista de Salas */}
            <div className="max-h-[300px] overflow-y-auto pr-1 flex flex-col gap-2">
              {loadingRooms ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-cyan-400/70">
                  <ArrowPathIcon className="w-6 h-6 animate-spin" />
                  <p className="text-xs font-prompt">Carregando salas ativas...</p>
                </div>
              ) : rooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-cyan-400/30 rounded bg-cyan-950/10">
                  <UserGroupIcon className="w-10 h-10 text-cyan-400/40 mb-2" />
                  <p className="text-sm font-montserrat font-bold text-cyan-200 uppercase tracking-wider">
                    Nenhuma sala ativa no momento
                  </p>
                  <p className="text-xs text-white/50 font-prompt mt-1 max-w-xs">
                    Seja o primeiro a criar uma sala para convidar seus amigos!
                  </p>
                  <Button
                    variant="default"
                    size="default"
                    onClick={() => setActiveTab("create")}
                    className="mt-4 gap-2 text-xs"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Criar Sala Agora
                  </Button>
                </div>
              ) : filteredRooms.length === 0 ? (
                <div className="py-8 text-center text-white/50 text-xs font-prompt">
                  Nenhuma sala encontrada para a busca atual.
                </div>
              ) : (
                filteredRooms.map((room) => {
                  const isFull = room.playerCount >= room.maxPlayers

                  return (
                    <div
                      key={room.id}
                      className="
                        flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3
                        p-3 rounded border border-white/10 hover:border-cyan-400/50
                        bg-black/50 hover:bg-black/75 transition-all
                      "
                    >
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-montserrat font-bold text-sm text-white tracking-wide truncate">
                            Host: <span className="text-valorant-cyan">{room.hostName}</span>
                          </span>

                          {/* Badge de senha */}
                          {room.hasPassword ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-prompt font-semibold uppercase border border-amber-500/40 bg-amber-500/15 text-amber-300">
                              <LockClosedIcon className="w-3 h-3 text-amber-400" />
                              Com Senha
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-prompt font-semibold uppercase border border-emerald-500/40 bg-emerald-500/15 text-emerald-300">
                              <LockOpenIcon className="w-3 h-3 text-emerald-400" />
                              Sem Senha
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-white/60 font-prompt">
                          <span className="font-mono text-cyan-300/80 tracking-wider">
                            Código: #{room.id}
                          </span>

                          <span className="flex items-center gap-1">
                            <UserGroupIcon className="w-3.5 h-3.5 text-cyan-400" />
                            <span className={isFull ? "text-amber-400 font-bold" : ""}>
                              {room.playerCount}/{room.maxPlayers} jogadores
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="w-full sm:w-auto flex justify-end shrink-0">
                        <Button
                          variant={isFull ? "outline" : "default"}
                          size="default"
                          onClick={() => handleSelectRoom(room.id)}
                          disabled={isFull || loading}
                          className="w-full sm:w-auto gap-1.5 text-xs h-8 px-4"
                        >
                          <ArrowRightOnRectangleIcon className="w-4 h-4" />
                          <span>{isFull ? "Sala Cheia" : "Entrar"}</span>
                        </Button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <div className="flex justify-between items-center border-t border-cyan-400/20 pt-3 mt-1">
              <span className="text-[11px] text-white/40 font-prompt">
                Sincronização em tempo real das salas ativas
              </span>
              <Button
                variant="outline"
                size="default"
                onClick={() => handleOpenChange(false)}
                disabled={loading}
              >
                Fechar
              </Button>
            </div>
          </div>
        )}

        {/* Conteúdo da Aba: Criar Nova Sala */}
        {activeTab === "create" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="room-name"
                className="text-xs sm:text-sm text-cyan-300 font-prompt uppercase tracking-wider"
              >
                Seu nome no jogo
              </label>
              <Input
                id="room-name"
                type="text"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                maxLength={24}
                className="bg-black/50 border-cyan-400/50 text-cyan-200"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="room-password"
                className="text-xs sm:text-sm text-cyan-300 font-prompt uppercase tracking-wider"
              >
                Senha da sala (opcional)
              </label>
              <Input
                id="room-password"
                type="password"
                placeholder="Deixe em branco para permitir qualquer jogador entrar"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-black/50 border-cyan-400/50 text-cyan-200"
              />
              <p className="text-[11px] text-white/40 font-prompt">
                Se você definir uma senha, os jogadores precisarão digitá-la para acessar a sala.
              </p>
            </div>

            <div className="flex justify-end gap-2 mt-2 border-t border-cyan-400/20 pt-3">
              <Button
                variant="outline"
                size="default"
                onClick={() => handleOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                size="default"
                onClick={handleConfirm}
                disabled={!canSubmit}
                loading={loading}
                className="gap-1.5"
              >
                <PlusIcon className="w-4 h-4" />
                Criar sala
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
