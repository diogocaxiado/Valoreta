interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  return (
    <div className="relative w-fit mx-auto">
      <div
        className="
          px-12 py-2
          border border-cyan-400 border-t-0
          bg-gradient-to-b from-cyan-800/30 to-transparent
          shadow-[0_0_15px_rgba(0,255,255,0.7)]
          backdrop-blur-sm
        "
      >
        <h2 className="text-2xl text-white font-bold uppercase font-prompt">
          {title}
        </h2>
      </div>
    </div>
  );
}
