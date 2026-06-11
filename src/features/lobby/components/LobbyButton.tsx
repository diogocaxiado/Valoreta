import { CubeIcon, UserGroupIcon } from "@heroicons/react/24/solid";

interface LobbyButtonProps {
  onClick: () => void;
  title: string;
  description: string;
  icon?: "solo" | "group";
}

export function LobbyButton({
  onClick,
  title,
  description,
  icon = "solo",
}: LobbyButtonProps) {
  const IconComponent = icon === "solo" ? CubeIcon : UserGroupIcon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex gap-4 p-4
        border border-cyan-400 border-t-0 rounded-2xl
        bg-gradient-to-b from-cyan-800/30 to-transparent
        shadow-[0_0_15px_rgba(0,255,255,0.7)]
        backdrop-blur-sm
        transition-all duration-300 ease-out
        hover:shadow-[0_0_25px_rgba(0,255,255,0.9)]
        hover:brightness-125
        hover:-translate-y-[2px]
        hover:border-cyan-300
        active:scale-[0.98]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valorant-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black
        cursor-pointer select-none
        w-full text-left
      "
    >
      <IconComponent className="w-20 h-20 text-cyan-300 shrink-0" />

      <div className="flex flex-col gap-2 w-64">
        <h3 className="text-xl text-white font-montserrat font-bold uppercase text-center">
          {title}
        </h3>
        <p className="text-base text-white text-center font-prompt">
          {description}
        </p>
      </div>
    </button>
  );
}
