import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { IAgent, IAgentAbilities } from "../../../types";
import { fetchAgents } from "../../../infra/valorant/valorantService";
import { createSpinAnimation } from "../utils/spinEngine";
import { RoomState } from "../../../services/roomService";

interface UseRouletteOptions {
  mode: "solo" | "multiplayer";
  roomState?: RoomState | null;
  syncToRoom?: (data: Partial<RoomState>) => void;
}

export function useRoulette({
  mode,
  roomState,
  syncToRoom,
}: UseRouletteOptions) {
  const isMultiplayer = mode === "multiplayer" && !!syncToRoom;

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

  useEffect(() => {
    if (agents) {
      setEnabledAgents(agents);
    }
  }, [agents]);

  useEffect(() => {
    if (!isMultiplayer || !roomState) return;

    if (roomState.agentUuid) setRandomAgent(roomState.agentUuid);
    if (roomState.agentAbilities) setAbilities(roomState.agentAbilities);
    if (roomState.agentDescription)
      setDescriptionAbility(roomState.agentDescription);
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

  const handleClickButton = useCallback(() => {
    if (!enabledAgents.length || isSpinning) return;

    setIsSpinning(true);
    setDescriptionAbility("");

    const animation = createSpinAnimation(enabledAgents, {
      onTick: (agent) => setRandomAgent(agent.uuid),
      onComplete: (agent) => {
        setRandomAgent(agent.uuid);
        setAbilities(agent.abilities);
        setIsSpinning(false);

        if (isMultiplayer) {
          syncToRoom!({
            agentUuid: agent.uuid,
            agentAbilities: agent.abilities,
            agentDescription: agent.description,
          });
        }
      },
    });

    spinRef.current = animation;
  }, [enabledAgents, isSpinning, isMultiplayer, syncToRoom]);

  const handleEnabledAgent = useCallback(
    (agent: IAgent) => {
      const isEnabled = enabledAgents.some((item) => item.uuid === agent.uuid);

      const updated = isEnabled
        ? enabledAgents.filter((item) => item.uuid !== agent.uuid)
        : [...enabledAgents, agent];

      setEnabledAgents(updated);

      if (isMultiplayer) {
        syncToRoom!({ enabledAgents: updated.map((a) => a.uuid) });
      }
    },
    [enabledAgents, isMultiplayer, syncToRoom]
  );

  const handleClearAgentButton = useCallback(() => {
    if (agents) setEnabledAgents(agents);
  }, [agents]);

  const handleSelectAllAgentButton = useCallback(() => {
    setRandomAgent("");
    setEnabledAgents([]);
  }, []);

  const handleClickAgent = useCallback(() => {
    setRandomAgent("");

    if (isMultiplayer) {
      syncToRoom!({
        agentUuid: "",
        agentAbilities: [],
        agentDescription: "",
      });
    }
  }, [isMultiplayer, syncToRoom]);

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
    },
    actions: {
      handleClickButton,
      handleEnabledAgent,
      handleClearAgentButton,
      handleSelectAllAgentButton,
      handleClickAgent,
      getAgentData,
      getAgentClass,
      getAgentAbilities,
      setDescriptionAbility,
    },
  };
}
