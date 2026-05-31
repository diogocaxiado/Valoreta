interface TotalizerProps {
  total: number;
}

export default function Totalizer({ total }: TotalizerProps) {
  return (
    <section className="flex justify-center items-center relative z-10">
      <div className="flex flex-wrap justify-center items-center gap-2 w-2/4 p-3 mt-2 border-2 border-white/50 bg-black/80 relative">
        <h2 className="text-2xl font-bold text-white">
          Jogadores na sala: 
        </h2>

        <span className="text-3xl font-bold text-valorant-green">
          {total}
        </span>
      </div>
    </section>
  );
}