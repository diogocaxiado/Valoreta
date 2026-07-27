import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useRoulette } from "./hooks/useRoulette";
import { useRoom } from "../../hooks/useRoom";
import { useRoomPresence } from "../../hooks/useRoomPresence";
import { getPlayerId } from "../../services/playerSession";

import { Background } from "../../common/components/Background/Background";
import { Topbar } from "../../common/components/Topbar/Topbar";
import { Button } from "../../common/components/Button/Button";
import { Button as ShadcnButton } from "../../common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../common/components/ui/dialog";
import { AgentPortrait } from "./components/AgentPortrait";
import { AgentOverview } from "./components/AgentOverview";
import { RouletteMessage } from "./components/RouletteMessage";
import { CardAgents } from "./components/CardAgents";
import { RoleFilter } from "./components/RoleFilter";
import { PlayerList } from "./components/PlayerList";
import { RoomAccessGate } from "./components/RoomAccessGate";
import { leaveRoom, transferHost } from "../../services/roomService";
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";
import BgScreen from "../../assets/video/Valorant-2.mp4";

interface RoomPageProps {
  mode: "solo" | "multiplayer";
}

export function RoomPage({ mode }: RoomPageProps) {
  const { roomId } = useParams<{ roomId: string }>();
  const playerId = getPlayerId();
  const isMultiplayer = mode === "multiplayer" && !!roomId;

  if (isMultiplayer) {
    return (
      <RoomAccessGate roomId={roomId!} playerId={playerId}>
        <RoomLayout roomId={roomId!} playerId={playerId} mode="multiplayer" />
      </RoomAccessGate>
    );
  }

  return <RoomLayout mode="solo" />;
}

interface RoomLayoutProps {
  mode: "solo" | "multiplayer";
  roomId?: string;
  playerId?: string;
}

