import "./App.css";
import { useState, useEffect } from "react";
import Background from "./components/Background/Background";
import Main from "./components/Main/Main";
import Card from "./components/Card/Card";
import Button from "./components/Button/Button";
import BackgroundAgent from "./components/BackgroundAgent/BackgroundAgent";

function App() {
  const [agents, setAgents] = useState([]);
  const [randomAgent, setRandomAgent] = useState("");

  useEffect(() => {
    fetch(
      "https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=pt-BR"
    )
      .then((response) => response.json())
      .then((data) => {
        setAgents(data.data);
      });
  }, [randomAgent]);

  function handleClick() {
    const random = Math.floor(Math.random() * (agents.length - 1));
    setRandomAgent(agents[random].uuid);
    setAgents(agents);
  }

  function getAgentData(property) {
    const result = agents.find((agent) => agent.uuid === randomAgent);
    return result[property];
  }

  return (
    <>
      <Background />

      <main className="content">
        {randomAgent ? <BackgroundAgent getAgentData={getAgentData} /> : null}

        <Main getAgentData={getAgentData} randomAgent={randomAgent} />
        <Card agents={agents} randomAgent={randomAgent} />
        <Button handleClick={handleClick} />
      </main>
    </>
  );
}

export default App;
