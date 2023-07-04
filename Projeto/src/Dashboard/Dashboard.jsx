import Agentes from '../Agentes/Agentes';
import './Dashboard.css';
import { useEffect, useState } from "react";
  
function Dashboard() {

    const [agents, setAgents] = useState([]);

    useEffect(() => {
        fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true")
        .then(response => response.json())
        .then(data => {setAgents(data.data)});
    }, []);
    
    
    return (
    <div className="Dashboard">
        <div className="layout-agent">
            {agents.map(function(agent) {
                return (
                    <Agentes key={agent.uuid} imgAgente={agent.displayIcon} />
                )
            })}
        </div>
    </div>
    )
}

export default Dashboard;