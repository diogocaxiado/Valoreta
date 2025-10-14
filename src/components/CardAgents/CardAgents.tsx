
interface CardAgentsProps {
  agents: any
  randomAgent: any
  handleClickAgent: () => void
}

export default function CardAgents({ agents, randomAgent, handleClickAgent }: CardAgentsProps) {
  return (
    <section className="flex justify-center items-center relative z-10">
      <div className="flex flex-wrap justify-center items-center gap-1 w-3/6 p-3 mt-5 border-2 border-white/50 bg-black/80">
        {agents.map((agent) => {
          let variavel =
            randomAgent === agent.uuid
              ? "w-20 p-1 cursor-pointer opacity-100 transition-opacity duration-300 ease-in-out border-2 border-valorant-green bg-white/10"
              : "w-20 p-1 opacity-50 transition-all duration-300 ease-in-out border-2 border-white/30 bg-white/10";

          if (!randomAgent) {
            variavel = "w-20 p-1 cursor-pointer border-2 border-inset border-white/50 bg-white/5 hover:transition-all hover:ease-in-out hover:duration-75 hover:scale-105";
          }

          return (
            <section
              key={agent.uuid}
              className={variavel}
              onClick={
                randomAgent === agent.uuid ? handleClickAgent : undefined
              }
            >
              <img className="w-full" src={agent.displayIcon} alt="icone do agente" />
            </section>
          );
        })}
      </div>
    </section>
  );
}
