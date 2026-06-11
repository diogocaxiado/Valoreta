import { StarIcon } from "@heroicons/react/24/solid"
import { MAX_PLAYERS } from "../../../services/roomService"
import type { PlayerInfo } from "../../../hooks/useRoomPresence"

interface PlayerListProps {
  players: PlayerInfo[]
  playerCount: number
  currentPlayerId?: string
}

export function PlayerList({
  players,
  playerCount,
  currentPlayerId,
}: PlayerListProps) {
  return (
    <div className="flex flex-col w-64 bg-black/80 border border-white/20 rounded-sm p-4">
      <div className="text-small font-prompt text-muted-foreground uppercase tracking-wider mb-3">
        Jogadores ({playerCount}/{MAX_PLAYERS})
      </div>

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
