import { useState, useEffect } from 'react';
import { subscribeToRoom } from '../api/rouletteService';

export function useRoulette(roomId?: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(!!roomId);

  useEffect(() => {
    if (!roomId) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToRoom(roomId, (newData) => {
      setData(newData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomId]);

  return { data, loading };
}