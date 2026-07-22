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
  const hasResult = !!randomAgent;

  return (
    <section className="flex justify-center items-center relative z-10">
      <div
        className={`flex flex-wrap justify-center items-center gap-1 w-2/4 p-3 mt-2 border-2 border-white/50 bg-black/80 relative ${
          hasResult ? "mr-8" : ""
        } ${isParticipant ? "grayscale-[30%] after:absolute after:inset-0 after:bg-black/20 after:pointer-events-none" : ""}`}
      >
        {agents.map((agent) => {
          const enabled = isAgentEnabled(agent);
          const isWinner = randomAgent === agent.uuid;

          let agentSelected: string;

          if (hasResult) {
            if (isWinner) {
              agentSelected = isParticipant
                ? "w-20 p-1 cursor-default opacity-100 transition-opacity duration-300 ease-in-out border-2 border-valorant-green bg-white/10 shadow-[0_0_12px_rgba(30,255,60,0.4)]"
                : "w-20 p-1 cursor-pointer opacity-100 transition-all duration-300 ease-in-out border-2 border-valorant-green bg-white/10 shadow-[0_0_12px_rgba(30,255,60,0.4)] hover:scale-105";
            } else {
              agentSelected =
                "w-20 p-1 cursor-not-allowed opacity-40 transition-opacity duration-300 ease-in-out border-2 border-white/20 bg-white/5";
            }
          } else if (isSpinning) {
            agentSelected =
              "w-20 p-1 cursor-not-allowed opacity-50 transition-opacity duration-300 ease-in-out border-2 border-white/30 bg-white/5";
          } else if (isParticipant) {
            agentSelected =
              "w-20 p-1 cursor-default border-2 border-inset border-white/50 bg-white/5 opacity-60";
          } else {
            agentSelected =
              "w-20 p-1 cursor-pointer border-2 border-inset border-white/50 bg-white/5 hover:transition-all hover:ease-in-out hover:duration-75 hover:scale-105";
          }

          if (!enabled && !isWinner && !hasResult) {
            agentSelected +=
              " border-2 border-white/30 bg-black/30 opacity-40";
          }

          let cardTitle: string | undefined;
          if (isSpinning) {
            cardTitle = "Aguarde a animação terminar";
          } else if (isWinner && canInteract) {
            cardTitle = "Clique para limpar o resultado";
          } else if (hasResult && !isWinner) {
            cardTitle = "Aguarde para interagir";
          } else if (!canInteract) {
            cardTitle = "Apenas o Host pode gerenciar os agentes";
          }

          return (
            <section
              key={agent.uuid}
              className={`${agentSelected} relative`}
              onClick={() => handleChoiceAgent(agent)}
              title={cardTitle}
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
