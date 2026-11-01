interface CardAbilitiesProps {
  name: string;
  src: string;
  alt: string;
  handle: (arg: string) => void;
}

export function CardAbilities({ name, src, alt, handle }: CardAbilitiesProps) {
  return (
    <section
      className="flex flex-col items-center z-20 w-full bg-white/30 min-w-0"
      key={name}
    >
      <div
        className="flex justify-center items-center cursor-pointer h-6 sm:h-7 md:h-8 w-full border-b-2 border-white/30 hover:bg-valorant-cyan hover:text-black transition-colors"
        onClick={() => handle(name)}
      >
        <strong className="font-prompt text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-center uppercase truncate px-0.5">
          {name}
        </strong>
      </div>

      <img
        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 p-1 sm:p-1.5 md:p-2 lg:p-2.5 object-contain"
        src={src}
        alt={alt}
      />
    </section>
  );
}
