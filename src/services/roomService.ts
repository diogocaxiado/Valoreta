import { ref, set, update, onValue, get, child, remove, runTransaction, query, orderByChild, limitToLast } from "firebase/database";
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
  rollId?: string;
}

export interface RoomHistoryEntry {
  historyId: string;
  agentUuid: string;
  agentName: string;
  agentIcon: string;
  rolledAt: number;
  rolledBy: string;
}

export interface PlayerData {
  name: string;
  joinedAt: number;
  lastSeen?: number;
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

export const HISTORY_LIMIT = 5;

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
        lastSeen: Date.now(),
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

export class RoomFullError extends Error {
  current: number;
  max: number;
  constructor(current: number, max: number) {
    super(`Sala cheia: ${current}/${max}`);
    this.name = "RoomFullError";
    this.current = current;
    this.max = max;
  }
}

export class RoomNotFoundError extends Error {
  constructor() {
    super("Sala não encontrada.");
    this.name = "RoomNotFoundError";
  }
}

export async function joinRoomAtomic({
  roomId,
  playerId,
  playerName,
}: JoinRoomParams): Promise<void> {
  const roomSnapshot = await get(child(ref(db), `room/${roomId}`));
  const roomData = roomSnapshot.val() as Omit<RoomData, "state"> | null;

  if (!roomData) {
    throw new RoomNotFoundError();
  }

  const playersRef = ref(db, `room/${roomId}/players`);

  const result = await runTransaction(playersRef, (currentPlayers: Record<string, PlayerData> | null) => {
    if (!currentPlayers) {
      currentPlayers = {};
    }

    if (currentPlayers[playerId]) {
      return currentPlayers;
    }

    const count = Object.keys(currentPlayers).length;
    const max = roomData.maxPlayers || MAX_PLAYERS;

    if (count >= max) {
      return undefined;
    }

    currentPlayers[playerId] = {
      name: playerName,
      joinedAt: Date.now(),
      lastSeen: Date.now(),
      isHost: roomData.hostId === playerId,
    };

    return currentPlayers;
  });

  if (result.committed) {
    const snap = result.snapshot;
    const updatedPlayers = snap.val() as Record<string, PlayerData> | null;
    if (updatedPlayers) {
      const finalCount = Object.keys(updatedPlayers).length;
      const max = roomData.maxPlayers || MAX_PLAYERS;
      if (finalCount > max) {
        await remove(ref(db, `room/${roomId}/players/${playerId}`));
        throw new RoomFullError(finalCount, max);
      }
    }
  } else {
    throw new Error("Não foi possível entrar na sala. Tente novamente.");
  }
}

export async function rejoinRoomAtomic(
  roomId: string,
  playerId: string,
  playerName: string
): Promise<void> {
  const roomSnapshot = await get(child(ref(db), `room/${roomId}`));
  const roomData = roomSnapshot.val() as Omit<RoomData, "state"> | null;

  if (!roomData) {
    throw new RoomNotFoundError();
  }

  const playersRef = ref(db, `room/${roomId}/players`);

  const result = await runTransaction(playersRef, (currentPlayers: Record<string, PlayerData> | null) => {
    if (!currentPlayers) {
      currentPlayers = {};
    }

    if (currentPlayers[playerId]) {
      currentPlayers[playerId].name = playerName;
      currentPlayers[playerId].joinedAt = Date.now();
      currentPlayers[playerId].lastSeen = Date.now();
      if (roomData.hostId === playerId) {
        currentPlayers[playerId].isHost = true;
      }
      return currentPlayers;
    }

    const count = Object.keys(currentPlayers).length;
    const max = roomData.maxPlayers || MAX_PLAYERS;

    if (count >= max) {
      return undefined;
    }

    currentPlayers[playerId] = {
      name: playerName,
      joinedAt: Date.now(),
      isHost: roomData.hostId === playerId,
    };

    return currentPlayers;
  });

  if (result.committed) {
    const snap = result.snapshot;
    const updatedPlayers = snap.val() as Record<string, PlayerData> | null;
    if (updatedPlayers) {
      const finalCount = Object.keys(updatedPlayers).length;
      const max = roomData.maxPlayers || MAX_PLAYERS;
      if (finalCount > max && !updatedPlayers[playerId]) {
        throw new RoomFullError(finalCount, max);
      }
    }
  } else {
    throw new Error("Não foi possível reconectar à sala. Tente novamente.");
  }
}

export async function autoRejoinAtomic(
  roomId: string,
  playerId: string,
  playerName: string
): Promise<boolean> {
  const roomSnapshot = await get(child(ref(db), `room/${roomId}`));
  const roomData = roomSnapshot.val() as Omit<RoomData, "state"> | null;

  if (!roomData || !roomData.players || Object.keys(roomData.players).length === 0) {
    return false;
  }

  const playersRef = ref(db, `room/${roomId}/players`);

  const result = await runTransaction(playersRef, (currentPlayers: Record<string, PlayerData> | null) => {
    if (!currentPlayers) {
      return null;
    }

    if (currentPlayers[playerId]) {
      return currentPlayers;
    }

    const count = Object.keys(currentPlayers).length;
    const max = roomData.maxPlayers || MAX_PLAYERS;

    if (count >= max) {
      return null;
    }

    const shouldBeHost = roomData.hostId === playerId;
    currentPlayers[playerId] = {
      name: playerName,
      joinedAt: Date.now(),
      isHost: shouldBeHost,
    };

    return currentPlayers;
  });

  if (result.committed) {
    const snap = result.snapshot;
    const updatedPlayers = snap.val() as Record<string, PlayerData> | null | false;
    if (updatedPlayers && typeof updatedPlayers === "object" && updatedPlayers[playerId]) {
      return true;
    }
  }

  return false;
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
    throw new Error("Apenas o host atual pode transferir o Host.");
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

export function setupPlayerPresence(_roomId: string, _playerId: string) {
  // Presença gerenciada por heartbeat (lastSeen). onDisconnect removido para
  // evitar remoção do jogador ao fechar uma aba quando outra aba ainda está ativa.
  const cancel = () => {};
  return { cancel };
}

export function cancelPresence(_roomId: string, _playerId: string) {
  // No-op: presença gerenciada por heartbeat (lastSeen).
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
  callback: (players: Record<string, PlayerData> | null) => void | Promise<void>
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

export async function recordRoomHistory(
  roomId: string,
  entry: RoomHistoryEntry
): Promise<void> {
  const historyRef = ref(db, `room/${roomId}/history`);

  await runTransaction(historyRef, (current: Record<string, RoomHistoryEntry> | null) => {
    const map = current ?? {};

    map[entry.historyId] = entry;

    const existing = Object.values(map);
    if (existing.length > HISTORY_LIMIT) {
      const sorted = [...existing].sort((a, b) => a.rolledAt - b.rolledAt);
      const toRemove = sorted.slice(0, existing.length - HISTORY_LIMIT);
      toRemove.forEach((e) => {
        delete map[e.historyId];
      });
    }

    return map;
  });
}

export function subscribeRoomHistory(
  roomId: string,
  callback: (entries: RoomHistoryEntry[] | null) => void
) {
  const historyQuery = query(
    ref(db, `room/${roomId}/history`),
    orderByChild("rolledAt"),
    limitToLast(HISTORY_LIMIT)
  );

  return onValue(historyQuery, (snapshot) => {
    const val = snapshot.val() as Record<string, RoomHistoryEntry> | null;
    if (!val) {
      callback(null);
      return;
    }

    const entries = Object.entries(val).map(([key, entry]) => ({
      ...entry,
      historyId: entry.historyId ?? key,
    }));

    callback(entries);
  });
}

export const ROOM_INACTIVITY_TIMEOUT_MS = 60 * 1000;

export function touchPlayerPresence(roomId: string, playerId: string) {
  const playerRef = ref(db, "room/" + roomId + "/players/" + playerId);
  update(playerRef, {
    lastSeen: Date.now(),
  }).catch(() => {});
}

export interface RoomSummary {
  id: string;
  hostId: string;
  hostName: string;
  hasPassword: boolean;
  playerCount: number;
  maxPlayers: number;
  status: "waiting" | "playing" | "finished";
  createdAt: number;
}

export function subscribeRooms(callback: (rooms: RoomSummary[]) => void) {
  const roomsRef = ref(db, "room");
  return onValue(roomsRef, (snapshot) => {
    const val = snapshot.val() as Record<string, RoomData> | null;
    if (!val) {
      callback([]);
      return;
    }

    const now = Date.now();
    const list: RoomSummary[] = [];

    for (const [id, data] of Object.entries(val)) {
      if (!data) continue;
      const players = data.players || {};
      const playerEntries = Object.entries(players);
      const playerCount = playerEntries.length;

      // 1. Se a sala não tem jogadores, remove do Firebase imediatamente
      if (playerCount === 0) {
        deleteRoom(id).catch(() => {});
        continue;
      }

      // 2. Verifica se algum jogador esteve ativo recentemente (últimos 60s)
      const hasActivePlayer = playerEntries.some(([, p]) => {
        const lastActivity = p.lastSeen || p.joinedAt || 0;
        return now - lastActivity < ROOM_INACTIVITY_TIMEOUT_MS;
      });

      // Se a sala estiver abandonada/zumbi sem ninguém ativo, limpa do Firebase
      if (!hasActivePlayer) {
        deleteRoom(id).catch(() => {});
        continue;
      }

      const hostPlayer = data.players?.[data.hostId];
      const hostName = hostPlayer?.name || "Host";

      list.push({
        id,
        hostId: data.hostId,
        hostName,
        hasPassword: Boolean(data.password && data.password.length > 0),
        playerCount,
        maxPlayers: data.maxPlayers || MAX_PLAYERS,
        status: data.status || "waiting",
        createdAt: data.createdAt || 0,
      });
    }

    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    callback(list);
  });
}
