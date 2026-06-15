import { useState, useEffect, useCallback } from "react";
import { RoomState, updateRoomState, subscribeToRoom } from "../services/roomService";

export function useRoom(roomId: string | undefined, playerId?: string) {
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!roomId) {
      setRoomState(null);
      setIsConnected(false);
      setError(null);
      return;
    }

    setIsConnected(false);
    setError(null);

    const unsubscribe = subscribeToRoom(roomId, (data) => {
      setRoomState(data);
      setIsConnected(true);
    });

    return () => unsubscribe();
  }, [roomId]);

  const syncToRoom = useCallback(
    (data: Partial<RoomState>) => {
      if (roomId) {
        updateRoomState(roomId, data, playerId).catch((err) =>
          setError(err instanceof Error ? err : new Error(String(err)))
        );
      }
    },
    [roomId, playerId]
  );

  return { roomState, isConnected, syncToRoom, error };
}
