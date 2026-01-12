interface IButtonLobby {
  onClick: () => void
  srcImage: string
  altImage: string
  title: string
  description: string 
}

export default function ButtonLobby({ onClick, srcImage, altImage, title, description }: IButtonLobby) {
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
      <img
        className="size-20"
        src={srcImage}
        alt={altImage}
      />

      <div
        className="flex flex-col gap-2 w-52"
      >
        <h3 className="text-2xl text-white font-bold uppercase font-prompt text-center">{title}</h3>
        <p className="text-base text-white font-prompt text-center">{description}</p>
      </div>
    </div>
  )
}
