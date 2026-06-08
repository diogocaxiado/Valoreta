interface CardAbilitiesProps {
  name: string;
  src: string;
  alt: string;
  handle: (arg: string) => void;
}

export function CardAbilities({ name, src, alt, handle }: CardAbilitiesProps) {
  return (
    <section
      className="flex flex-col items-center z-20 w-full bg-white/30"
      key={name}
    >
      <div
        className="flex justify-center items-center cursor-pointer h-8 w-full border-b-2 border-white/30 hover:bg-valorant-cyan hover:text-black"
        onClick={() => handle(name)}
      >
        <strong className="font-prompt text-sm text-center uppercase">
          {name}
        </strong>
      </div>

      <img className="w-14 p-2.5" src={src} alt={alt} />
    </section>
  );
}
