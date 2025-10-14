import { useState } from "react";
import useCallApi from "../../hooks/useCallApi";
import Background from "../../components/Background/Background";
import Message from "../../components/Message/Message";
import CardAgents from "../../components/CardAgents/CardAgents";
import Button from "../../components/Button/Button";
import BackgroundAgent from "../../components/PortraitAgent/PortraitAgent";
import Overview from "../../components/Overview/Overview";

import { IAgent } from "../../types";

const App = () => {
  const [randomAgent, setRandomAgent] = useState("");
  const [abilities, setAbilities] = useState([]);
  const [descriptionAbility, setDescriptionAbility] = useState("");
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

  function handleClickButton() {
    const random = Math.floor(Math.random() * (agents.length - 1));
    setRandomAgent(agents[random].uuid);
    getAgentAbilities(agents[random].uuid);
    setDescriptionAbility("");
  }

  function handleClickAgent() {
    setRandomAgent("");
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
        <Background />

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
