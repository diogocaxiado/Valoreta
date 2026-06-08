import { onValue, ref, update } from "firebase/database";
import { db } from "../infra/firebase/config";

export interface RoomState {
  agentUuid?: string;
  agentAbilities?: Array<{
    slot: string;
    displayName: string;
    description: string;
    displayIcon: string;
  }>;
  agentDescription?: string;
  enabledAgents?: string[];
}

export function updateRoomState(roomId: string, data: Partial<RoomState>) {
  return update(ref(db, `room/${roomId}/state`), {
    ...data,
    updatedAt: Date.now(),
  });
}

export function subscribeToRoom(
  roomId: string,
  callback: (data: RoomState | null) => void
) {
  const roomRef = ref(db, `room/${roomId}/state`);
  return onValue(roomRef, (snapshot) => {
    callback(snapshot.val());
  });
}
