import { fetchRoomData, RoomData, MAX_PLAYERS, deleteRoom, ROOM_INACTIVITY_TIMEOUT_MS } from "./roomService";

export type RoomAccessError =
  | { code: "ROOM_NOT_FOUND"; message: string }
  | { code: "ROOM_FULL"; message: string; current: number; max: number }
  | { code: "WRONG_PASSWORD"; message: string };

export function roomNotFoundError(): RoomAccessError {
  return {
    code: "ROOM_NOT_FOUND",
    message: "Sala não encontrada.",
  };
}

export function roomFullError(
  current: number,
  max: number
): RoomAccessError {
  return {
    code: "ROOM_FULL",
    message: `Esta sala atingiu o limite máximo de ${max} jogadores.`,
    current,
    max,
  };
}

export function wrongPasswordError(): RoomAccessError {
  return {
    code: "WRONG_PASSWORD",
    message: "Senha incorreta.",
  };
}

export interface RoomValidationResult {
  valid: boolean;
  error?: RoomAccessError;
  data?: RoomData;
  hasPassword: boolean;
  alreadyInRoom?: boolean;
}

export async function validateRoomAccess(
  roomId: string,
  playerId?: string
): Promise<RoomValidationResult> {
  const data = await fetchRoomData(roomId);

  if (!data) {
    return {
      valid: false,
      error: roomNotFoundError(),
      hasPassword: false,
    };
  }

  if (!data.players || Object.keys(data.players).length === 0) {
    await deleteRoom(roomId);
    return {
      valid: false,
      error: roomNotFoundError(),
      hasPassword: false,
    };
  }

  const now = Date.now();
  const playerEntries = Object.entries(data.players);
  const hasActivePlayer = playerEntries.some(([, p]) => {
    const lastActivity = p.lastSeen || p.joinedAt || 0;
    return now - lastActivity < ROOM_INACTIVITY_TIMEOUT_MS;
  });

  if (!hasActivePlayer && data.hostId !== playerId) {
    await deleteRoom(roomId);
    return {
      valid: false,
      error: roomNotFoundError(),
      hasPassword: false,
    };
  }

  if (playerId && (data.hostId === playerId || (data.players && data.players[playerId]))) {
    return {
      valid: true,
      hasPassword: false,
      data,
      alreadyInRoom: !!(data.players && data.players[playerId]),
    };
  }

  const playerCount = data.players
    ? Object.keys(data.players).length
    : 0;

  if (playerCount >= (data.maxPlayers || MAX_PLAYERS)) {
    return {
      valid: false,
      error: roomFullError(playerCount, data.maxPlayers || MAX_PLAYERS),
      hasPassword: false,
      data,
    };
  }

  const hasPassword = !!data.password;

  return {
    valid: true,
    hasPassword,
    data,
  };
}

export function roomHasPassword(roomData: RoomData): boolean {
  return !!roomData.password;
}
