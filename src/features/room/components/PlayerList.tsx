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
}

export function PlayerList({
  players,
  playerCount,
  currentPlayerId,
  isHost,
  hostName,
  onTransferHost,
}: PlayerListProps) {
  return (
    <div className="flex flex-col w-64 bg-black/80 border border-white/20 rounded-sm p-4">
      <div className="text-small font-prompt text-muted-foreground uppercase tracking-wider mb-3">
        Jogadores ({playerCount}/{MAX_PLAYERS})
      </div>

      {isHost !== undefined && (
        <div className={`flex items-center gap-1.5 px-2 py-1.5 mb-2 rounded-sm border ${
          isHost
            ? "border-valorant-yellow/30 bg-valorant-yellow/5"
            : "border-white/10 bg-white/5"
        }`}>
          <span className="text-[10px] font-montserrat font-bold uppercase tracking-wider text-white/50">
            Você é:
          </span>
          <span className={`text-[10px] font-montserrat font-bold uppercase tracking-wider ${
            isHost ? "text-valorant-yellow" : "text-white/60"
          }`}>
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
