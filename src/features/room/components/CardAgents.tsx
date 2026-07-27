import { IAgent } from "../../../types";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface CardAgentsProps {
  agents: IAgent[];
  enabledAgents: IAgent[];
  randomAgent: string;
  handleClickAgent: () => void;
  handleEnabledAgent: (agent: IAgent) => void;
  canInteract?: boolean;
  isSpinning?: boolean;
}

export function CardAgents({
  agents,
  enabledAgents,
  randomAgent,
  handleClickAgent,
  handleEnabledAgent,
  canInteract = true,
  isSpinning = false,
}: CardAgentsProps) {
  function isAgentEnabled(agent: IAgent) {
    return enabledAgents?.some((item) => item.uuid === agent.uuid);
  }

  function handleChoiceAgent(agent: IAgent) {
    if (!canInteract) return;
    if (isSpinning) return;
    if (randomAgent === agent.uuid) {
      handleClickAgent();
      return;
    }
    if (randomAgent) return;

    handleEnabledAgent(agent);
  }

  const isParticipant = !canInteract;

  return (
    <section className="flex justify-center items-center relative z-10">
      <div
        className={`flex flex-wrap justify-center items-center gap-1 w-2/4 p-3 mt-2 border-2 border-white/50 bg-black/80 relative ${
          randomAgent ? "mr-8" : ""
        } ${isParticipant ? "grayscale-[30%] after:absolute after:inset-0 after:bg-black/20 after:pointer-events-none" : ""}`}
      >
        {isParticipant && (
          <span className="absolute top-2 right-2 z-10 text-[10px] font-montserrat font-bold uppercase tracking-wider text-white/50 bg-black/60 px-2 py-1 rounded-sm border border-white/10 pointer-events-none">
            👤 Somente visualização
          </span>
        )}

        {agents.map((agent) => {
          const enabled = isAgentEnabled(agent);
          const isWinner = randomAgent === agent.uuid;

          let agentSelected =
            isWinner
              ? "w-20 p-1 opacity-100 transition-opacity duration-300 ease-in-out border-2 border-valorant-green bg-white/10 shadow-[0_0_12px_rgba(30,255,60,0.4)]"
              : "w-20 p-1 opacity-50 transition-all duration-300 ease-in-out border-2 border-white/30 bg-white/10";

          if (!randomAgent) {
            agentSelected = isParticipant
              ? "w-20 p-1 cursor-default border-2 border-inset border-white/50 bg-white/5 opacity-60"
              : "w-20 p-1 cursor-pointer border-2 border-inset border-white/50 bg-white/5 hover:transition-all hover:ease-in-out hover:duration-75 hover:scale-105";
          }

          if (!enabled && !isWinner) {
            agentSelected =
              "w-20 p-1 cursor-pointer border-2 border-2 border-white/30 bg-black/30 transition-all duration-300 ease-in-out";
          }

          return (
            <section
              key={agent.uuid}
              className={`${agentSelected} relative`}
              onClick={() => handleChoiceAgent(agent)}
              title={!canInteract ? "Apenas o Host pode gerenciar os agentes" : undefined}
            >
              {!enabled && !isWinner && (
                <XMarkIcon className="absolute top-1 left-1 w-6 h-6 text-red-500" />
              )}

              <img
                className={`w-full ${!enabled && !isWinner ? "opacity-40" : ""}`}
                src={agent.displayIcon}
                alt={`Ícone do agente ${agent.displayName}`}
              />

              {isWinner && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-montserrat font-bold uppercase tracking-wider text-valorant-green bg-black/70 px-1 py-0.5 rounded-sm whitespace-nowrap">
                  Sorteado
                </span>
              )}
            </section>
          );
        })}
      </div>
    </section>
  );
}
