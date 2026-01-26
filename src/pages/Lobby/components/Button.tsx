import { CubeIcon, UserGroupIcon } from "@heroicons/react/24/solid";

interface IButtonLobby {
  onClick: () => void
  title: string
  description: string 
  icon?: "solo" | "group";
}

export default function ButtonLobby({ onClick, title, description, icon = "solo" }: IButtonLobby) {
  const IconComponent = icon === "solo" ? CubeIcon : UserGroupIcon;

  return (
    <div 
      className="
        relative w-fit
        flex gap-4 p-4
        border border-cyan-400 border-t-0 rounded-2xl
        bg-gradient-to-b from-cyan-800/30 to-transparent
        shadow-[0_0_15px_rgba(0,255,255,0.7)]
        backdrop-blur-sm
        cursor-pointer
        transition-all duration-300 ease-out
        hover:shadow-[0_0_25px_rgba(0,255,255,0.9)]
        hover:brightness-125
        hover:-translate-y-[2px]
        hover:border-cyan-300
      "
      onClick={onClick}
    >
      <IconComponent className="w-20 h-20 text-cyan-300" />

      <div
        className="flex flex-col gap-2 w-64"
      >
        <h3 className="text-2xl text-white font-bold uppercase font-valorant text-center">{title}</h3>
        <p className="text-base text-white text-center font-prompt">{description}</p>
      </div>
    </div>
  )
}
