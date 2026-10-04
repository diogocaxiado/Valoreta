import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { IAgent, IAgentAbilities } from "../../../types";
import { fetchAgents } from "../../../infra/valorant/valorantService";
import { createSpinAnimation } from "../utils/spinEngine";
import { RoomState, recordRoomHistory, RoomHistoryEntry } from "../../../services/roomService";
import { recordSoloHistory } from "../../../services/soloHistory";

interface UseRouletteOptions {
  mode: "solo" | "multiplayer";
  roomId?: string;
  roomState?: RoomState | null;
  syncToRoom?: (data: Partial<RoomState>) => void;
  playerId?: string;
  isHost?: boolean;
}

const ROLL_DURATION = 2000;

export function useRoulette({
  mode,
  roomId,
  roomState,
  syncToRoom,
  playerId,
  isHost,
}: UseRouletteOptions) {
  const isMultiplayer = mode === "multiplayer" && !!syncToRoom;
  const wasRollingRef = useRef(false);
  const canAct = !isMultiplayer || isHost;

  const {
    data: agents,
    isLoading,
    error: apiError,
  } = useQuery({
    queryKey: ["agents", "pt-BR"],
    queryFn: () => fetchAgents({ isPlayableCharacter: true, language: "pt-BR" }),
    staleTime: 1000 * 60 * 30,
  });

  const [enabledAgents, setEnabledAgents] = useState<IAgent[]>([]);
  const [randomAgent, setRandomAgent] = useState("");
  const [abilities, setAbilities] = useState<IAgentAbilities[]>([]);
  const [descriptionAbility, setDescriptionAbility] = useState<
    IAgentAbilities | string
  >("");
  const [isSpinning, setIsSpinning] = useState(false);

  const spinRef = useRef<{ cancel: () => void } | null>(null);

  const recordRoll = useCallback(
    (
      winner: IAgent,
      rollState: Pick<RoomState, "rollId" | "rollStartedAt" | "rollInitiatedBy">
    ) => {
      if (!isMultiplayer || !roomId) return;
      if (!rollState.rollInitiatedBy || rollState.rollInitiatedBy !== playerId) return;

      const historyId =
        rollState.rollId ||
        `legacy_${rollState.rollStartedAt ?? Date.now()}_${rollState.rollInitiatedBy}`;

      const entry: RoomHistoryEntry = {
        historyId,
        agentUuid: winner.uuid,
        agentName: winner.displayName,
        agentIcon: winner.displayIcon,
        rolledAt: (rollState.rollStartedAt ?? Date.now()) + ROLL_DURATION,
        rolledBy: rollState.rollInitiatedBy,
      };

      recordRoomHistory(roomId, entry).catch((err) => {
        console.error("Falha ao salvar histórico do sorteio", err);
      });
    },
    [isMultiplayer, roomId, playerId]
  );

  const recordSoloRoll = useCallback((winner: IAgent) => {
    const entry: RoomHistoryEntry = {
      historyId: `solo_${crypto.randomUUID()}`,
      agentUuid: winner.uuid,
      agentName: winner.displayName,
      agentIcon: winner.displayIcon,
      rolledAt: Date.now(),
      rolledBy: "solo",
    };

    recordSoloHistory(entry);
  }, []);

  useEffect(() => {
    if (agents) {
      setEnabledAgents(agents);
    }
  }, [agents]);

  useEffect(() => {
    if (!isMultiplayer || !roomState) return;

    setRandomAgent(roomState.agentUuid ?? "");
    setAbilities(roomState.agentAbilities || []);
    setDescriptionAbility(roomState.agentDescription ?? "");
    if (roomState.enabledAgents && agents) {
      const filtered = agents.filter((a) =>
        roomState.enabledAgents!.includes(a.uuid)
      );
      setEnabledAgents(filtered);
    }
  }, [roomState, agents, isMultiplayer]);

  useEffect(() => {
    return () => spinRef.current?.cancel();
  }, []);

  useEffect(() => {
    if (!isMultiplayer || !roomState || !agents) return;

    const isRolling = roomState.rolling === true;
    const wasRolling = wasRollingRef.current;
    wasRollingRef.current = isRolling;

    if (!isRolling) {
      setIsSpinning(false);
      return;
    }

    if (wasRolling) return;

    const rollWinner = roomState.rollWinner;
    if (!rollWinner) return;

    const winnerAgent = agents.find((a) => a.uuid === rollWinner);
    if (!winnerAgent) return;

    setIsSpinning(true);
    setDescriptionAbility("");
    spinRef.current?.cancel();

    const elapsed = Date.now() - (roomState.rollStartedAt || Date.now());
    const remaining = Math.max(0, ROLL_DURATION - elapsed);

    if (remaining <= 100) {
      setRandomAgent(rollWinner);
      if (roomState.agentAbilities) setAbilities(roomState.agentAbilities);
      if (roomState.agentDescription) setDescriptionAbility(roomState.agentDescription);

      if (roomState.rollInitiatedBy === playerId) {
        syncToRoom!({ rolling: false });
        recordRoll(winnerAgent, roomState);
      }

      setIsSpinning(false);
      return;
    }

    const animation = createSpinAnimation(enabledAgents, {
      onTick: (agent) => setRandomAgent(agent.uuid),
      onComplete: () => {
        setRandomAgent(rollWinner);
        if (roomState.agentAbilities) setAbilities(roomState.agentAbilities);
        if (roomState.agentDescription) setDescriptionAbility(roomState.agentDescription);

        if (roomState.rollInitiatedBy === playerId) {
          syncToRoom!({ rolling: false });
          recordRoll(winnerAgent, roomState);
        }

        setIsSpinning(false);
      },
    }, winnerAgent);

    spinRef.current = animation;
  }, [roomState?.rolling, roomState?.rollWinner, agents, isMultiplayer, syncToRoom, playerId, enabledAgents, recordRoll]);

  const handleClickButton = useCallback(() => {
    if (!enabledAgents.length || isSpinning) return;
    if (isMultiplayer && (!canAct || roomState?.rolling)) return;

    if (isMultiplayer) {
      const winner = enabledAgents[Math.floor(Math.random() * enabledAgents.length)];

      syncToRoom!({
        rolling: true,
        rollId: crypto.randomUUID(),
        rollWinner: winner.uuid,
        rollStartedAt: Date.now(),
        rollInitiatedBy: playerId,
        agentUuid: winner.uuid,
        agentAbilities: winner.abilities,
        agentDescription: winner.description,
      });

      return;
    }

    setIsSpinning(true);
    setDescriptionAbility("");

    const animation = createSpinAnimation(enabledAgents, {
      onTick: (agent) => setRandomAgent(agent.uuid),
      onComplete: (agent) => {
        setRandomAgent(agent.uuid);
        setAbilities(agent.abilities);
        recordSoloRoll(agent);
        setIsSpinning(false);
      },
    });

    spinRef.current = animation;
  }, [enabledAgents, isSpinning, isMultiplayer, canAct, roomState?.rolling, syncToRoom, playerId]);

  const syncEnabled = useCallback(
    (updated: IAgent[]) => {
      setEnabledAgents(updated);
      if (isMultiplayer) {
        syncToRoom!({ enabledAgents: updated.map((a) => a.uuid) });
      }
    },
    [isMultiplayer, syncToRoom]
  );

  const handleEnabledAgent = useCallback(
    (agent: IAgent) => {
      if (isMultiplayer && !canAct) return;
      if (randomAgent) return;

      const isEnabled = enabledAgents.some((item) => item.uuid === agent.uuid);

      const updated = isEnabled
        ? enabledAgents.filter((item) => item.uuid !== agent.uuid)
        : [...enabledAgents, agent];

      syncEnabled(updated);
    },
    [enabledAgents, isMultiplayer, canAct, randomAgent, syncEnabled]
  );

  const handleRoleToggle = useCallback(
    (roleName: string) => {
      if (isMultiplayer && !canAct) return;
      if (randomAgent) return;
      if (!agents) return;

      const roleAgents = agents.filter((a) => a.role.displayName === roleName);
      if (!roleAgents.length) return;

      const allEnabled = roleAgents.every((r) =>
        enabledAgents.some((e) => e.uuid === r.uuid)
      );

      if (allEnabled) {
        syncEnabled(enabledAgents.filter(
          (e) => !roleAgents.some((r) => r.uuid === e.uuid)
        ));
      } else {
        const existing = new Set(enabledAgents.map((a) => a.uuid));
        syncEnabled([...enabledAgents, ...roleAgents.filter((a) => !existing.has(a.uuid))]);
      }
    },
    [agents, enabledAgents, isMultiplayer, canAct, randomAgent, syncEnabled]
  );

  const handleClickAgent = useCallback(() => {
    if (isMultiplayer && !canAct) return;
    setRandomAgent("");

    if (isMultiplayer) {
      syncToRoom!({
        agentUuid: "",
        agentAbilities: [],
        agentDescription: "",
      });
    }
  }, [isMultiplayer, canAct, syncToRoom]);

  const getAgentData = useCallback(
    (property: string) => {
      const result = agents?.find((a) => a.uuid === randomAgent);
      return result ? String(result[property as keyof IAgent] ?? "") : "";
    },
    [agents, randomAgent]
  );

  const getAgentClass = useCallback(
    (property: string) => {
      const result = agents?.find((a) => a.uuid === randomAgent);
      if (!result?.role) return "";
      return String(result.role[property as keyof typeof result.role] ?? "");
    },
    [agents, randomAgent]
  );

  const getAgentAbilities = useCallback(
    (agentUuid: string) => {
      const result = agents?.find((a) => a.uuid === agentUuid);
      if (result) setAbilities(result.abilities);
    },
    [agents]
  );

  return {
    state: {
      agents,
      enabledAgents,
      randomAgent,
      abilities,
      descriptionAbility,
      isSpinning,
      isLoading,
      error: apiError,
      isHost: !!isHost,
      canAct,
    },
    actions: {
      handleClickButton,
      handleEnabledAgent,
      handleRoleToggle,
      handleClickAgent,
      getAgentData,
      getAgentClass,
      getAgentAbilities,
      setDescriptionAbility,
    },
  };
}
