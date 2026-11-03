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
    <section className="flex justify-center items-center relative z-10 px-2 sm:px-4">
      <div
        className={`flex flex-wrap justify-center items-center gap-1 sm:gap-1.5 w-[94%] sm:w-[88%] md:w-3/4 lg:w-3/5 xl:w-2/4 max-w-4xl p-2 sm:p-2.5 md:p-3 mt-1 md:mt-2 border-2 border-white/50 bg-black/80 relative transition-all ${
          randomAgent ? "lg:mr-8" : ""
        } ${isParticipant ? "grayscale-[30%] after:absolute after:inset-0 after:bg-black/20 after:pointer-events-none" : ""}`}
      >
        {isParticipant && (
          <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 text-[9px] sm:text-[10px] font-montserrat font-bold uppercase tracking-wider text-white/50 bg-black/60 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-sm border border-white/10 pointer-events-none">
            👤 Visualização
          </span>
        )}

        {agents.map((agent) => {
          const enabled = isAgentEnabled(agent);
          const isWinner = randomAgent === agent.uuid;

          const baseSizing = "w-12 sm:w-14 md:w-16 lg:w-20 p-0.5 sm:p-1";

          let agentSelected =
            isWinner
              ? `${baseSizing} opacity-100 transition-opacity duration-300 ease-in-out border-2 border-valorant-green bg-white/10 shadow-[0_0_12px_rgba(30,255,60,0.4)] cursor-pointer hover:scale-105 hover:transition-all hover:ease-in-out hover:duration-75`
              : `${baseSizing} opacity-50 transition-all duration-300 ease-in-out border-2 border-white/30 bg-white/10`;

          if (!randomAgent) {
            agentSelected = isParticipant
              ? `${baseSizing} cursor-default border-2 border-inset border-white/50 bg-white/5 opacity-60`
              : `${baseSizing} cursor-pointer border-2 border-inset border-white/50 bg-white/5 hover:transition-all hover:ease-in-out hover:duration-75 hover:scale-105`;
          }

          if (!enabled && !isWinner) {
            agentSelected =
              `${baseSizing} cursor-pointer border-2 border-white/30 bg-black/30 transition-all duration-300 ease-in-out`;
          }

          return (
            <section
              key={agent.uuid}
              className={`${agentSelected} relative select-none`}
              onClick={() => handleChoiceAgent(agent)}
              title={!canInteract ? "Apenas o Host pode gerenciar os agentes" : undefined}
            >
              {!enabled && !isWinner && (
                <XMarkIcon className="absolute top-0.5 left-0.5 sm:top-1 sm:left-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-500" />
              )}

              <img
                className={`w-full object-contain ${!enabled && !isWinner ? "opacity-40" : ""}`}
                src={agent.displayIcon}
                alt={`Ícone do agente ${agent.displayName}`}
              />

              {isWinner && (
                <span className="absolute bottom-0.5 sm:bottom-1 left-1/2 -translate-x-1/2 text-[6px] sm:text-[7px] md:text-[8px] font-montserrat font-bold uppercase tracking-wider text-valorant-green bg-black/80 px-1 py-0.5 rounded-sm whitespace-nowrap">
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
