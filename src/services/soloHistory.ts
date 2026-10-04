import { RoomHistoryEntry } from "./roomService";

const SOLO_HISTORY_KEY = "valoreta_solo_history";
const SOLO_HISTORY_LIMIT = 5;

const listeners = new Set<() => void>();

function read(): RoomHistoryEntry[] {
  try {
    const raw = localStorage.getItem(SOLO_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RoomHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Falha ao ler histórico solo", err);
    return [];
  }
}

function write(entries: RoomHistoryEntry[]) {
  try {
    localStorage.setItem(
      SOLO_HISTORY_KEY,
      JSON.stringify(entries.slice(0, SOLO_HISTORY_LIMIT))
    );
  } catch (err) {
    console.error("Falha ao salvar histórico solo", err);
  }
}

function notify() {
  listeners.forEach((listener) => listener());
}

export function loadSoloHistory(): RoomHistoryEntry[] {
  return read();
}

export function recordSoloHistory(entry: RoomHistoryEntry): void {
  const existing = read().filter((e) => e.historyId !== entry.historyId);
  write([entry, ...existing]);
  notify();
}

export function subscribeSoloHistory(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}