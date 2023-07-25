import "./CardAgents.css";

export default function CardAgents({ agents, randomAgent, handleClickAgent }) {
  return (
    <div className="card">
      <div className="layout-agent">
        {agents.map((agent) => {
          let variavel =
            randomAgent == agent.uuid
              ? "card-agent-random"
              : "card-agent-opacity";

          if (!randomAgent) {
            variavel = "card-agent";
          }

          return (
            <section key={agent.uuid} className={variavel}>
              <img
                onClick={randomAgent == agent.uuid && handleClickAgent}
                src={agent.displayIcon}
                alt="icone do agente"
              />
            </section>
          );
        })}
      </div>
    </div>
  );
}
