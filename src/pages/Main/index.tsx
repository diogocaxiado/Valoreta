import { useEffect, useState } from "react";
import useCallApi from "../../hooks/useCallApi";
import Background from "../../components/Background/Background";
import Message from "../../components/Message/Message";
import CardAgents from "../../components/CardAgents/CardAgents";
import Button from "../../components/Button/Button";
import BackgroundAgent from "../../components/PortraitAgent/PortraitAgent";
import Overview from "../../components/Overview/Overview";

import { IAgent } from "../../types";
import BgScreen from "../../assets/video/Valorant-2.mp4";

import { useNavigate, useParams } from "react-router-dom";
import { updateRoomState } from "../../api/rouletteService";
import { useRoulette } from "../../hooks/useRoullete";
import ChangeLanguage from "../../components/ChangeLanguage/ChangeLanguage";
import Topbar from "../Lobby/components/Topbar";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const App = () => {
  const [randomAgent, setRandomAgent] = useState("");
  const [abilities, setAbilities] = useState([]);
  const [descriptionAbility, setDescriptionAbility] = useState("");
  const { roomId } = useParams<{ roomId: string }>();
  const { data, loading } = useRoulette(roomId || 'default');
  const navigate = useNavigate();

  const {
    data: agents,
    isLoading,
    error,
  } = useCallApi<IAgent[]>({
    endpoint: "agents",
    filters: {
      isPlayableCharacter: true,
      language: "pt-BR",
    },
  });
  const [enabledAgents, setEnabledAgents] = useState<IAgent[] | any>(null);

  useEffect(() => {
    if (agents) {
      setEnabledAgents(agents)
    }
  }, [agents])

  useEffect(() => {
    if (roomId && data) {
      setRandomAgent(data.agentUuid);
      setAbilities(data.agentAbilities);
      setDescriptionAbility(data.agentDescription);
    }
  }, [data, roomId]);

  useEffect(() => {
    if (data?.enabledAgents && agents) {
      const filteredAgents = agents.filter(agent =>
        data.enabledAgents.includes(agent.uuid)
      );

      setEnabledAgents(filteredAgents);
    }
  }, [data, agents]);

  function handleClickButton() {
    if (!enabledAgents || enabledAgents.length === 0) return;

    const randomIndex = Math.floor(Math.random() * (enabledAgents.length));
    const selectedAgent = enabledAgents[randomIndex];

    setRandomAgent(selectedAgent.uuid);
    getAgentAbilities(selectedAgent.uuid);
    const random = Math.floor(Math.random() * (enabledAgents.length));
    setRandomAgent(enabledAgents[random].uuid);
    getAgentAbilities(enabledAgents[random].uuid);
    setDescriptionAbility("");

    const newAgentData = {
      agentUuid: selectedAgent.uuid,
      agentAbilities: selectedAgent.abilities,
      agentDescription: selectedAgent.description
    };

    if (roomId) {
      updateRoomState({
        roomId: roomId,
        data: newAgentData
      });
    } else {
      setRandomAgent(newAgentData.agentUuid);
      setAbilities(newAgentData.agentAbilities);
      setDescriptionAbility(newAgentData.agentDescription);
    }
  }

  const handleClearAgentButton = () => {
    setEnabledAgents(agents);
  };

  const handleSelectAllAgentButton = () => {
    setRandomAgent("");
    setEnabledAgents([]);
  }

  function handleClickAgent() {
    setRandomAgent("");
    updateRoomState({roomId: roomId || 'default', data: { agentUuid: "", agentAbilities: [], agentDescription: ""}});
  }

  function getAgentData(property: string) {
    const result = enabledAgents?.find(
      (agent: IAgent) => agent.uuid === randomAgent
    );
    return result[property];
  }

  function getAgentClass(property: string) {
    const result = enabledAgents?.find(
      (agent: IAgent) => agent.uuid === randomAgent
    );
    return result.role[property];
  }

  function getAgentAbilities(randomA: string) {
    const result = enabledAgents?.find((agent: IAgent) => agent.uuid === randomA);
    setAbilities(result.abilities);
  }

  function handleEnabledAgent(agent: IAgent) {
    const isEnabled = enabledAgents.some(
      (item) => item.uuid === agent.uuid
    );

    let updatedAgents;

    if (!isEnabled) {
      updatedAgents = [...enabledAgents, agent];
    } else {
      updatedAgents = enabledAgents.filter(
        (item) => item.uuid !== agent.uuid
      );
    }

    setEnabledAgents(updatedAgents);

    if (roomId) {
      updateRoomState({
        roomId,
        data: {
          enabledAgents: updatedAgents.map(a => a.uuid)
        }
      });
    }
  }

  if (isLoading) {
    return <h1>loading...</h1>;
  }

  if (error) {
    return <h1>{error.message}</h1>;
  }

  return (
    <>
      <main className="flex flex-col justify-center w-screen h-screen">
        <Background type="video" src={BgScreen} />
        <div className="flex justify-start absolute top-4 left-4 z-20">
          <button
            onClick={() => navigate('/')}
            className="
              flex items-center gap-2 border border-valorant-cyan text-valorant-cyan 
              font-tungsten text-2xl uppercase tracking-[2px]
              px-5 py-2 rounded-sm bg-transparent
              hover:bg-valorant-cyan hover:text-black
              hover:transition-all hover:duration-300
            "
          >
            <ArrowLeftIcon className="w-6 h-6" />
            Voltar
          </button>
        </div>

        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
          <Topbar title="Sala" />
        </div>
        
        {/* Em construção */}
        {/* <div className="flex justify-end py-4 px-8 z-0">
          <ChangeLanguage />
        </div> */}

        {randomAgent && (
          <BackgroundAgent
            getAgentData={getAgentData}
            getAgentClass={getAgentClass}
          />
        )}

        {randomAgent && (
          <Overview
            getAgentData={getAgentData}
            getAgentClass={getAgentClass}
            abilities={abilities}
            descriptionAbility={descriptionAbility}
            setDescriptionAbility={setDescriptionAbility}
          />
        )}

        <Message randomAgent={randomAgent} />

        <div className="flex justify-center">
          <Button title="Rodar" variant="primary" handleClickButton={handleClickButton} disabled={enabledAgents?.length === 0} />
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
          <Button title="Limpar seleção" handleClickButton={handleClearAgentButton} />
          <Button title="Selecionar todos" handleClickButton={handleSelectAllAgentButton} />
        </div>
      </main>
    </>
  );
};

export default App;
