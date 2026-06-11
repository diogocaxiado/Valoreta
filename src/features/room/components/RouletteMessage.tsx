import Image from "../../../assets/image/Valorant-Icon.png";

interface RouletteMessageProps {
  randomAgent: string;
}

export function RouletteMessage({ randomAgent }: RouletteMessageProps) {
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
      </div>
    </section>
  );
}
