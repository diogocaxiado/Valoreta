import "./App.css";
import { useState } from "react";
import Background from "./components/Background/Background";
import Main from "./components/Main/Main";
import Card from "./components/Card/Card";
import Button from "./components/Button/Button";
import BackgroundAgent from "./components/BackgroundAgent/BackgroundAgent";
import Select from "./components/Select/Select";
import useCallAgents from "./hooks/useCallAgents";

function App() {
  const [randomAgent, setRandomAgent] = useState("");
  const { agents, isLoading } = useCallAgents();

  function handleClick() {
    const random = Math.floor(Math.random() * (agents.length - 1));
    setRandomAgent(agents[random].uuid);
    setAgents(agents);
  }

  function getAgentData(property) {
    const result = agents.find((agent) => agent.uuid === randomAgent);
    return result[property];
  }

  function getAgentClass() {
    const result = agents.find((agent) => agent.uuid === randomAgent);
    return result.role.displayIcon;
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
        {randomAgent ? <Select getAgentData={getAgentData} /> : null}

        <Main randomAgent={randomAgent} />
        {agents && <Card agents={agents} randomAgent={randomAgent} />}
        <Button handleClick={handleClick} />
      </main>
    </>
  );
}

export default App;
