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
          ? "flex justify-center items-center z-10 h-96 my-12 transition-all duration-300 ease-in-out"
          : "flex justify-center items-center relative z-10 h-88 my-12 bg-black/50 transition-all duration-300 ease-in-out"
      }
    >
      <div className="flex flex-col items-center gap-5">
        {!randomAgent && (
          <img
            className="absolute top-4 opacity-40 w-96"
            src={Image}
            alt="Valoreta logo"
          />
        )}
        {!randomAgent && (
          <h1 className="text-6xl font-bold z-10 text-valorant-red font-valorant">
            vAloreta
          </h1>
        )}
        {!randomAgent && (
          <p className="text-center text-h4 z-10 text-valorant-cyan font-prompt">
            Vamos ver qual agente será o seu!
          </p>
        )}
        {!randomAgent && isMultiplayer && (
          <p className={`text-sm z-10 font-prompt ${
            isHost ? "text-valorant-cyan/60" : "text-white/40"
          }`}>
            {isHost
              ? "👑 Você é o Host — clique em Rodar para iniciar"
              : "Aguardando o Host iniciar a roleta..."}
          </p>
        )}
      </div>
    </section>
  );
}
