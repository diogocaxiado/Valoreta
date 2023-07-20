import './App.css';
import {useState, useEffect, useContext} from 'react';
import Fundo from './components/Fundo/Fundo';
import Principal from './components/Principal/Principal';
import Dashboard from './components/Dashboard/Dashboard';
import Botao from './components/Botao/Botao';

function App() {
  
  const [agents, setAgents] = useState([]);
  const [randomAgent, setRandomAgent] = useState("");

    useEffect(() => {
        fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true")
        .then(response => response.json())
        .then(data => {setAgents(data.data)});
    }, [randomAgent, agents]);

    function handleClick() {
      const random = Math.floor(Math.random() * (agents.length - 1));
      setRandomAgent(agents[random].uuid);
      setAgents(agents);
    }
 
  return (
    <>
      <Fundo />

      <Principal />
      <Dashboard 
        agents = {agents}
        randomAgent = {randomAgent}
      />
      <Botao 
        handleClick = {handleClick}
      />
    </>
  )
}

export default App
