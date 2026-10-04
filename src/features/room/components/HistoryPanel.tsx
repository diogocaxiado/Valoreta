import { useEffect, useRef, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import type { RoomHistoryEntry } from "../../../services/roomService";

const CASCADE_DURATION = "0.3s";

interface HistoryPanelProps {
  entries: RoomHistoryEntry[];
  visible: boolean;
  onToggleVisible: () => void;
}

function formatTime(rolledAt: number) {
  const date = new Date(rolledAt);
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function HistoryRow({ entry }: { entry: RoomHistoryEntry }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm bg-white/5 border border-white/10">
      <img
        src={entry.agentIcon}
        alt={entry.agentName}
        className="w-8 h-8 object-contain shrink-0"
      />
      <div className="flex flex-col min-w-0">
        <span className="font-prompt text-white/90 truncate">
          {entry.agentName}
        </span>
        <span className="text-[10px] font-prompt text-white/40">
          {formatTime(entry.rolledAt)}
        </span>
      </div>
    </div>
  );
}

export function HistoryPanel({
  entries,
  visible,
  onToggleVisible,
}: HistoryPanelProps) {
  const prevRef = useRef<RoomHistoryEntry[]>(entries);
  const [epoch, setEpoch] = useState(0);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = entries;

    if (!visible) return;

    const prevIds = new Set(prev.map((e) => e.historyId));

    const inserted = entries.find((e) => !prevIds.has(e.historyId));
    if (inserted && prev.length > 0) {
      setEpoch((e) => e + 1);
    }
  }, [entries, visible]);

  if (!visible) {
    return (
      <button
        type="button"
        onClick={onToggleVisible}
        className="
          flex items-center gap-2 px-3 py-2 rounded-sm
          bg-black/80 border border-white/20
          text-xs font-montserrat font-bold uppercase tracking-wider
          text-white/60 hover:text-white hover:border-white/40
          transition-colors cursor-pointer
        "
        title="Mostrar histórico"
      >
        <EyeIcon className="w-4 h-4" />
        Histórico
      </button>
    );
  }

  const cascading = epoch > 0;

  return (
    <div className="flex flex-col w-64 bg-black/80 border border-white/20 rounded-sm p-4 max-h-[70vh]">
      <div className="text-small font-prompt text-muted-foreground uppercase tracking-wider mb-3">
        Histórico
      </div>

      <div className="flex flex-col gap-1.5 pr-0.5 h-full overflow-hidden">
        {entries.length === 0 && (
          <p className="text-caption text-muted-foreground font-prompt text-center py-4">
            Nenhum sorteio realizado
          </p>
        )}

        {entries.map((entry) =>
          cascading ? (
            <div
              key={`${epoch}-${entry.historyId}`}
              style={{ animation: `history-cascade-in ${CASCADE_DURATION} ease` }}
            >
              <HistoryRow entry={entry} />
            </div>
          ) : (
            <div key={entry.historyId}>
              <HistoryRow entry={entry} />
            </div>
          )
        )}
      </div>

      <button
        type="button"
        onClick={onToggleVisible}
        className="
          mt-3 flex items-center justify-center gap-2
          text-[10px] font-montserrat font-bold uppercase tracking-wider
          text-cyan-400/70 hover:text-cyan-300
          transition-colors cursor-pointer bg-transparent border-0
        "
      >
        <EyeSlashIcon className="w-4 h-4" />
        Ocultar histórico
      </button>
    </div>
  );
}