function RoomLayout({ mode, roomId, playerId }: RoomLayoutProps) {
  const navigate = useNavigate();
  const isMultiplayer = mode === "multiplayer" && !!roomId;

  const { roomState, isConnected: isGameConnected, syncToRoom } = useRoom(
    isMultiplayer ? roomId : undefined,
    isMultiplayer ? playerId : undefined
  );

  const { players, playerCount, isConnected: isPresenceConnected, currentPlayer } =
    useRoomPresence(isMultiplayer ? roomId : undefined, isMultiplayer ? playerId : undefined);

  const isHost = currentPlayer?.isHost ?? false;
  const notifiedRef = useRef(false);
  const prevHostIdRef = useRef<string | null>(null);
  const [transferTarget, setTransferTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (isMultiplayer && currentPlayer && !isHost && !notifiedRef.current) {
      notifiedRef.current = true;
      toast.info("Você entrou como Participante", {
        description: "Somente o Host pode iniciar a roleta e gerenciar os personagens do sorteio.",
        duration: 6000,
      });
    }
  }, [isMultiplayer, currentPlayer, isHost]);

  useEffect(() => {
    if (!isMultiplayer || !players.length || !currentPlayer) return;

    const currentHost = players.find((p) => p.isHost);
    const currentHostId = currentHost?.id ?? null;

    if (prevHostIdRef.current !== null && currentHostId !== prevHostIdRef.current) {
      const newHost = players.find((p) => p.id === currentHostId);
      const newHostName = newHost?.name ?? "Um jogador";

      if (currentHostId === playerId) {
        toast.success("Você agora é o Host da sala", {
          description:
            "Agora você pode iniciar a roleta, gerenciar os agentes participantes, alterar as configurações da sala e transferir o Host para outro jogador.",
          duration: 8000,
        });
      } else if (prevHostIdRef.current === playerId) {
        toast.success(`Host transferido para ${newHostName}`, {
          description: "Agora você participa da sala como um jogador comum.",
          duration: 8000,
        });
      } else {
        toast.info(`${newHostName} agora é o novo Host da sala.`, {
          duration: 6000,
        });
      }
    }

    if (currentHostId !== null) {
      prevHostIdRef.current = currentHostId;
    }
  }, [isMultiplayer, players, currentPlayer, playerId]);

  const handleTransferHost = useCallback((newHostId: string) => {
    if (!roomId || !playerId) return;
    const targetPlayer = players.find((p) => p.id === newHostId);
    const targetName = targetPlayer?.name || "jogador";
    setTransferTarget({ id: newHostId, name: targetName });
  }, [roomId, playerId, players]);

  const handleConfirmTransfer = useCallback(async () => {
    if (!roomId || !playerId || !transferTarget) return;
    try {
      await transferHost(roomId, playerId, transferTarget.id);
      setTransferTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao transferir host");
      setTransferTarget(null);
    }
  }, [roomId, playerId, transferTarget]);

  const { state, actions } = useRoulette({
    mode,
    roomState,
    syncToRoom: isMultiplayer ? syncToRoom : undefined,
    playerId: isMultiplayer ? playerId : undefined,
    isHost: isMultiplayer ? isHost : undefined,
  });

  const {
    agents,
    enabledAgents,
    randomAgent,
    abilities,
    descriptionAbility,
    isSpinning,
    isLoading,
    error,
    canAct,
  } = state;

  const {
    handleClickButton,
    handleEnabledAgent,
    handleRoleToggle,
    handleClickAgent,
    getAgentData,
    getAgentClass,
    setDescriptionAbility,
  } = actions;

  if (isLoading) {
    return (
      <main className="flex flex-col justify-center items-center w-screen h-screen bg-black">
        <div className="animate-pulse text-valorant-cyan font-montserrat font-bold text-h2 uppercase tracking-widest">
          Carregando...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col justify-center items-center w-screen h-screen bg-black">
        <h1 className="text-h2 text-valorant-red font-montserrat font-bold uppercase tracking-widest mb-4">
          Erro ao carregar dados
        </h1>
        <p className="text-white font-prompt text-lg">{error.message}</p>
        <ShadcnButton
          variant="outline"
          size="lg"
          onClick={() => navigate("/")}
        >
          Voltar ao início
        </ShadcnButton>
      </main>
    );
  }

  return (
    <main className="flex flex-col justify-center w-screen h-screen">
      <Background type="video" src={BgScreen} />

      <div className="flex justify-start absolute top-4 left-4 z-20">
        <ShadcnButton
          variant="outline"
          size="default"
          onClick={() => {
            if (isMultiplayer && roomId) {
              leaveRoom(roomId, playerId!)
            }
            navigate("/")
          }}
          className="flex items-center gap-2 px-5 py-2 h-auto"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Voltar
        </ShadcnButton>
      </div>

      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        <Topbar title={isMultiplayer ? `Sala: ${roomId}` : "Solo"} />
        {isMultiplayer && (
          <span
            className={`w-3 h-3 rounded-full ${
              isPresenceConnected ? "bg-valorant-green" : "bg-red-500 animate-pulse"
            }`}
            title={isPresenceConnected ? "Conectado" : "Desconectado"}
          />
        )}
      </div>

      {isMultiplayer && (
        <div className="absolute top-20 left-4 z-20">
          <PlayerList
            players={players}
            playerCount={playerCount}
            currentPlayerId={playerId}
            isHost={isHost}
            hostName={players.find((p) => p.isHost)?.name}
            onTransferHost={isHost ? handleTransferHost : undefined}
          />
        </div>
      )}

      {randomAgent && (
        <AgentPortrait
          getAgentData={getAgentData}
          getAgentClass={getAgentClass}
        />
      )}

      {randomAgent && (
        <AgentOverview
          getAgentData={getAgentData}
          getAgentClass={getAgentClass}
          abilities={abilities}
          descriptionAbility={descriptionAbility}
          setDescriptionAbility={setDescriptionAbility}
        />
      )}

      <RouletteMessage randomAgent={randomAgent} isMultiplayer={isMultiplayer} isHost={isHost} />

      <div className="flex justify-center gap-4">
        <Button
          title="Rodar"
          variant="primary"
          onClick={handleClickButton}
          disabled={enabledAgents.length === 0 || (isMultiplayer && !canAct)}
          loading={isSpinning}
          restricted={isMultiplayer && !canAct}
          tooltip={isMultiplayer && !canAct ? "Apenas o host da sala pode executar esta ação." : undefined}
        />
      </div>

      {agents && (
        <>
          <CardAgents
            agents={agents}
            enabledAgents={enabledAgents}
            randomAgent={randomAgent}
            handleClickAgent={handleClickAgent}
            handleEnabledAgent={handleEnabledAgent}
            canInteract={canAct}
          />

          <RoleFilter
            agents={agents}
            enabledAgents={enabledAgents}
            onRoleToggle={handleRoleToggle}
            canInteract={canAct}
          />
        </>
      )}

      <Dialog open={transferTarget !== null} onOpenChange={(open) => { if (!open) setTransferTarget(null); }}>
        <DialogContent className="border-cyan-400/50">
          <DialogHeader>
            <DialogTitle>Transferir Host</DialogTitle>
          </DialogHeader>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <XMarkIcon className="w-5 h-5" />
          </DialogClose>
          <DialogDescription className="my-6">
            Deseja transferir o Host da sala para <strong>{transferTarget?.name}</strong>?
          </DialogDescription>
          <div className="flex justify-end gap-2">
            <ShadcnButton
              variant="outline"
              size="default"
              onClick={() => setTransferTarget(null)}
            >
              Cancelar
            </ShadcnButton>
            <ShadcnButton
              variant="default"
              size="default"
              onClick={handleConfirmTransfer}
            >
              Confirmar
            </ShadcnButton>
          </div>
        </DialogContent>
      </Dialog>

    </main>
  );
}
