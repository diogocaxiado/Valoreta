import { useState, useEffect } from "react";
import { subscribeRoomHistory, RoomHistoryEntry } from "../services/roomService";
import { loadSoloHistory, subscribeSoloHistory } from "../services/soloHistory";

export function useRoomHistory(roomId?: string) {
  const [entries, setEntries] = useState<RoomHistoryEntry[]>([]);

  useEffect(() => {
    if (roomId) {
      const unsubscribe = subscribeRoomHistory(roomId, (data) => {
        if (!data) {
          setEntries([]);
          return;
        }

        const sorted = [...data].sort((a, b) => b.rolledAt - a.rolledAt);
        setEntries(sorted);
      });

      return () => unsubscribe();
    }

    setEntries(loadSoloHistory());
    const unsubscribe = subscribeSoloHistory(() => {
      setEntries(loadSoloHistory());
    });

    return () => unsubscribe();
  }, [roomId]);

  return { history: entries };
}