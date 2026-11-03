import Image from "../../../assets/image/Valorant-Icon.png";

interface RouletteMessageProps {
  randomAgent: string;
  isMultiplayer?: boolean;
  isHost?: boolean;
}

export function RouletteMessage({ randomAgent, isMultiplayer, isHost }: RouletteMessageProps) {
  return (
    <section
      className={
        randomAgent
          ? "flex justify-center items-center z-10 h-28 sm:h-36 md:h-48 lg:h-80 xl:h-96 my-1 sm:my-2 md:my-4 lg:my-8 xl:my-12 transition-all duration-300 ease-in-out"
          : "flex justify-center items-center relative z-10 h-36 sm:h-48 md:h-60 lg:h-72 xl:h-88 my-1 sm:my-2 md:my-4 lg:my-8 xl:my-12 bg-black/50 transition-all duration-300 ease-in-out"
      }
    >
      <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 px-4 text-center">
        {!randomAgent && (
          <img
            className="absolute top-2 sm:top-4 opacity-40 w-44 sm:w-60 md:w-80 lg:w-96 pointer-events-none"
            src={Image}
            alt="Valoreta logo"
          />
        )}
        {!randomAgent && (
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold z-10 text-valorant-red font-valorant tracking-wider">
            vAloreta
          </h1>
        )}
        {!randomAgent && (
          <p className="text-center text-sm sm:text-base md:text-lg lg:text-h4 z-10 text-valorant-cyan font-prompt">
            Vamos ver qual agente será o seu!
          </p>
        )}
        {!randomAgent && isMultiplayer && (
          <p
            className={`text-xs sm:text-sm z-10 font-prompt ${
              isHost ? "text-valorant-cyan/70" : "text-white/50"
            }`}
          >
            {isHost
              ? "👑 Você é o Host — clique em Rodar para iniciar"
              : "Aguardando o Host iniciar a roleta..."}
          </p>
        )}
      </div>
    </section>
  );
}
