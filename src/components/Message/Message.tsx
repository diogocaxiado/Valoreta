
import Image from "../../assets/image/Valorant-Icon.png";

interface MessageProps {
  randomAgent: string;
}

export default function Message({ randomAgent }: MessageProps) {
  return (
    <section className={randomAgent ? "flex justify-center items-center z-10 h-96 my-12 transition-all duration-300 ease-in-out" : "flex justify-center items-center relative z-10 h-96 my-12 bg-black/50 transition-all duration-300 ease-in-out"}>
      <div className="flex flex-col items-center gap-5">
        {!randomAgent && <img className="absolute top-4 opacity-50 w-96" src={Image} />}
        {!randomAgent && <h1 className="text-6xl text-center z-10 text-valorant-yellow">Valoreta</h1>}
        {!randomAgent && (
          <p className="text-center text-2xl z-10 text-cyan-400">
            Está com dúvida no que jogar? Clique no botão
          </p>
        )}
      </div>
    </section>
  );
}
