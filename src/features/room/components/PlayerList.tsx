import { StarIcon } from "@heroicons/react/24/solid"
import { MAX_PLAYERS } from "../../../services/roomService"
import type { PlayerInfo } from "../../../hooks/useRoomPresence"

interface PlayerListProps {
  players: PlayerInfo[]
  playerCount: number
  currentPlayerId?: string
  isHost?: boolean
  hostName?: string
  onTransferHost?: (newHostId: string) => void
  isConnected?: boolean
}

export function PlayerList({
  players,
  playerCount,
  currentPlayerId,
  isHost,
  hostName,
  onTransferHost,
  isConnected = true,
}: PlayerListProps) {
  return (
    <div className="flex flex-col w-64 bg-black/80 border border-white/20 rounded-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-small font-prompt text-muted-foreground uppercase tracking-wider">
          Jogadores ({playerCount}/{MAX_PLAYERS})
        </div>

        <div className="relative group cursor-help">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 border border-white/10 hover:border-white/30 transition-colors">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected
                  ? "bg-valorant-green shadow-[0_0_6px_rgba(30,255,60,0.8)]"
                  : "bg-red-500 animate-pulse shadow-[0_0_6px_rgba(239,68,68,0.8)]"
              }`}
            />
            <span
              className={`text-[10px] font-prompt uppercase font-semibold ${
                isConnected ? "text-valorant-green" : "text-red-400"
              }`}
            >
              {isConnected ? "Online" : "Offline"}
            </span>
          </div>

          <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col items-end z-50 pointer-events-none w-52">
            <div className="w-2 h-2 bg-black border-l border-t border-cyan-400/50 rotate-45 mr-3 -mb-1" />
            <div className="bg-black/95 border border-cyan-400/50 text-white p-2.5 rounded-sm text-xs shadow-xl backdrop-blur-sm text-left font-prompt">
              <strong className="block text-valorant-cyan font-bold uppercase tracking-wider text-[11px] mb-1">
                {isConnected ? "Status: Conectado" : "Status: Desconectado"}
              </strong>
              <p className="text-white/70 text-[11px] leading-tight">
                {isConnected
                  ? "Sincronização em tempo real ativa com o servidor e os participantes da sala."
                  : "A conexão com a sala foi interrompida. Tentando reconectar..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isHost !== undefined && (
        <div
          className={`flex items-center gap-1.5 px-2 py-1.5 mb-2 rounded-sm border ${
            isHost
              ? "border-valorant-yellow/30 bg-valorant-yellow/5"
              : "border-white/10 bg-white/5"
          }`}
        >
          <span className="text-[10px] font-montserrat font-bold uppercase tracking-wider text-white/50">
            Você é:
          </span>
          <span
            className={`text-[10px] font-montserrat font-bold uppercase tracking-wider ${
              isHost ? "text-valorant-yellow" : "text-white/60"
            }`}
          >
            {isHost ? "👑 Host" : "👤 Participante"}
          </span>
        </div>
      )}

      {isHost === false && hostName && (
        <p className="text-[10px] text-white/30 font-prompt px-2 mb-2">
          Host atual: <span className="text-white/50">{hostName}</span>
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        {players.map((player) => {
          const isCurrentPlayer = player.id === currentPlayerId

          return (
            <div
              key={player.id}
              className={`
                flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm
                ${isCurrentPlayer ? "bg-white/10 border border-white/20" : ""}
              `}
            >
              {player.isHost ? (
                <StarIcon className="w-4 h-4 text-valorant-yellow shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-white/20 shrink-0" />
              )}

              <span
                className={`
                  font-prompt truncate
                  ${isCurrentPlayer ? "text-white font-semibold" : "text-white/80"}
                `}
              >
                {player.name}
                {isCurrentPlayer ? " (Você)" : ""}
              </span>

              {player.isHost && (
                <span className="ml-auto text-[10px] font-montserrat font-bold uppercase tracking-wider text-valorant-yellow/80">
                  HOST
                </span>
              )}

              {onTransferHost && !player.isHost && player.id !== currentPlayerId && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onTransferHost(player.id)
                  }}
                  className="ml-auto text-[10px] font-montserrat font-bold uppercase tracking-wider
                    text-cyan-400/70 hover:text-cyan-300 transition-colors cursor-pointer bg-transparent border-0"
                  title="Transferir Host"
                >
                  Transferir
                </button>
              )}
            </div>
          )
        })}
      </div>

      {players.length === 0 && (
        <p className="text-caption text-muted-foreground font-prompt text-center py-4">
          Nenhum jogador na sala
        </p>
      )}
    </div>
  )
}
