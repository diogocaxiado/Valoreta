import "./App.css";
import { useState } from "react";
import useCallAgents from "./hooks/useCallAgents";
import Background from "./components/Background/Background";
import Message from "./components/Message/Message";
import CardAgents from "./components/CardAgents/CardAgents";
import Button from "./components/Button/Button";
import BackgroundAgent from "./components/PortraitAgent/PortraitAgent";
import Overview from "./components/Overview/Overview";

function App() {
  const [randomAgent, setRandomAgent] = useState("");
  const [abilities, setAbilities] = useState([]);
  const { agents, isLoading } = useCallAgents();

  function handleClickButton() {
    const random = Math.floor(Math.random() * (agents.length - 1));
    setRandomAgent(agents[random].uuid);
  }

  function handleClickAgent() {
    setRandomAgent("");
  }

  function getAgentData(property) {
    const result = agents.find((agent) => agent.uuid === randomAgent);
    return result[property];
  }

  function getAgentClass(property) {
    const result = agents.find((agent) => agent.uuid === randomAgent);
    return result.role[property];
  }

  function getAgentAbilities() {
    const result = agents.find((agent) => agent.uuid === randomAgent);
    setAbilities(result.abilities);
  }

  return (
    <>
      <Background />

      <main className="content">
        {randomAgent ? (
          <BackgroundAgent
            getAgentData={getAgentData}
            getAgentClass={getAgentClass}
          />
        ) : null}
        {randomAgent ? (
          <Overview
            getAgentData={getAgentData}
            getAgentClass={getAgentClass}
            abilities={abilities}
          />
        ) : null}

        <Message
          randomAgent={randomAgent}
          getAgentAbilities={getAgentAbilities}
        />
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
}

export default App;
