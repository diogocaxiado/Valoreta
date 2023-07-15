import Agentes from '../Agentes/Agentes';
import './Dashboard.css';
import { useEffect, useState } from "react";
  
export default function Dashboard() {

    const [agents, setAgents] = useState([]);

    useEffect(() => {
        fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true")
        .then(response => response.json())
        .then(data => {setAgents(data.data)});
    }, []);

    return (
    <div className="Dashboard">
        <div className="layout-agent">
            {agents.map((agent) => { 
                return (
                    <Agentes key={agent.uuid} imgAgent={agent.displayIcon} />
                )
            })}
        </div>
    </div>
    )
}