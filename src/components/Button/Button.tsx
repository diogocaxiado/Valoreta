import { t } from "i18next";

interface ButtonProps {
  title: string
  variant?: "primary" | "secondary"
  handleClickButton: () => void
  disabled?: boolean
}

export default function Button({ title, variant = "secondary", handleClickButton, disabled }: ButtonProps) {
  return (
    <section className="flex justify-center items-center relative z-10">
      <div className="relative group">
        <div className={`${disabled && "hover:border-valorant-purple"} p-0.5 border border-valorant-purple rounded-sm hover:border-valorant-red hover:transition-all hover:duration-300 hover:ease-in`}>
          <button
            className={`${variant === "primary" ? 
              "text-white bg-valorant-red text-3xl px-20 py-2.5" : 
              "text-white bg-[#3CB371] text-3xl px-10 py-2.5 min-w-72"} 
              cursor-pointer border-none font-tungsten uppercase hover:brightness-125 hover:transition-all hover:duration-300 hover:ease-in
              ${disabled && "cursor-default opacity-50 hover:brightness-100"}`
            }
            disabled={disabled}
            onClick={() => handleClickButton()}
          >
            {title}
          </button>
        </div>

        {disabled && (
          <span
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2
            bg-black text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 
            transition-opacity duration-300 whitespace-nowrap pointer-events-none"
          >
            Escolha um agente antes de rodar!
          </span>
        )}
      </div>
    </section>
  );
}
