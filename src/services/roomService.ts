import { ref, set, update, onValue, get, child, remove, onDisconnect } from "firebase/database";
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
  rolling?: boolean;
  rollWinner?: string;
  rollStartedAt?: number;
  rollInitiatedBy?: string;
}

export interface PlayerData {
  name: string;
  joinedAt: number;
  isHost: boolean;
}

export interface RoomData {
  hostId: string;
  createdAt: number;
  maxPlayers: number;
  password: string;
  status: "waiting" | "playing" | "finished";
  players: Record<string, PlayerData> | null;
  settings: Record<string, unknown>;
  state?: RoomState;
}

export const MAX_PLAYERS = 5;

function roomRef(roomId: string) {
  return ref(db, `room/${roomId}`);
}

function roomDataRef(roomId: string) {
  return ref(db, `room/${roomId}/state`);
}

export interface CreateRoomParams {
  roomId: string;
  hostId: string;
  hostName: string;
  passwordHash: string;
}

export async function createRoom({
  roomId,
  hostId,
  hostName,
  passwordHash,
}: CreateRoomParams): Promise<void> {
  const room: Omit<RoomData, "state"> = {
    hostId,
    createdAt: Date.now(),
    maxPlayers: MAX_PLAYERS,
    password: passwordHash,
    status: "waiting",
    players: {
      [hostId]: {
        name: hostName,
        joinedAt: Date.now(),
        isHost: true,
      },
    },
    settings: {},
  };

  await set(roomRef(roomId), room);
}

export interface JoinRoomParams {
  roomId: string;
  playerId: string;
  playerName: string;
}

export async function joinRoom({
  roomId,
  playerId,
  playerName,
}: JoinRoomParams): Promise<void> {
  const playerRef = ref(db, `room/${roomId}/players/${playerId}`);
  await set(playerRef, {
    name: playerName,
    joinedAt: Date.now(),
    isHost: false,
  });
}

export async function rejoinRoom(
  roomId: string,
  playerId: string,
  playerName: string
): Promise<void> {
  const playerRef = ref(db, `room/${roomId}/players/${playerId}`);
  await update(playerRef, {
    name: playerName,
    joinedAt: Date.now(),
  });
}

export async function transferHost(
  roomId: string,
  currentPlayerId: string,
  newHostId: string
): Promise<void> {
  const snap = await get(child(ref(db), `room/${roomId}/hostId`));
  const storedHostId = snap.val();
  if (!storedHostId || storedHostId !== currentPlayerId) {
    throw new Error("Apenas o host atual pode transferir a liderança.");
  }

  await update(ref(db), {
    [`room/${roomId}/hostId`]: newHostId,
    [`room/${roomId}/players/${currentPlayerId}/isHost`]: false,
    [`room/${roomId}/players/${newHostId}/isHost`]: true,
  });
}

export async function deleteRoom(roomId: string): Promise<void> {
  await remove(roomRef(roomId));
}

export async function leaveRoom(
  roomId: string,
  playerId: string
): Promise<void> {
  await remove(ref(db, `room/${roomId}/players/${playerId}`));

  const snapshot = await get(child(ref(db), `room/${roomId}/players`));
  const remaining = snapshot.val();
  if (!remaining || Object.keys(remaining).length === 0) {
    await remove(roomRef(roomId));
  }
}

let presenceCleanupMap = new Map<string, () => void>();

export function setupPlayerPresence(roomId: string, playerId: string) {
  const playerRef = ref(db, `room/${roomId}/players/${playerId}`);
  const key = `${roomId}:${playerId}`;

  if (presenceCleanupMap.has(key)) {
    presenceCleanupMap.get(key)!();
  }

  onDisconnect(playerRef).remove();

  const cancel = () => {
    onDisconnect(playerRef).cancel();
  };

  presenceCleanupMap.set(key, cancel);

  return { cancel };
}

export function cancelPresence(roomId: string, playerId: string) {
  const key = `${roomId}:${playerId}`;
  const cancel = presenceCleanupMap.get(key);
  if (cancel) {
    cancel();
    presenceCleanupMap.delete(key);
  }
}

export async function fetchRoomData(
  roomId: string
): Promise<RoomData | null> {
  const snapshot = await get(child(ref(db), `room/${roomId}`));
  return snapshot.val();
}

export function subscribeRoomData(
  roomId: string,
  callback: (data: RoomData | null) => void
) {
  return onValue(roomRef(roomId), (snapshot) => {
    callback(snapshot.val());
  });
}

export function subscribeRoomPlayers(
  roomId: string,
  callback: (players: Record<string, PlayerData> | null) => void
) {
  return onValue(ref(db, `room/${roomId}/players`), (snapshot) => {
    callback(snapshot.val());
  });
}

export async function updateRoomState(
  roomId: string,
  data: Partial<RoomState>,
  playerId?: string
) {
  if (playerId) {
    const snapshot = await get(child(ref(db), `room/${roomId}/hostId`));
    const hostId = snapshot.val();
    if (hostId && hostId !== playerId) {
      throw new Error("Apenas o host pode modificar a sala.");
    }
  }

  return update(roomDataRef(roomId), {
    ...data,
    updatedAt: Date.now(),
  });
}

export function subscribeToRoom(
  roomId: string,
  callback: (data: RoomState | null) => void
) {
  return onValue(roomDataRef(roomId), (snapshot) => {
    callback(snapshot.val());
  });
}
