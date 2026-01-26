import { useEffect, useState } from "react";
import useCallApi from "../../hooks/useCallApi";
import Background from "../../components/Background/Background";
import Message from "../../components/Message/Message";
import CardAgents from "../../components/CardAgents/CardAgents";
import Button from "../../components/Button/Button";
import BackgroundAgent from "../../components/PortraitAgent/PortraitAgent";
import Overview from "../../components/Overview/Overview";

import { IAgent } from "../../types";
import BgScreen from "../../assets/image/background.jpg";

import { useParams } from "react-router-dom";
import { updateRoomState } from "../../api/rouletteService";
import { useRoulette } from "../../hooks/useRoullete";
import ChangeLanguage from "../../components/ChangeLanguage/ChangeLanguage";

const App = () => {
  const [randomAgent, setRandomAgent] = useState("");
  const [abilities, setAbilities] = useState([]);
  const [descriptionAbility, setDescriptionAbility] = useState("");
  const { roomId } = useParams<{ roomId: string }>();
  const { data, loading } = useRoulette(roomId || 'default');

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

  useEffect(() => {
    if (roomId && data) {
      setRandomAgent(data.agentUuid);
      setAbilities(data.agentAbilities);
      setDescriptionAbility(data.agentDescription);
    }
  }, [data, roomId]);

  function handleClickButton() {
    if (!agents || agents.length === 0) return;

    const randomIndex = Math.floor(Math.random() * (agents.length - 1));
    const selectedAgent = agents[randomIndex];

    setRandomAgent(selectedAgent.uuid);
    getAgentAbilities(selectedAgent.uuid);
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

  function handleClickAgent() {
    setRandomAgent("");
    updateRoomState({roomId: roomId || 'default', data: { agentUuid: "", agentAbilities: [], agentDescription: ""}});
  }

  function getAgentData(property: string) {
    const result = agents?.find(
      (agent: IAgent) => agent.uuid === randomAgent
    );
    return result[property];
  }

  function getAgentClass(property: string) {
    const result = agents?.find(
      (agent: IAgent) => agent.uuid === randomAgent
    );
    return result.role[property];
  }

  function getAgentAbilities(randomA: string) {
    const result = agents?.find((agent: IAgent) => agent.uuid === randomA);
    setAbilities(result.abilities);
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
        <Background type="image" src={BgScreen} overlay />
        
        <div className="flex justify-end py-4 px-8 z-0">
          <ChangeLanguage />
        </div>

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

        <Button handleClickButton={handleClickButton} />

        {agents && (
          <CardAgents
            agents={agents}
            randomAgent={randomAgent}
            handleClickAgent={handleClickAgent}
          />
        )}
      </main>
    </>
  );
};

export default App;
