import { useNavigate, useParams } from "react-router-dom";
import { useRoulette } from "./hooks/useRoulette";
import { useRoom } from "../../hooks/useRoom";
import { useRoomPresence } from "../../hooks/useRoomPresence";
import { getPlayerId } from "../../services/playerSession";

import { Background } from "../../common/components/Background/Background";
import { Topbar } from "../../common/components/Topbar/Topbar";
import { Button } from "../../common/components/Button/Button";
import { Button as ShadcnButton } from "../../common/components/ui/button";
import { AgentPortrait } from "./components/AgentPortrait";
import { AgentOverview } from "./components/AgentOverview";
import { RouletteMessage } from "./components/RouletteMessage";
import { CardAgents } from "./components/CardAgents";
import { PlayerList } from "./components/PlayerList";
import { RoomAccessGate } from "./components/RoomAccessGate";
import { leaveRoom } from "../../services/roomService";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
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
    isMultiplayer ? roomId : undefined
  );

  const { players, playerCount, isConnected: isPresenceConnected, currentPlayer } =
    useRoomPresence(isMultiplayer ? roomId : undefined, isMultiplayer ? playerId : undefined);

  const { state, actions } = useRoulette({
    mode,
    roomState,
    syncToRoom: isMultiplayer ? syncToRoom : undefined,
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
  } = state;

  const {
    handleClickButton,
    handleEnabledAgent,
    handleClearAgentButton,
    handleSelectAllAgentButton,
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

      <RouletteMessage randomAgent={randomAgent} />

      <div className="flex justify-center">
        <Button
          title="Rodar"
          variant="primary"
          onClick={handleClickButton}
          disabled={enabledAgents.length === 0}
          loading={isSpinning}
        />
      </div>

      {agents && (
        <CardAgents
          agents={agents}
          enabledAgents={enabledAgents}
          randomAgent={randomAgent}
          handleClickAgent={handleClickAgent}
          handleEnabledAgent={handleEnabledAgent}
        />
      )}

      <div className="flex justify-center gap-4 mt-2">
        <Button
          title="Limpar seleção"
          onClick={handleClearAgentButton}
        />
        <Button
          title="Selecionar todos"
          onClick={handleSelectAllAgentButton}
        />
      </div>
    </main>
  );
}
