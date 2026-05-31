import { onValue, ref, set, update } from "firebase/database";
import { db } from '../services/firebase';
import { IAgent, IAgentAbilities } from "../types";

interface updateRoomStateParams {
  roomId: string;
  data: {
    agentUuid?: string;
    agentAbilities?: IAgentAbilities[] | [];
    agentDescription?: string;
    enabledAgents?: IAgent[] | [];
  }
}

export const updateRoomState = ({roomId, data}: updateRoomStateParams) => {
  return update(ref(db, `room/${roomId}/state`), {
    ...data,
    updatedAt: Date.now(),
  });
};

export const subscribeToRoom = (roomId: string, callback: (data: any) => void) => {
  const roomRef = ref(db, `room/${roomId}/state`);
  return onValue(roomRef, (snapshot) => {
    callback(snapshot.val());
  });
};