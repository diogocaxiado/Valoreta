import { IAgent } from "../../types";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface CardAgentsProps {
  agents: IAgent[]
  enabledAgents: IAgent[]
  randomAgent: IAgent["uuid"] | null
  handleClickAgent: () => void
  handleEnabledAgent: (agent: IAgent) => void
}

export default function CardAgents({ agents, enabledAgents, randomAgent, handleClickAgent, handleEnabledAgent }: CardAgentsProps) {
  function isAgentEnabled(agent: IAgent) {
    return enabledAgents?.some((item) => item.uuid === agent.uuid);
  }

  function handleChoiceAgent(agent: IAgent) {
    if (randomAgent === agent.uuid) {
      handleClickAgent();
      return;
    }

    handleEnabledAgent(agent);
  }

  return (
    <section className="flex justify-center items-center relative z-10">
      <div className={`flex flex-wrap justify-center items-center gap-1 w-2/4 p-3 mt-2 border-2 border-white/50 bg-black/80 relative ${randomAgent ? "mr-8": ""}`}>
        {agents.map((agent) => {
          const enabled = isAgentEnabled(agent);
          
          let agentSelected =
            randomAgent === agent.uuid
              ? "w-20 p-1 cursor-pointer opacity-100 transition-opacity duration-300 ease-in-out border-2 border-valorant-green bg-white/10"
              : "w-20 p-1 opacity-50 transition-all duration-300 ease-in-out border-2 border-white/30 bg-white/10";

          if (!randomAgent) {
            agentSelected = "w-20 p-1 cursor-pointer border-2 border-inset border-white/50 bg-white/5 hover:transition-all hover:ease-in-out hover:duration-75 hover:scale-105";
          }

          if (!enabled) {
            agentSelected =
              "w-20 p-1 cursor-pointer border-2 border-2 border-white/30 bg-black/30 transition-all duration-300 ease-in-out";
          }

          return (
            <section
              key={agent.uuid}
              className={`${agentSelected} relative`}
              onClick={() => handleChoiceAgent(agent)}
            >
              {!enabled && (
                <XMarkIcon className="absolute top-1 left-1 w-6 h-6 text-red-500" />
              )}

              <img
                className={`w-full ${!enabled ? "opacity-40" : ""}`}
                src={agent.displayIcon}
                alt={`Ícone do agente ${agent.displayName}`}
              />
            </section>
          );
        })}
      </div>
    </section>
  );
}
