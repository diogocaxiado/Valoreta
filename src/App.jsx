import "./App.css";
import { useState } from "react";
import useCallAgents from "./hooks/useCallAgents";
import Background from "./components/Background/Background";
import Main from "./components/Main/Main";
import Card from "./components/Card/Card";
import Button from "./components/Button/Button";
import BackgroundAgent from "./components/PortraitAgent/PortraitAgent";
import Overview from "./components/Overview/Overview";

function App() {
  const [randomAgent, setRandomAgent] = useState("");
  const { agents, isLoading } = useCallAgents();

  function handleClick() {
    const random = Math.floor(Math.random() * (agents.length - 1));
    setRandomAgent(agents[random].uuid);
  }

  function getAgentData(property) {
    const result = agents.find((agent) => agent.uuid === randomAgent);
    return result[property];
  }

  function getAgentClass(property) {
    const result = agents.find((agent) => agent.uuid === randomAgent);
    return result.role[property];
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
          <Overview getAgentData={getAgentData} getAgentClass={getAgentClass} />
        ) : null}

        <Main randomAgent={randomAgent} />
        {agents && <Card agents={agents} randomAgent={randomAgent} />}
        <Button handleClick={handleClick} />
      </main>
    </>
  );
}

export default App;
