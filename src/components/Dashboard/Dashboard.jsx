import './Dashboard.css';
  
export default function Dashboard({agents, randomAgent}) {
    return (
    <div className="Dashboard">
        <div className="layout-agent">
            {agents.map((agent) => { 

                let variavel = (randomAgent == agent.uuid ? "card-agent-random" : "card-agent-opacity");

                if (!randomAgent) {
                    variavel = "card-agent";    
                }

                return (
                    <section key={agent.uuid} className={variavel}>
                        <img src={agent.displayIcon} alt="icone do agente" />
                    </section>
                )
            })}
        </div>
    </div>
    )
}